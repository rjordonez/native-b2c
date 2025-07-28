const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const openaiService = require('../services/openaiService');
const logger = require('../utils/logger');

const router = express.Router();

// Rate limiting for enhancement endpoint
const enhanceLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 enhancement requests per windowMs
  message: {
    success: false,
    message: 'Too many enhancement requests, please try again later.'
  },
  skipSuccessfulRequests: true
});

/**
 * POST /api/enhancement/enhance
 * Enhance transcript using OpenAI GPT
 */
router.post('/enhance', enhanceLimit, [
  body('transcript')
    .isString()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Transcript must be a string between 1 and 5000 characters'),
], async (req, res) => {
  const requestId = req.id;
  const startTime = Date.now();

  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Enhancement request validation failed', {
        requestId,
        errors: errors.array()
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: errors.array()
      });
    }

    const { transcript } = req.body;

    logger.info('Processing transcript enhancement request', {
      requestId,
      transcriptLength: transcript.length,
      wordCount: transcript.split(/\s+/).filter(word => word.length > 0).length
    });

    // Enhance the transcript using OpenAI
    const enhancedTranscript = await openaiService.enhanceTranscript(transcript);

    const processingTime = Date.now() - startTime;

    logger.info('Transcript enhancement completed successfully', {
      requestId,
      processingTimeMs: processingTime,
      originalLength: transcript.length,
      enhancedLength: enhancedTranscript.length
    });

    res.json({
      success: true,
      data: {
        originalTranscript: transcript,
        enhancedTranscript,
        metadata: {
          requestId,
          processingTimeMs: processingTime,
          originalInfo: {
            length: transcript.length,
            wordCount: transcript.split(/\s+/).filter(word => word.length > 0).length
          },
          enhancedInfo: {
            length: enhancedTranscript.length,
            wordCount: enhancedTranscript.split(/\s+/).filter(word => word.length > 0).length
          }
        }
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    logger.error('Transcript enhancement failed', {
      requestId,
      error: error.message,
      processingTimeMs: processingTime
    });

    // Return user-friendly error message
    const statusCode = error.message.includes('API key') ? 503 : 500;
    const message = error.message.includes('API key') 
      ? 'Enhancement service temporarily unavailable'
      : 'Failed to enhance transcript. Please try again.';

    res.status(statusCode).json({
      success: false,
      message,
      requestId
    });
  }
});

/**
 * GET /api/enhancement/health
 * Health check for enhancement service
 */
router.get('/health', async (req, res) => {
  try {
    const health = await openaiService.healthCheck();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json({
      success: health.status === 'healthy',
      ...health
    });
  } catch (error) {
    logger.error('Enhancement health check error:', error.message);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      service: 'OpenAI Enhancement',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;