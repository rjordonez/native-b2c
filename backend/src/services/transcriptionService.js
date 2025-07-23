const { AssemblyAI } = require('assemblyai');
const config = require('../config/config');
const logger = require('../utils/logger');

class TranscriptionService {
  constructor() {
    this.assemblyAIKey = config.assemblyAI.apiKey;
    
    if (!this.assemblyAIKey) {
      throw new Error('AssemblyAI API key is required but not provided');
    }
    
    this.client = new AssemblyAI({
      apiKey: this.assemblyAIKey
    });
  }

  /**
   * Transcribe audio to text using AssemblyAI
   * @param {Buffer|string} audioInput - Audio buffer or URL
   * @param {Object} options - Transcription options
   * @returns {Promise<Object>} Transcription results
   */
  async transcribeAudio(audioInput, options = {}) {
    const requestId = Math.random().toString(36).substring(7);
    
    logger.info(`[${requestId}] === TRANSCRIPTION STARTED ===`);
    logger.info(`[${requestId}] Transcription parameters:`, {
      inputType: Buffer.isBuffer(audioInput) ? 'buffer' : 'url',
      inputSize: Buffer.isBuffer(audioInput) ? audioInput.length : 'N/A',
      inputUrl: typeof audioInput === 'string' ? audioInput : 'N/A',
      options
    });

    try {
      // Prepare transcription parameters
      const transcriptionParams = {
        audio: audioInput,
        speech_model: options.speechModel || 'universal',
        language_detection: options.autoDetectLanguage || false,
        punctuate: options.punctuate !== false, // Default to true
        format_text: options.formatText !== false, // Default to true
        dual_channel: options.dualChannel || false,
        speaker_labels: options.speakerLabels || false,
        auto_chapters: options.autoChapters || false,
        sentiment_analysis: options.sentimentAnalysis || false,
        entity_detection: options.entityDetection || false,
        ...options.customParams
      };

      logger.debug(`[${requestId}] AssemblyAI parameters:`, {
        ...transcriptionParams,
        audio: Buffer.isBuffer(audioInput) ? '[Buffer]' : audioInput
      });

      // Start transcription
      const startTime = Date.now();
      logger.info(`[${requestId}] Sending request to AssemblyAI...`);
      
      const transcript = await this.client.transcripts.transcribe(transcriptionParams);
      
      const processingTime = Date.now() - startTime;
      
      logger.info(`[${requestId}] AssemblyAI transcription completed:`, {
        status: transcript.status,
        processingTimeMs: processingTime,
        textLength: transcript.text?.length || 0,
        confidence: transcript.confidence,
        audioUrl: transcript.audio_url
      });

      // Check transcription status
      if (transcript.status === 'error') {
        logger.error(`[${requestId}] AssemblyAI transcription failed:`, {
          error: transcript.error,
          status: transcript.status
        });
        throw new Error(`AssemblyAI transcription failed: ${transcript.error}`);
      }

      // Parse and structure the response
      const result = this._parseTranscriptionResult(transcript, requestId);
      
      logger.info(`[${requestId}] === TRANSCRIPTION COMPLETED ===`);
      logger.info(`[${requestId}] Result summary:`, {
        success: true,
        textLength: result.text.length,
        wordCount: result.words?.length || 0,
        confidence: result.confidence,
        totalProcessingTimeMs: Date.now() - startTime
      });
      
      return result;
      
    } catch (error) {
      logger.error(`[${requestId}] === TRANSCRIPTION FAILED ===`);
      logger.error(`[${requestId}] Transcription error:`, {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        inputType: Buffer.isBuffer(audioInput) ? 'buffer' : 'url'
      });
      
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  /**
   * Get transcription status by ID
   * @param {string} transcriptId - AssemblyAI transcript ID
   * @returns {Promise<Object>} Transcription status
   */
  async getTranscriptionStatus(transcriptId) {
    const requestId = Math.random().toString(36).substring(7);
    
    logger.info(`[${requestId}] Getting transcription status for ID: ${transcriptId}`);
    
    try {
      const transcript = await this.client.transcripts.get(transcriptId);
      
      logger.debug(`[${requestId}] Status retrieved:`, {
        id: transcript.id,
        status: transcript.status,
        textLength: transcript.text?.length || 0
      });
      
      return {
        id: transcript.id,
        status: transcript.status,
        text: transcript.text,
        confidence: transcript.confidence,
        error: transcript.error,
        audio_url: transcript.audio_url,
        created: transcript.created,
        completed: transcript.completed
      };
      
    } catch (error) {
      logger.error(`[${requestId}] Failed to get transcription status:`, {
        transcriptId,
        error: error.message
      });
      
      throw new Error(`Failed to get transcription status: ${error.message}`);
    }
  }

  /**
   * Upload audio file to AssemblyAI and get URL
   * @param {Buffer} audioBuffer - Audio file buffer
   * @returns {Promise<string>} Upload URL
   */
  async uploadAudio(audioBuffer) {
    const requestId = Math.random().toString(36).substring(7);
    
    logger.info(`[${requestId}] Uploading audio to AssemblyAI:`, {
      size: audioBuffer.length
    });
    
    try {
      const startTime = Date.now();
      const uploadUrl = await this.client.files.upload(audioBuffer);
      const uploadTime = Date.now() - startTime;
      
      logger.info(`[${requestId}] Audio upload completed:`, {
        uploadUrl,
        uploadTimeMs: uploadTime,
        audioSize: audioBuffer.length
      });
      
      return uploadUrl;
      
    } catch (error) {
      logger.error(`[${requestId}] Audio upload failed:`, {
        error: error.message,
        audioSize: audioBuffer.length
      });
      
      throw new Error(`Audio upload failed: ${error.message}`);
    }
  }

  /**
   * Parse AssemblyAI transcription result into structured format
   * @private
   */
  _parseTranscriptionResult(transcript, requestId) {
    logger.debug(`[${requestId}] Parsing transcription result...`);
    
    const result = {
      id: transcript.id,
      text: transcript.text || '',
      confidence: transcript.confidence || 0,
      status: transcript.status,
      audioUrl: transcript.audio_url,
      languageDetected: transcript.language_detected,
      processingInfo: {
        created: transcript.created,
        completed: transcript.completed,
        audioStartFrom: transcript.audio_start_from,
        audioDuration: transcript.audio_duration
      }
    };

    // Add optional features if they were requested and available
    if (transcript.words && transcript.words.length > 0) {
      result.words = transcript.words.map(word => ({
        text: word.text,
        start: word.start,
        end: word.end,
        confidence: word.confidence,
        speaker: word.speaker
      }));
      
      logger.debug(`[${requestId}] Added ${result.words.length} word timestamps`);
    }

    if (transcript.chapters && transcript.chapters.length > 0) {
      result.chapters = transcript.chapters.map(chapter => ({
        summary: chapter.summary,
        headline: chapter.headline,
        start: chapter.start,
        end: chapter.end
      }));
      
      logger.debug(`[${requestId}] Added ${result.chapters.length} chapters`);
    }

    if (transcript.sentiment_analysis_results && transcript.sentiment_analysis_results.length > 0) {
      result.sentimentAnalysis = transcript.sentiment_analysis_results;
      logger.debug(`[${requestId}] Added sentiment analysis results`);
    }

    if (transcript.entities && transcript.entities.length > 0) {
      result.entities = transcript.entities;
      logger.debug(`[${requestId}] Added ${result.entities.length} entities`);
    }

    logger.debug(`[${requestId}] Parsing completed:`, {
      textLength: result.text.length,
      confidence: result.confidence,
      hasWords: !!result.words,
      hasChapters: !!result.chapters,
      hasSentiment: !!result.sentimentAnalysis,
      hasEntities: !!result.entities
    });
    
    return result;
  }

  /**
   * Get service health status
   * @returns {Promise<Object>} Health status
   */
  async getHealthStatus() {
    try {
      // Test API connectivity by making a simple request
      const testStartTime = Date.now();
      
      // We can't easily test without making an actual request, so we'll just verify the client is configured
      const isConfigured = !!this.assemblyAIKey && !!this.client;
      const responseTime = Date.now() - testStartTime;
      
      return {
        status: isConfigured ? 'healthy' : 'unhealthy',
        service: 'transcription',
        provider: 'assemblyai',
        configured: isConfigured,
        responseTimeMs: responseTime,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      logger.error('Transcription service health check failed:', error);
      
      return {
        status: 'unhealthy',
        service: 'transcription',
        provider: 'assemblyai',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = TranscriptionService;