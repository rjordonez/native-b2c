const express = require('express');
const multer = require('multer');
const TranscriptionService = require('../services/transcriptionService');
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
      logger.warn(`Rejected file upload for transcription: ${file.mimetype}`);
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  }
});

// Initialize services
const transcriptionService = new TranscriptionService();
const pronunciationService = new PronunciationService();

/**
 * POST /api/transcription/transcribe-with-pronunciation
 * Transcribe and analyze pronunciation for chat messages
 */
router.post('/transcribe-with-pronunciation', upload.single('audio'), async (req, res, next) => {
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info(`[${requestId}] Combined transcription + pronunciation request received`);
  
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
    const transcriptionOptions = {
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
    
    logger.info(`[${requestId}] Processing combined request:`, {
      audioSize: audioBuffer.length,
      contentType,
      fileName: req.file.originalname,
      transcriptionOptions
    });
    
    // Step 1: Upload audio to AssemblyAI and transcribe (this works perfectly)
    const startTime = Date.now();
    const audioUrl = await transcriptionService.uploadAudio(audioBuffer);
    const uploadTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] Audio uploaded in ${uploadTime}ms, starting transcription...`);
    
    const transcriptionStartTime = Date.now();
    const transcriptionResult = await transcriptionService.transcribeAudio(audioUrl, transcriptionOptions);
    const transcriptionTime = Date.now() - transcriptionStartTime;
    
    logger.info(`[${requestId}] Transcription completed in ${transcriptionTime}ms, starting pronunciation analysis...`);
    
    // Step 2: Run pronunciation analysis using the transcribed text or provided reference text
    let pronunciationResult = null;
    let pronunciationError = null;
    
    if (transcriptionResult.text && transcriptionResult.text.trim().length > 0) {
      try {
        const pronunciationStartTime = Date.now();
        // Use transcribed text as reference
        const referenceText = transcriptionResult.text.trim();
        
        logger.info(`[${requestId}] Using reference text for pronunciation: "${referenceText}"`);
        
        // Only proceed if we actually converted to WAV format
        const azureContentType = contentType === 'audio/wav' ? 'audio/wav' : null;
        
        if (azureContentType) {
          logger.info(`[${requestId}] Audio format is WAV, proceeding with Azure pronunciation assessment`);
          
          const rawPronunciationResult = await pronunciationService.assessPronunciation(
            audioBuffer, 
            referenceText, 
            azureContentType,
            { skipIPA: true } // Skip IPA conversion for chat - not used in UI
          );
          const pronunciationTime = Date.now() - pronunciationStartTime;
          
          // Transform the pronunciation result to match chat message format
          // Use the transcribed text to maintain proper capitalization
          const transcribedWords = referenceText.split(' ');
          pronunciationResult = {
            words: rawPronunciationResult.wordScores.map((wordScore, index) => ({
              // Use the word from transcribed text if available to preserve capitalization
              text: transcribedWords[index] || wordScore.word,
              score: wordScore.score,
              phonemes: wordScore.phonemes || []
            })),
            overallScore: rawPronunciationResult.overallScore || 0,
            accuracy: rawPronunciationResult.overallScore || 0,
            fluency: rawPronunciationResult.overallScore || 0,
            completeness: rawPronunciationResult.overallScore || 0,
            isLoading: false,
            azureRawResponse: rawPronunciationResult
          };
          
          logger.info(`[${requestId}] Pronunciation analysis completed in ${pronunciationTime}ms`);
        } else {
          logger.warn(`[${requestId}] Audio format is not WAV (${contentType}), skipping pronunciation assessment`);
          pronunciationResult = {
            words: [],
            overallScore: 0,
            accuracy: 0,
            fluency: 0,
            completeness: 0,
            isLoading: false,
            error: 'Pronunciation assessment requires WAV format'
          };
        }
      } catch (error) {
        logger.error(`[${requestId}] Pronunciation analysis failed:`, {
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
        
        pronunciationError = error.message;
        pronunciationResult = {
          words: [],
          overallScore: 0,
          accuracy: 0,
          fluency: 0,
          completeness: 0,
          isLoading: false,
          error: pronunciationError
        };
      }
    } else {
      logger.warn(`[${requestId}] No transcribed text available for pronunciation analysis`);
      pronunciationResult = {
        words: [],
        overallScore: 0,
        accuracy: 0,
        fluency: 0,
        completeness: 0,
        isLoading: false,
        error: 'No transcribed text available'
      };
    }
    
    const totalProcessingTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] Combined processing completed in ${totalProcessingTime}ms`);
    
    // Return combined results
    res.json({
      success: true,
      data: {
        transcription: {
          ...transcriptionResult,
          isLoading: false
        },
        pronunciation: pronunciationResult,
        metadata: {
          requestId,
          totalProcessingTimeMs: totalProcessingTime,
          uploadTimeMs: uploadTime,
          transcriptionTimeMs: transcriptionTime,
          audioInfo: {
            size: audioBuffer.length,
            type: contentType,
            filename: req.file?.originalname || 'audio'
          },
          transcriptionOptions,
          pronunciationError
        }
      }
    });
    
  } catch (error) {
    logger.error(`[${requestId}] Combined transcription + pronunciation failed:`, {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    next(error);
  }
});

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