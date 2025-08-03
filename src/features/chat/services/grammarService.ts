import { API_BASE_URL } from '../../../config/api';

export interface GrammarFeedback {
  nice_point: string;
  grammar_tip: string;
  vocab_tip: string;
}

export interface GrammarResponse {
  success: boolean;
  feedback?: GrammarFeedback;
  messages?: string[];
  error?: string;
  metadata?: {
    requestId: string;
    processingTimeMs: number;
  };
}

/**
 * Get grammar and vocabulary feedback for a transcript
 */
export async function getGrammarFeedback(
  transcript: string,
  questionText?: string
): Promise<GrammarResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/grammar/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        questionText
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to analyze: ${response.status}`);
    }

    const data: GrammarResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get grammar feedback');
    }

    return data;
  } catch (error) {
    console.error('Grammar feedback error:', error);
    
    // Return a fallback response
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze grammar',
      messages: ["Nice work on that answer! 👍"]
    };
  }
}