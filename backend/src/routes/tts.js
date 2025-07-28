const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const ttsService = require('../services/ttsService');
const logger = require('../utils/logger');

const router = express.Router();

// Rate limiting for TTS endpoint
const ttsLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 TTS requests per windowMs
  message: {
    success: false,
    message: 'Too many text-to-speech requests, please try again later.'
  },
  skipSuccessfulRequests: true
});

/**
 * POST /api/tts/synthesize
 * Convert text to speech using Google TTS
 */
router.post('/synthesize', ttsLimit, [
  body('text')
    .isString()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Text must be a string between 1 and 5000 characters'),
  body('languageCode')
    .optional()
    .isString()
    .matches(/^[a-z]{2}-[A-Z]{2}$/)
    .withMessage('Language code must be in format xx-XX (e.g., en-US)'),
  body('voiceName')
    .optional()
    .isString()
    .withMessage('Voice name must be a string'),
  body('speakingRate')
    .optional()
    .isFloat({ min: 0.25, max: 4.0 })
    .withMessage('Speaking rate must be between 0.25 and 4.0'),
], async (req, res) => {
  const requestId = req.id;
  const startTime = Date.now();

  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('TTS request validation failed', {
        requestId,
        errors: errors.array()
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: errors.array()
      });
    }

    const { text, languageCode, voiceName, speakingRate } = req.body;

    logger.info('Processing text-to-speech request', {
      requestId,
      textLength: text.length,
      languageCode: languageCode || 'en-US',
      voiceName: voiceName || 'en-US-Journey-F',
      speakingRate: speakingRate || 1.0
    });

    // Convert text to speech
    const audioBuffer = await ttsService.textToSpeechConversion(text, {
      languageCode,
      voiceName,
      speakingRate,
      audioEncoding: 'MP3'
    });

    const processingTime = Date.now() - startTime;

    logger.info('Text-to-speech conversion completed successfully', {
      requestId,
      processingTimeMs: processingTime,
      textLength: text.length,
      audioSize: audioBuffer.length
    });

    // Convert audio buffer to base64 data URL
    const base64Audio = audioBuffer.toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    // Return JSON response with audio data URL
    res.json({
      success: true,
      data: {
        audioUrl,
        format: 'audio/mpeg',
        size: audioBuffer.length,
        text: text.substring(0, 100) + (text.length > 100 ? '...' : '') // Truncated text for reference
      },
      meta: {
        requestId,
        processingTimeMs: processingTime,
        textLength: text.length
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    logger.error('Text-to-speech conversion failed', {
      requestId,
      error: error.message,
      processingTimeMs: processingTime
    });

    // Return user-friendly error message
    const statusCode = error.message.includes('API key') ? 503 : 500;
    const message = error.message.includes('API key') 
      ? 'Text-to-speech service temporarily unavailable'
      : 'Failed to convert text to speech. Please try again.';

    res.status(statusCode).json({
      success: false,
      message,
      requestId
    });
  }
});

/**
 * GET /api/tts/health
 * Health check for TTS service
 */
router.get('/health', async (req, res) => {
  try {
    const health = await ttsService.healthCheck();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json({
      success: health.status === 'healthy',
      ...health
    });
  } catch (error) {
    logger.error('TTS health check error:', error.message);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      service: 'Google Text-to-Speech',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;