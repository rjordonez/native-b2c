const express = require('express');
const multer = require('multer');
const TranscriptionService = require('../services/transcriptionService');
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
      logger.warn(`Rejected file upload for transcription: ${file.mimetype}`);
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  }
});

// Initialize transcription service
const transcriptionService = new TranscriptionService();

/**
 * POST /api/transcription/transcribe
 * Transcribe uploaded audio file to text
 */
router.post('/transcribe', upload.single('audio'), async (req, res, next) => {
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info(`[${requestId}] Transcription request received`);
  
  try {
    // Validate request
    if (!req.file) {
      logger.warn(`[${requestId}] No audio file provided`);
      return res.status(400).json({
        success: false,
        error: 'Audio file is required'
      });
    }
    
    const audioBuffer = req.file.buffer;
    const contentType = req.file.mimetype;
    
    // Parse transcription options from request body
    const options = {
      speechModel: req.body.speechModel || 'universal',
      autoDetectLanguage: req.body.autoDetectLanguage === 'true',
      punctuate: req.body.punctuate !== 'false', // Default true
      formatText: req.body.formatText !== 'false', // Default true
      speakerLabels: req.body.speakerLabels === 'true',
      autoChapters: req.body.autoChapters === 'true',
      sentimentAnalysis: req.body.sentimentAnalysis === 'true',
      entityDetection: req.body.entityDetection === 'true',
      dualChannel: req.body.dualChannel === 'true'
    };
    
    logger.info(`[${requestId}] Processing transcription:`, {
      audioSize: audioBuffer.length,
      contentType,
      fileName: req.file.originalname,
      options
    });
    
    // Upload audio to AssemblyAI first
    const startTime = Date.now();
    const audioUrl = await transcriptionService.uploadAudio(audioBuffer);
    const uploadTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] Audio uploaded in ${uploadTime}ms, starting transcription...`);
    
    // Perform transcription
    const transcriptionStartTime = Date.now();
    const result = await transcriptionService.transcribeAudio(audioUrl, options);
    const totalProcessingTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] Transcription completed successfully in ${totalProcessingTime}ms`);
    
    // Return results
    res.json({
      success: true,
      data: {
        ...result,
        metadata: {
          requestId,
          processingTimeMs: totalProcessingTime,
          uploadTimeMs: uploadTime,
          audioInfo: {
            size: audioBuffer.length,
            type: contentType,
            filename: req.file.originalname
          },
          transcriptionOptions: options
        }
      }
    });
    
  } catch (error) {
    logger.error(`[${requestId}] Transcription failed:`, {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    next(error);
  }
});

/**
 * POST /api/transcription/transcribe-url
 * Transcribe audio from URL
 */
