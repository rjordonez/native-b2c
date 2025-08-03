import type { Message } from '../types';
import type { TopicQuestion } from '../../library/types';

export interface QuestionResponse {
  questionIndex: number;
  questionText: string;
  userResponse: string;
  messageId: string;
  timestamp: string;
}

/**
 * Collects all user responses for a topic practice session
 * For each question, gets the LATEST response if user redid the question
 */
export function collectTopicResponses(
  messages: Message[],
  questions: TopicQuestion[]
): QuestionResponse[] {
  const responses: QuestionResponse[] = [];
  
  console.log('[collectTopicResponses] Total messages:', messages.length);
  console.log('[collectTopicResponses] Questions:', questions.length);
  
  // Debug: Log all user messages with audio
  const userVoiceMessages = messages.filter(
    msg => msg.sender === 'user' && msg.audioData
  );
  console.log('[collectTopicResponses] User voice messages:', userVoiceMessages.length);
  userVoiceMessages.forEach(msg => {
    console.log(`  - Message ID: ${msg.id}, questionIndex: ${msg.questionIndex}, has transcription: ${!!msg.transcription?.text}`);
  });
  
  // Process each question
  questions.forEach((question, index) => {
    // Find all voice messages for this question index
    const questionMessages = messages.filter(
      msg => msg.sender === 'user' && 
             msg.audioData && 
             msg.questionIndex === index &&
             msg.transcription?.text
    );
    
    console.log(`[collectTopicResponses] Question ${index}: found ${questionMessages.length} responses`);
    
    // Get the latest response for this question
    if (questionMessages.length > 0) {
      const latestMessage = questionMessages[questionMessages.length - 1];
      
      responses.push({
        questionIndex: index,
        questionText: question.text,
        userResponse: latestMessage.transcription?.text || '',
        messageId: latestMessage.id,
        timestamp: latestMessage.timestamp
      });
    }
  });
  
  console.log('[collectTopicResponses] Final responses collected:', responses.length);
  return responses;
}

/**
 * Formats responses for IELTS scoring
 */
export function formatResponsesForScoring(responses: QuestionResponse[]): string {
  return responses
    .map(r => `Q${r.questionIndex + 1}: ${r.questionText}\nA: ${r.userResponse}`)
    .join('\n\n');
}