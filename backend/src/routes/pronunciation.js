const express = require('express');
const multer = require('multer');
const PronunciationService = require('../services/pronunciationService');
const logger = require('../utils/logger');
const config = require('../config/config');

const router = express.Router();

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(config.upload.maxFileSize.replace('mb', '')) * 1024 * 1024, // Convert to bytes
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Check if the file type is allowed
    const isAllowed = config.upload.allowedMimeTypes.some(type => 
      file.mimetype.includes(type.split('/')[1])
    );
    
    if (isAllowed) {
      cb(null, true);
    } else {
      logger.warn(`Rejected file upload: ${file.mimetype}`);
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  }
});

// Initialize pronunciation service
const pronunciationService = new PronunciationService();

/**
 * POST /api/pronunciation/assess
 * Analyze pronunciation quality of uploaded audio
 */
router.post('/assess', upload.single('audio'), async (req, res, next) => {
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info(`[${requestId}] Pronunciation assessment request received`);
  
  try {
    // Validate request
    if (!req.file) {
      logger.warn(`[${requestId}] No audio file provided`);
      return res.status(400).json({
        success: false,
        error: 'Audio file is required'
      });
    }
    
    if (!req.body.referenceText) {
      logger.warn(`[${requestId}] No reference text provided`);
      return res.status(400).json({
        success: false,
        error: 'Reference text is required'
      });
    }
    
    const { referenceText } = req.body;
    const audioBuffer = req.file.buffer;
    const contentType = req.file.mimetype;
    
    logger.info(`[${requestId}] Processing assessment:`, {
      audioSize: audioBuffer.length,
      contentType,
      referenceTextLength: referenceText.length,
      fileName: req.file.originalname
    });
    
    // Perform pronunciation assessment
    const startTime = Date.now();
    const result = await pronunciationService.assessPronunciation(
      audioBuffer,
      referenceText,
      contentType
    );
    const processingTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] Assessment completed successfully in ${processingTime}ms`);
    
    // Return results
    res.json({
      success: true,
      data: {
        ...result,
        metadata: {
          requestId,
          processingTimeMs: processingTime,
          audioInfo: {
            size: audioBuffer.length,
            type: contentType,
            filename: req.file.originalname
          },
          referenceInfo: {
            length: referenceText.length,
            text: referenceText
          }
        }
      }
    });
    
  } catch (error) {
    logger.error(`[${requestId}] Pronunciation assessment failed:`, {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    next(error);
  }
});

/**
 * POST /api/pronunciation/assess-base64
 * Analyze pronunciation quality from base64 audio data
 */
router.post('/assess-base64', async (req, res, next) => {
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info(`[${requestId}] Base64 pronunciation assessment request received`);
  
  try {
    const { audioData, referenceText, contentType = 'audio/wav' } = req.body;
    
    // Validate request
    if (!audioData) {
      logger.warn(`[${requestId}] No audio data provided`);
      return res.status(400).json({
        success: false,
        error: 'Audio data is required'
      });
    }
    
    if (!referenceText) {
      logger.warn(`[${requestId}] No reference text provided`);
      return res.status(400).json({
        success: false,
        error: 'Reference text is required'
      });
    }
    
    // Convert base64 to buffer
    let audioBuffer;
    try {
      // Handle data URL format (data:audio/wav;base64,...)
      const base64Data = audioData.includes(',') ? audioData.split(',')[1] : audioData;
      audioBuffer = Buffer.from(base64Data, 'base64');
    } catch (error) {
      logger.warn(`[${requestId}] Invalid base64 audio data`);
      return res.status(400).json({
        success: false,
        error: 'Invalid base64 audio data'
      });
    }
    
    logger.info(`[${requestId}] Processing base64 assessment:`, {
      audioSize: audioBuffer.length,
      contentType,
      referenceTextLength: referenceText.length
    });
    
    // Perform pronunciation assessment
    const startTime = Date.now();
    const result = await pronunciationService.assessPronunciation(
      audioBuffer,
      referenceText,
      contentType
    );
    const processingTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] Base64 assessment completed successfully in ${processingTime}ms`);
    
    // Return results
    res.json({
      success: true,
      data: {
        ...result,
        metadata: {
          requestId,
          processingTimeMs: processingTime,
          audioInfo: {
            size: audioBuffer.length,
            type: contentType,
            encoding: 'base64'
          },
          referenceInfo: {
            length: referenceText.length,
            text: referenceText
          }
        }
      }
    });
    
  } catch (error) {
    logger.error(`[${requestId}] Base64 pronunciation assessment failed:`, {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    next(error);
  }
});

/**
 * GET /api/pronunciation/health
 * Health check for pronunciation service
 */
router.get('/health', async (req, res) => {
  try {
    const serviceHealth = {
      status: 'healthy',
      service: 'pronunciation',
      azure: {
        configured: !!config.azure.speechKey,
        region: config.azure.speechRegion
      },
      limits: {
        maxFileSize: config.upload.maxFileSize,
        allowedTypes: config.upload.allowedMimeTypes
      },
      timestamp: new Date().toISOString()
    };
    
    logger.debug('Pronunciation service health check:', serviceHealth);
    
    res.json(serviceHealth);
  } catch (error) {
    logger.error('Pronunciation service health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      service: 'pronunciation',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;