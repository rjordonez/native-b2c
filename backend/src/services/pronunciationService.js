const config = require('../config/config');
const logger = require('../utils/logger');

class PronunciationService {
  constructor() {
    this.azureSpeechKey = config.azure.speechKey;
    this.azureSpeechRegion = config.azure.speechRegion;
    
    if (!this.azureSpeechKey) {
      throw new Error('Azure Speech API key is required but not provided');
    }
  }

  /**
   * Assess pronunciation quality of audio against reference text
   * @param {Buffer} audioBuffer - Audio data buffer
   * @param {string} referenceText - Text that should have been spoken
   * @param {string} contentType - MIME type of audio
   * @returns {Promise<Object>} Pronunciation assessment results
   */
  async assessPronunciation(audioBuffer, referenceText, contentType = 'audio/wav') {
    logger.info('=== PRONUNCIATION ASSESSMENT STARTED ===');
    logger.info('Assessment parameters:', {
      audioSize: audioBuffer.length,
      referenceText: referenceText.substring(0, 100) + (referenceText.length > 100 ? '...' : ''),
      referenceTextLength: referenceText.length,
      contentType
    });

    try {
      // Step 1: Validate inputs
      this._validateInputs(audioBuffer, referenceText, contentType);
      
      // Step 2: Prepare pronunciation assessment configuration
      const pronunciationConfig = this._createPronunciationConfig(referenceText);
      logger.debug('Pronunciation config created:', pronunciationConfig);
      
      // Step 3: Make API request to Azure Speech Service
      const azureResponse = await this._callAzureSpeechAPI(audioBuffer, pronunciationConfig, contentType);
      
      // Step 4: Parse and structure the response
      const assessmentResult = this._parseAzureResponse(azureResponse);
      
      logger.info('=== PRONUNCIATION ASSESSMENT COMPLETED ===');
      logger.info('Assessment summary:', {
        overallScore: assessmentResult.overallScore,
        wordCount: assessmentResult.wordScores.length,
        weakWordCount: assessmentResult.weakWords.length
      });
      
      return assessmentResult;
      
    } catch (error) {
      logger.error('=== PRONUNCIATION ASSESSMENT FAILED ===');
      logger.error('Assessment error:', {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
      
      // Re-throw with more context
      throw new Error(`Pronunciation assessment failed: ${error.message}`);
    }
  }

  /**
   * Validate input parameters
   * @private
   */
  _validateInputs(audioBuffer, referenceText, contentType) {
    if (!audioBuffer || audioBuffer.length === 0) {
      throw new Error('Audio buffer is required and cannot be empty');
    }
    
    if (!referenceText || referenceText.trim().length === 0) {
      throw new Error('Reference text is required and cannot be empty');
    }
    
    if (referenceText.length > 1000) {
      throw new Error('Reference text is too long (maximum 1000 characters)');
    }
    
    if (!config.upload.allowedMimeTypes.some(type => contentType.includes(type.split('/')[1]))) {
      logger.warn(`Unusual content type received: ${contentType}`);
    }
    
    logger.debug('Input validation passed');
  }

  /**
   * Create pronunciation assessment configuration for Azure
   * @private
   */
  _createPronunciationConfig(referenceText) {
    return {
      ReferenceText: referenceText,
      GradingSystem: 'HundredMark',
      Granularity: 'Phoneme',
      Dimension: 'Comprehensive',
      EnableMiscue: true
    };
  }

  /**
   * Call Azure Speech API for pronunciation assessment
   * @private
   */
  async _callAzureSpeechAPI(audioBuffer, pronunciationConfig, contentType) {
    const startTime = Date.now();
    
    // Prepare API request
    const url = `https://${this.azureSpeechRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;
    const paHeader = Buffer.from(JSON.stringify(pronunciationConfig)).toString('base64');
    
    const headers = {
      'Ocp-Apim-Subscription-Key': this.azureSpeechKey,
      'Content-Type': contentType,
      'Accept': 'application/json',
      'Pronunciation-Assessment': paHeader
    };
    
    logger.debug('Azure API request prepared:', {
      url,
      method: 'POST',
      contentType,
      audioSize: audioBuffer.length,
      paHeaderLength: paHeader.length
    });
    
    // Make API call
    logger.info('Calling Azure Speech API...');
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: audioBuffer
    });
    
    const duration = Date.now() - startTime;
    
    logger.info('Azure API response received:', {
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      ok: response.ok
    });
    
    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Azure Speech API error:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        duration: `${duration}ms`
      });
      
      // Provide specific error messages
      let errorMessage = `Azure Speech API error (${response.status})`;
      if (response.status === 401) {
        errorMessage = 'Authentication failed - check Azure Speech API key';
      } else if (response.status === 400) {
        errorMessage = 'Bad request - check audio format and parameters';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded - too many requests';
      } else if (response.status >= 500) {
        errorMessage = 'Azure Speech service error - please try again later';
      }
      
      throw new Error(`${errorMessage}: ${errorText}`);
    }
    
    // Parse response
    const responseData = await response.json();
    logger.debug('Azure API response data:', responseData);
    
    return responseData;
  }

  /**
   * Parse Azure Speech API response into structured result
   * @private
   */
  _parseAzureResponse(azureData) {
    logger.debug('Parsing Azure response...');
    
    // Initialize result structure
    const result = {
      overallScore: 0,
      wordScores: [],
      weakWords: [],
      recognizedText: azureData.DisplayText || '',
      recognitionStatus: azureData.RecognitionStatus || 'Unknown'
    };
    
    // Check if we have valid assessment data
    if (!azureData.NBest || !azureData.NBest[0]) {
      logger.warn('No NBest data found in Azure response');
      return result;
    }
    
    const nbestResult = azureData.NBest[0];
    result.overallScore = nbestResult.PronScore || 0;
    
    logger.debug('Processing pronunciation data:', {
      overallScore: result.overallScore,
      wordCount: nbestResult.Words?.length || 0
    });
    
    // Process word-level scores
    if (nbestResult.Words) {
      nbestResult.Words.forEach((wordData, index) => {
        const word = wordData.Word;
        const score = wordData.AccuracyScore || 0;
        const errorType = wordData.ErrorType;
        
        logger.debug(`Processing word ${index + 1}: ${word} (score: ${score}, error: ${errorType})`);
        
        // Include omitted words with 0 score
        if (errorType === 'Omission' && score === 0) {
          logger.debug(`Including omitted word: ${word} with score 0`);
        }
        
        // Process phonemes
        const phonemes = [];
        if (wordData.Phonemes) {
          wordData.Phonemes.forEach(phonemeData => {
            phonemes.push({
              phoneme: phonemeData.Phoneme,
              score: phonemeData.AccuracyScore || 0
            });
          });
        }
        
        // Add to word scores
        result.wordScores.push({
          word,
          score,
          phonemes,
          errorType,
          offset: wordData.Offset,
          duration: wordData.Duration
        });
        
        // Mark as weak word if score is below threshold
        if (score > 0 && score < 50) {
          result.weakWords.push(word);
          logger.debug(`Marked as weak word: ${word} (score: ${score})`);
        }
      });
    }
    
    logger.debug('Parsing completed:', {
      overallScore: result.overallScore,
      wordScoreCount: result.wordScores.length,
      weakWordCount: result.weakWords.length
    });
    
    return result;
  }
}

module.exports = PronunciationService;