router.post('/transcribe-url', async (req, res, next) => {
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info(`[${requestId}] URL transcription request received`);
  
  try {
    const { audioUrl, ...options } = req.body;
    
    // Validate request
    if (!audioUrl) {
      logger.warn(`[${requestId}] No audio URL provided`);
      return res.status(400).json({
        success: false,
        error: 'Audio URL is required'
      });
    }
    
    // Validate URL format
    try {
      new URL(audioUrl);
    } catch (error) {
      logger.warn(`[${requestId}] Invalid audio URL format: ${audioUrl}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid audio URL format'
      });
    }
    
    const transcriptionOptions = {
      speechModel: options.speechModel || 'universal',
      autoDetectLanguage: options.autoDetectLanguage || false,
      punctuate: options.punctuate !== false, // Default true
      formatText: options.formatText !== false, // Default true
      speakerLabels: options.speakerLabels || false,
      autoChapters: options.autoChapters || false,
      sentimentAnalysis: options.sentimentAnalysis || false,
      entityDetection: options.entityDetection || false,
      dualChannel: options.dualChannel || false
    };
    
    logger.info(`[${requestId}] Processing URL transcription:`, {
      audioUrl,
      options: transcriptionOptions
    });
    
    // Perform transcription
    const startTime = Date.now();
    const result = await transcriptionService.transcribeAudio(audioUrl, transcriptionOptions);
    const processingTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] URL transcription completed successfully in ${processingTime}ms`);
    
    // Return results
    res.json({
      success: true,
      data: {
        ...result,
        metadata: {
          requestId,
          processingTimeMs: processingTime,
          audioInfo: {
            url: audioUrl,
            type: 'url'
          },
          transcriptionOptions
        }
      }
    });
    
  } catch (error) {
    logger.error(`[${requestId}] URL transcription failed:`, {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    next(error);
  }
});

/**
 * POST /api/transcription/transcribe-base64
 * Transcribe audio from base64 data
 */
router.post('/transcribe-base64', async (req, res, next) => {
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info(`[${requestId}] Base64 transcription request received`);
  
  try {
    const { audioData, contentType = 'audio/wav', ...options } = req.body;
    
    // Validate request
    if (!audioData) {
      logger.warn(`[${requestId}] No audio data provided`);
      return res.status(400).json({
        success: false,
        error: 'Audio data is required'
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
    
    const transcriptionOptions = {
      speechModel: options.speechModel || 'universal',
      autoDetectLanguage: options.autoDetectLanguage || false,
      punctuate: options.punctuate !== false, // Default true
      formatText: options.formatText !== false, // Default true
      speakerLabels: options.speakerLabels || false,
      autoChapters: options.autoChapters || false,
      sentimentAnalysis: options.sentimentAnalysis || false,
      entityDetection: options.entityDetection || false,
      dualChannel: options.dualChannel || false
    };
    
    logger.info(`[${requestId}] Processing base64 transcription:`, {
      audioSize: audioBuffer.length,
      contentType,
      options: transcriptionOptions
    });
    
    // Upload audio to AssemblyAI first
    const startTime = Date.now();
    const audioUrl = await transcriptionService.uploadAudio(audioBuffer);
    const uploadTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] Base64 audio uploaded in ${uploadTime}ms, starting transcription...`);
    
    // Perform transcription
    const transcriptionStartTime = Date.now();
    const result = await transcriptionService.transcribeAudio(audioUrl, transcriptionOptions);
    const totalProcessingTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] Base64 transcription completed successfully in ${totalProcessingTime}ms`);
    
    // Return results
    res.json({
      success: true,
      data: {
        ...result,
        metadata: {
          requestId,
          processingTimeMs: totalProcessingTime,
          uploadTimeMs: uploadTime,
          audioInfo: {
            size: audioBuffer.length,
            type: contentType,
            encoding: 'base64'
          },
          transcriptionOptions
        }
      }
    });
    
  } catch (error) {
    logger.error(`[${requestId}] Base64 transcription failed:`, {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    next(error);
  }
});

/**
 * GET /api/transcription/status/:id
 * Get transcription status by ID
 */
router.get('/status/:id', async (req, res, next) => {
  const requestId = Math.random().toString(36).substring(7);
  const { id } = req.params;
  
  logger.info(`[${requestId}] Transcription status request for ID: ${id}`);
  
  try {
    // Validate transcript ID
    if (!id || typeof id !== 'string') {
      logger.warn(`[${requestId}] Invalid transcript ID provided`);
      return res.status(400).json({
        success: false,
        error: 'Valid transcript ID is required'
      });
    }
    
    // Get transcription status
    const result = await transcriptionService.getTranscriptionStatus(id);
    
    logger.info(`[${requestId}] Status retrieved successfully:`, {
      id: result.id,
      status: result.status
    });
    
    res.json({
      success: true,
      data: {
        ...result,
        metadata: {
          requestId,
          retrievedAt: new Date().toISOString()
        }
      }
    });
    
  } catch (error) {
    logger.error(`[${requestId}] Failed to get transcription status:`, {
      id,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    next(error);
  }
});

/**
 * GET /api/transcription/health
 * Health check for transcription service
 */
router.get('/health', async (req, res) => {
  try {
    const healthStatus = await transcriptionService.getHealthStatus();
    
    logger.debug('Transcription service health check:', healthStatus);
    
    if (healthStatus.status === 'healthy') {
      res.json(healthStatus);
    } else {
      res.status(503).json(healthStatus);
    }
  } catch (error) {
    logger.error('Transcription service health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      service: 'transcription',
      provider: 'assemblyai',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;