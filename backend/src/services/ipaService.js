const { spawn } = require('child_process');
const path = require('path');
const axios = require('axios');
const logger = require('../utils/logger');

class IPAService {
  /**
   * Convert Azure phonemes to IPA with stress marks using Python CMU dictionary
   * @param {string[]} phonemes - Array of Azure phonemes
   * @param {string} word - The original word
   * @returns {Promise<string>} - IPA transcription with stress marks
   */
  static async convertToIPA(phonemes, word) {
    // In production (Vercel), use the serverless function
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      return this._convertToIPAVercel(phonemes, word);
    }
    
    // In development, use local Python script
    return this._convertToIPALocal(phonemes, word);
  }
  
  /**
   * Convert to IPA using Vercel serverless function
   * @private
   */
  static async _convertToIPAVercel(phonemes, word) {
    try {
      const apiUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}/api/ipa-convert`
        : process.env.VERCEL
        ? '/api/ipa-convert'
        : 'http://localhost:3000/api/ipa-convert';
      
      logger.info('Using Vercel Python IPA conversion', { word, apiUrl });
        
      const response = await axios.post(apiUrl, {
        action: 'convert',
        phonemes: phonemes,
        word: word
      }, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      logger.info('Vercel IPA conversion successful', { word, result: response.data.result });
      return response.data.result;
    } catch (error) {
      logger.error('Vercel IPA conversion failed, using JS fallback', { error: error.message });
      // Fallback to basic conversion
      return this._basicConversion(phonemes, word);
    }
  }
  
  /**
   * Convert to IPA using local Python script
   * @private
   */
  static async _convertToIPALocal(phonemes, word) {
    return new Promise((resolve, reject) => {
      try {
        const pythonScript = path.join(__dirname, 'phonemeService.py');
        const python = spawn('python3', [pythonScript]);
        
        let result = '';
        let error = '';
        
        // Handle stdout data
        python.stdout.on('data', (data) => {
          result += data.toString();
        });
        
        // Handle stderr data
        python.stderr.on('data', (data) => {
          error += data.toString();
        });
        
        // Handle process close
        python.on('close', (code) => {
          if (code !== 0) {
            logger.error('Local Python IPA conversion failed', { code, error });
            reject(new Error(`Python process exited with code ${code}: ${error}`));
          } else {
            try {
              const output = JSON.parse(result);
              if (output.error) {
                reject(new Error(output.error));
              } else {
                logger.info('Local Python IPA conversion successful', { word, result: output.result });
                resolve(output.result);
              }
            } catch (parseError) {
              logger.error('Failed to parse Python output', { result, parseError });
              reject(new Error('Failed to parse IPA conversion result'));
            }
          }
        });
        
        // Send input to Python script
        const input = JSON.stringify({
          action: 'convert',
          phonemes: phonemes,
          word: word
        });
        
        python.stdin.write(input);
        python.stdin.end();
        
      } catch (error) {
        logger.error('IPA conversion error', { error: error.message });
        reject(error);
      }
    });
  }
  
  /**
   * Convert a single phoneme to IPA
   * @param {string} phoneme - Single Azure phoneme
   * @returns {Promise<string>} - IPA symbol
   */
  static async convertSinglePhoneme(phoneme) {
    return new Promise((resolve, reject) => {
      try {
        const pythonScript = path.join(__dirname, 'phonemeService.py');
        const python = spawn('python3', [pythonScript]);
        
        let result = '';
        let error = '';
        
        python.stdout.on('data', (data) => {
          result += data.toString();
        });
        
        python.stderr.on('data', (data) => {
          error += data.toString();
        });
        
        python.on('close', (code) => {
          if (code !== 0) {
            reject(new Error(`Python process exited with code ${code}: ${error}`));
          } else {
            try {
              const output = JSON.parse(result);
              if (output.error) {
                reject(new Error(output.error));
              } else {
                resolve(output.result);
              }
            } catch (parseError) {
              reject(new Error('Failed to parse IPA conversion result'));
            }
          }
        });
        
        const input = JSON.stringify({
          action: 'single',
          phoneme: phoneme
        });
        
        python.stdin.write(input);
        python.stdin.end();
        
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Check if Python and required packages are available
   */
  static async checkDependencies() {
    return new Promise((resolve) => {
      const python = spawn('python3', ['-c', 'import cmudict; print("OK")']);
      
      let output = '';
      python.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      python.on('close', (code) => {
        if (code === 0 && output.trim() === 'OK') {
          resolve(true);
        } else {
          logger.warn('Python cmudict not available. IPA conversion will use fallback.');
          resolve(false);
        }
      });
    });
  }
  
  /**
   * Basic JavaScript fallback for IPA conversion
   * @private
   */
  static _basicConversion(phonemes, word) {
    logger.warn('Using basic JS IPA conversion (less accurate stress placement)', { word });
    
    const PHONEME_TO_IPA = {
      // Vowels
      'ax': 'ə', 'ay': 'aɪ', 'ow': 'oʊ', 'iy': 'i', 'ih': 'ɪ', 
      'eh': 'ɛ', 'ae': 'æ', 'aa': 'ɑ', 'ao': 'ɔ', 'uw': 'u', 
      'uh': 'ʊ', 'er': 'ɜr', 'ey': 'eɪ', 'aw': 'aʊ', 'oy': 'ɔɪ',
      'ah': 'ʌ',
      
      // Consonants
      'dh': 'ð', 'th': 'θ', 'sh': 'ʃ', 'zh': 'ʒ', 'ch': 'tʃ', 
      'jh': 'dʒ', 'ng': 'ŋ', 'y': 'j',
      
      // Others
      'p': 'p', 'b': 'b', 't': 't', 'd': 'd', 'k': 'k', 'g': 'g',
      'f': 'f', 'v': 'v', 's': 's', 'z': 'z', 'h': 'h', 'm': 'm',
      'n': 'n', 'l': 'l', 'r': 'r', 'w': 'w'
    };
    
    let result = '';
    const vowels = ['ax', 'ay', 'ow', 'iy', 'ih', 'eh', 'ae', 'aa', 'ao', 'uw', 'uh', 'er', 'ey', 'aw', 'oy', 'ah'];
    let firstVowel = true;
    
    for (const phoneme of phonemes) {
      const phonemeLower = phoneme.toLowerCase();
      
      // Add basic stress on first vowel
      if (firstVowel && vowels.includes(phonemeLower)) {
        result += 'ˈ';
        firstVowel = false;
      }
      
      result += PHONEME_TO_IPA[phonemeLower] || phonemeLower;
    }
    
    return `/${result}/`;
  }
}

module.exports = IPAService;