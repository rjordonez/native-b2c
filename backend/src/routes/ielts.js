const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { scoreTranscript, formatScoreMessage, healthCheck } = require('../services/ieltsService');

/**
 * POST /api/ielts/score
 * Score a transcript for IELTS band
 */
router.post('/score', async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info(`[${requestId}] IELTS scoring request received`);
  
  try {
    const { transcript, questionType } = req.body;
    
    // Validate input
    if (!transcript) {
      return res.status(400).json({
        success: false,
        error: 'Transcript is required'
      });
    }
    
    const startTime = Date.now();
    
    // Score the transcript
    const score = await scoreTranscript(transcript, questionType);
    
    const processingTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] IELTS scoring completed:`, {
      overallBand: score.overallBand,
      processingTimeMs: processingTime
    });
    
    res.json({
      success: true,
      score: score,
      formattedMessage: formatScoreMessage(score),
      metadata: {
        requestId,
        processingTimeMs: processingTime
      }
    });
    
  } catch (error) {
    logger.error(`[${requestId}] IELTS scoring failed:`, {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Failed to score transcript',
      requestId
    });
  }
});

/**
 * GET /api/ielts/health
 * Health check for IELTS scoring service
 */
router.get('/health', async (req, res) => {
  try {
    const health = await healthCheck();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('IELTS health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      service: 'ielts',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;