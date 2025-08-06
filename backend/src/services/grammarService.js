const OpenAI = require('openai');
const logger = require('../utils/logger');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Analyze transcript for grammar and vocabulary feedback
 * @param {string} transcript - The user's spoken response
 * @param {string} questionText - The original question (for context)
 * @returns {Object} Grammar and vocabulary feedback
 */
async function analyzeGrammarAndVocab(transcript, questionText) {
  try {
    // Input validation
    if (!transcript || typeof transcript !== 'string') {
      logger.warn('Invalid transcript provided for grammar analysis');
      return {
        nice_point: "Keep practicing your speaking skills",
        grammar_tip: "Focus on clear articulation for better analysis",
        vocab_tip: "Try using more varied vocabulary"
      };
    }
    
    // Sanitize inputs - limit length to prevent abuse
    const sanitizedTranscript = transcript.substring(0, 2000);
    const sanitizedQuestion = (questionText || 'General conversation').substring(0, 500);
    const prompt = `You're an IELTS speaking tutor providing brief, helpful feedback to improve band scores.

Your response: "${sanitizedTranscript}"
(Question was: "${sanitizedQuestion}")

IMPORTANT:
- This is SPOKEN English - ignore punctuation/capitalization
- Ignore obvious transcription errors (weird out-of-place words)
- Focus on improvements that will raise their IELTS band score
- Be encouraging but professional
- Keep feedback specific and actionable

Provide 3 brief feedback messages in this JSON format:
{
  "nice_point": "One strength in their response (encouraging, max 12 words)",
  "grammar_tip": "One grammar correction for higher band score (clear, specific, max 20 words)",
  "vocab_tip": "One vocabulary upgrade for better IELTS score (professional, max 18 words)"
}

Examples of GOOD IELTS-focused feedback:
- "Good use of complex sentence structures"
- "For band 7+: say 'when I was' not 'whenever I was'"
- "Try 'significant' instead of 'important' - shows better vocabulary range"
- "Remove filler words like 'like' - say 'the ultimate consequence' directly"

BAD feedback (too casual or vague):
- "Sounds cooler!"
- "Nice vibe!"
- "Try better words"

Remember: Focus on specific improvements that IELTS examiners look for.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced IELTS speaking tutor. Provide specific, actionable feedback to help students improve their band score. Focus on grammar accuracy, vocabulary range, and fluency markers that IELTS examiners evaluate. Be encouraging but professional. Never use excessive emojis or casual slang.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: 'json_object' }
    });

    const feedback = JSON.parse(completion.choices[0].message.content);
    
    logger.info('Grammar and vocab analysis completed');
    
    return feedback;
  } catch (error) {
    logger.error('Grammar analysis error:', error);
    
    // Return a fallback response if API fails
    return {
      nice_point: "Good speaking fluency overall",
      grammar_tip: "Focus on verb tense consistency for higher scores",
      vocab_tip: "Expand your vocabulary range with synonyms"
    };
  }
}

/**
 * Format feedback into conversational messages array
 * @param {Object} feedback - The grammar and vocabulary feedback
 * @returns {Array} Array of message strings for the user
 */
function formatFeedbackMessages(feedback) {
  const messages = [];
  
  // Add nice point first - keep it encouraging
  if (feedback.nice_point) {
    messages.push(feedback.nice_point);
  }
  
  // Add grammar tip if there is one
  if (feedback.grammar_tip) {
    messages.push(feedback.grammar_tip);
  }
  
  // Add vocabulary tip if there is one
  if (feedback.vocab_tip) {
    messages.push(feedback.vocab_tip);
  }
  
  // If no feedback available, add a default encouraging message
  if (messages.length === 0) {
    messages.push("Nice work on that answer!");
  }
  
  return messages;
}

/**
 * Health check for grammar service
 */
async function healthCheck() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  
  return {
    status: hasApiKey ? 'healthy' : 'unhealthy',
    service: 'grammar',
    apiConfigured: hasApiKey,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  analyzeGrammarAndVocab,
  formatFeedbackMessages,
  healthCheck
};