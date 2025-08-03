const OpenAI = require('openai');
const logger = require('../utils/logger');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Enhance transcript using OpenAI GPT
 * @param {string} transcript - The original transcript text
 * @returns {Promise<string>} - Enhanced transcript
 */
const enhanceTranscript = async (transcript) => {
  try {
    if (!transcript || transcript.trim().length === 0) {
      throw new Error('Transcript is required and cannot be empty');
    }

    // Count words in original transcript
    const originalWordCount = transcript.split(/\s+/).filter(word => word.length > 0).length;

    const prompt = `Improve this transcript to target a 0.5 IELTS band increase with natural enhancements. Make sure you are ONLY using spoken language and not written language.

CRITICAL REQUIREMENTS:
- Keep the SAME LENGTH as the original (around ${originalWordCount} words)
- Target 0.5 IELTS band improvement through:
  • Better vocabulary (replace basic words with slightly more sophisticated ones)
  • Improved grammar complexity (use some compound/complex sentences)
  • More cohesive devices (furthermore, however, additionally, consequently)
  • Better pronunciation-friendly phrasing
- Keep it natural and conversational, NOT overly academic
- Remove filler words like 'um', 'uh', 'like', 'you know'
- Fix all grammar mistakes
- Add appropriate linking words and discourse markers
- Use some less common vocabulary where natural
- Do NOT add quotation marks around your response
- Return only the enhanced text without any formatting or quotes

Original transcript:
"${transcript}"

Instructions: Enhance this transcript to reflect a 0.5 IELTS band score improvement. Make the language slightly more sophisticated while keeping it natural. Add variety in sentence structures, use better vocabulary, and improve fluency markers. The enhancement should sound like a more confident and fluent speaker. Return only the enhanced text without quotation marks.`;

    logger.info('Sending transcript enhancement request to OpenAI', {
      originalLength: transcript.length,
      wordCount: originalWordCount
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: Math.max(150, originalWordCount * 2), // Ensure enough tokens for response
      temperature: 0.3, // Lower temperature for more consistent, focused improvements
    });

    let enhancedText = completion.choices[0]?.message?.content?.trim();

    if (!enhancedText) {
      throw new Error('No enhanced text received from OpenAI');
    }

    // Remove surrounding quotation marks if they exist
    if ((enhancedText.startsWith('"') && enhancedText.endsWith('"')) || 
        (enhancedText.startsWith("'") && enhancedText.endsWith("'"))) {
      enhancedText = enhancedText.slice(1, -1).trim();
    }

    logger.info('Successfully enhanced transcript', {
      originalLength: transcript.length,
      enhancedLength: enhancedText.length,
      originalWords: originalWordCount,
      enhancedWords: enhancedText.split(/\s+/).filter(word => word.length > 0).length
    });

    return enhancedText;

  } catch (error) {
    logger.error('Error enhancing transcript with OpenAI:', {
      error: error.message,
      transcript: transcript?.substring(0, 100) + '...' // Log first 100 chars for debugging
    });
    throw error;
  }
};

/**
 * Health check for OpenAI service
 * @returns {Promise<Object>} - Service health status
 */
const healthCheck = async () => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Simple test request to verify API connectivity
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5
    });

    return {
      status: 'healthy',
      service: 'OpenAI GPT-4o-mini',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('OpenAI health check failed:', error.message);
    return {
      status: 'unhealthy',
      service: 'OpenAI GPT-4o-mini',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  enhanceTranscript,
  healthCheck
};