const textToSpeech = require('@google-cloud/text-to-speech');
const logger = require('../utils/logger');

// Initialize Google Text-to-Speech client with API key
const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_TTS_API_KEY,
});

/**
 * Convert text to speech using Google Text-to-Speech API
 * @param {string} text - The text to convert to speech
 * @param {Object} options - TTS options
 * @returns {Promise<Buffer>} - Audio buffer
 */
const textToSpeechConversion = async (text, options = {}) => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Text is required and cannot be empty');
    }

    if (!process.env.GOOGLE_TTS_API_KEY) {
      throw new Error('Google TTS API key not configured');
    }

    const request = {
      input: { text: text.trim() },
      voice: {
        languageCode: options.languageCode || 'en-US',
        name: options.voiceName || 'en-US-Journey-F', // Natural female voice
        ssmlGender: options.ssmlGender || 'FEMALE',
      },
      audioConfig: {
        audioEncoding: options.audioEncoding || 'MP3',
        speakingRate: options.speakingRate || 1.0,
        pitch: options.pitch || 0.0,
        volumeGainDb: options.volumeGainDb || 0.0,
      },
    };

    logger.info('Sending text-to-speech request to Google', {
      textLength: text.length,
      languageCode: request.voice.languageCode,
      voiceName: request.voice.name,
      audioEncoding: request.audioConfig.audioEncoding,
      speakingRate: request.audioConfig.speakingRate,
      pitch: request.audioConfig.pitch,
      receivedOptions: options
    });

    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error('No audio content received from Google TTS');
    }

    logger.info('Successfully generated speech audio', {
      textLength: text.length,
      audioSize: response.audioContent.length
    });

    return response.audioContent;

  } catch (error) {
    logger.error('Error converting text to speech:', {
      error: error.message,
      text: text?.substring(0, 100) + '...' // Log first 100 chars for debugging
    });
    throw error;
  }
};

/**
 * Health check for Google TTS service
 * @returns {Promise<Object>} - Service health status
 */
const healthCheck = async () => {
  try {
    if (!process.env.GOOGLE_TTS_API_KEY) {
      throw new Error('Google TTS API key not configured');
    }

    // Simple test request to verify API connectivity
    const testAudio = await textToSpeechConversion('Hello, this is a test.', {
      languageCode: 'en-US',
      audioEncoding: 'MP3'
    });

    return {
      status: 'healthy',
      service: 'Google Text-to-Speech',
      timestamp: new Date().toISOString(),
      testAudioSize: testAudio.length
    };
  } catch (error) {
    logger.error('Google TTS health check failed:', error.message);
    return {
      status: 'unhealthy',
      service: 'Google Text-to-Speech',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  textToSpeechConversion,
  healthCheck
};