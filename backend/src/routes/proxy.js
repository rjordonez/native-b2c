const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../config/config');

const router = express.Router();

/**
 * POST /api/proxy/submit
 * Proxy requests to external submission API
 */
router.post('/submit', async (req, res, next) => {
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info(`[${requestId}] Proxy submission request received`);
  
  try {
    const { audio_urls, submission_url } = req.body;

    // Validate request
    if (!audio_urls || !submission_url) {
      logger.warn(`[${requestId}] Missing required fields:`, {
        hasAudioUrls: !!audio_urls,
        hasSubmissionUrl: !!submission_url
      });
      
      return res.status(400).json({ 
        success: false,
        error: "Missing audio_urls or submission_url" 
      });
    }

    logger.info(`[${requestId}] Forwarding to external API:`, {
      submissionUrl: submission_url,
      audioUrlCount: Array.isArray(audio_urls) ? audio_urls.length : 1,
      targetApi: config.externalApis.submissionUrl
    });

    // Forward request to external API
    const startTime = Date.now();
    const response = await axios.post(
      config.externalApis.submissionUrl,
      {
        audio_urls,
        submission_url,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        timeout: 30000 // 30 second timeout
      }
    );

    const processingTime = Date.now() - startTime;

    logger.info(`[${requestId}] External API request completed:`, {
      status: response.status,
      processingTimeMs: processingTime
    });

    // Return successful response
    res.json({
      success: true,
      data: response.data,
      metadata: {
        requestId,
        processingTimeMs: processingTime
      }
    });

  } catch (error) {
    logger.error(`[${requestId}] Proxy submission failed:`, {
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data
    });

    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        error: "Request timeout - external service took too long to respond"
      });
    }

    if (error.response) {
      // External API returned an error
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data?.error || "External API error",
        details: process.env.NODE_ENV === 'development' ? error.response.data : undefined
      });
    }

    if (error.request) {
      // Network error
      return res.status(503).json({
        success: false,
        error: "Unable to reach external service"
      });
    }

    // Other errors
    next(error);
  }
});

/**
 * GET /api/proxy/health
 * Health check for proxy service
 */
router.get('/health', async (req, res) => {
  try {
    // Test connectivity to external API
    const startTime = Date.now();
    let externalApiStatus = 'unknown';
    
    try {
      await axios.get(config.externalApis.submissionUrl.replace('/submit', '/health'), {
        timeout: 5000
      });
      externalApiStatus = 'healthy';
    } catch (error) {
      externalApiStatus = 'unhealthy';
      logger.warn('External API health check failed:', error.message);
    }
    
    const responseTime = Date.now() - startTime;
    
    const healthStatus = {
      status: 'healthy',
      service: 'proxy',
      externalApi: {
        url: config.externalApis.submissionUrl,
        status: externalApiStatus,
        responseTimeMs: responseTime
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(healthStatus);
  } catch (error) {
    logger.error('Proxy service health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      service: 'proxy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;