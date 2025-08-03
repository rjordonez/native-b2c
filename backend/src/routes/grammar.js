const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { analyzeGrammarAndVocab, formatFeedbackMessages, healthCheck } = require('../services/grammarService');

/**
 * POST /api/grammar/analyze
 * Analyze transcript for grammar and vocabulary feedback
 */
router.post('/analyze', async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info(`[${requestId}] Grammar analysis request received`);
  
  try {
    const { transcript, questionText } = req.body;
    
    // Validate input
    if (!transcript) {
      return res.status(400).json({
        success: false,
        error: 'Transcript is required'
      });
    }
    
    const startTime = Date.now();
    
    // Analyze the transcript
    const feedback = await analyzeGrammarAndVocab(transcript, questionText);
    
    const processingTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] Grammar analysis completed:`, {
      processingTimeMs: processingTime
    });
    
    res.json({
      success: true,
      feedback: feedback,
      messages: formatFeedbackMessages(feedback),
      metadata: {
        requestId,
        processingTimeMs: processingTime
      }
    });
    
  } catch (error) {
    logger.error(`[${requestId}] Grammar analysis failed:`, {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Failed to analyze transcript',
      requestId
    });
  }
});

/**
 * GET /api/grammar/health
 * Health check for grammar analysis service
 */
router.get('/health', async (req, res) => {
  try {
    const health = await healthCheck();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Grammar service health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      service: 'grammar',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;