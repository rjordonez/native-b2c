const OpenAI = require('openai');
const logger = require('../utils/logger');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze transcript and provide IELTS band score
 * @param {string} transcript - The transcript text to analyze
 * @param {string} questionType - Type of IELTS question (Part 1, Part 2, Part 3)
 * @returns {Promise<Object>} - IELTS score with detailed feedback
 */
const scoreTranscript = async (transcript, questionType = 'Part 1') => {
  try {
    if (!transcript || transcript.trim().length === 0) {
      throw new Error('Transcript is required and cannot be empty');
    }

    const wordCount = transcript.split(/\s+/).filter(word => word.length > 0).length;

    const prompt = `You are an expert IELTS Speaking examiner. Analyze this student's response and provide a band score.

Question Type: ${questionType}
Student Response: "${transcript}"

Evaluate based on IELTS Speaking criteria:
1. Fluency and Coherence (25%)
2. Lexical Resource (25%)
3. Grammatical Range and Accuracy (25%)
4. Pronunciation indicators from text (25%)

Provide your response in this exact JSON format:
{
  "overallBand": 6.5,
  "fluencyCoherence": {
    "score": 6.5,
    "feedback": "Brief specific feedback"
  },
  "lexicalResource": {
    "score": 6.5,
    "feedback": "Brief specific feedback"
  },
  "grammaticalRange": {
    "score": 6.5,
    "feedback": "Brief specific feedback"
  },
  "pronunciation": {
    "score": 6.5,
    "feedback": "Based on fluency patterns and word choice"
  },
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "summary": "2-3 sentence overall assessment"
}

Be realistic and constructive. Consider:
- Word count: ${wordCount} words
- Natural speech patterns, hesitations, and self-corrections
- Appropriate vocabulary for the question type
- Grammar complexity suitable for ${questionType}

Return ONLY the JSON object, no additional text.`;

    logger.info('Sending IELTS scoring request to OpenAI', {
      transcriptLength: transcript.length,
      wordCount: wordCount,
      questionType: questionType
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for consistent scoring
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content?.trim();

    if (!responseContent) {
      throw new Error('No scoring response received from OpenAI');
    }

    let scoringResult;
    try {
      scoringResult = JSON.parse(responseContent);
    } catch (parseError) {
      logger.error('Failed to parse IELTS scoring response:', {
        error: parseError.message,
        response: responseContent
      });
      throw new Error('Invalid scoring response format');
    }

    // Validate the response has required fields
    if (!scoringResult.overallBand || !scoringResult.summary) {
      throw new Error('Incomplete scoring response from AI');
    }

    logger.info('Successfully scored transcript', {
      overallBand: scoringResult.overallBand,
      wordCount: wordCount
    });

    return {
      ...scoringResult,
      metadata: {
        wordCount: wordCount,
        questionType: questionType,
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    logger.error('Error scoring transcript with OpenAI:', {
      error: error.message,
      transcript: transcript?.substring(0, 100) + '...' // Log first 100 chars for debugging
    });
    throw error;
  }
};

/**
 * Format IELTS score for display
 * @param {Object} score - The IELTS score object
 * @returns {string} - Formatted score message
 */
const formatScoreMessage = (score) => {
  if (!score || !score.overallBand) {
    return 'Unable to generate IELTS score.';
  }

  const bandEmoji = score.overallBand >= 7 ? '🌟' : score.overallBand >= 6 ? '✨' : '💪';
  
  let message = `${bandEmoji} **IELTS Band Score: ${score.overallBand}**\n\n`;
  
  message += `**Breakdown:**\n`;
  message += `• Fluency & Coherence: ${score.fluencyCoherence.score}\n`;
  message += `• Lexical Resource: ${score.lexicalResource.score}\n`;
  message += `• Grammar: ${score.grammaticalRange.score}\n`;
  message += `• Pronunciation: ${score.pronunciation.score}\n\n`;
  
  message += `**Summary:** ${score.summary}\n\n`;
  
  if (score.strengths && score.strengths.length > 0) {
    message += `**Strengths:**\n`;
    score.strengths.forEach(strength => {
      message += `• ${strength}\n`;
    });
    message += '\n';
  }
  
  if (score.improvements && score.improvements.length > 0) {
    message += `**Areas for Improvement:**\n`;
    score.improvements.forEach(improvement => {
      message += `• ${improvement}\n`;
    });
  }
  
  return message;
};

/**
 * Health check for IELTS service
 * @returns {Promise<Object>} - Service health status
 */
const healthCheck = async () => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Simple test request to verify API connectivity
    await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Test' }],
      max_tokens: 5
    });

    return {
      status: 'healthy',
      service: 'IELTS Scoring (OpenAI GPT-4o-mini)',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('IELTS service health check failed:', error.message);
    return {
      status: 'unhealthy',
      service: 'IELTS Scoring (OpenAI GPT-4o-mini)',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  scoreTranscript,
  formatScoreMessage,
  healthCheck
};