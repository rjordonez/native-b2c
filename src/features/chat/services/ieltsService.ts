import { API_BASE_URL } from '../../../config/api';

export interface IeltsScore {
  overallBand: number;
  fluencyCoherence: {
    score: number;
    feedback: string;
  };
  lexicalResource: {
    score: number;
    feedback: string;
  };
  grammaticalRange: {
    score: number;
    feedback: string;
  };
  pronunciation: {
    score: number;
    feedback: string;
  };
  strengths: string[];
  improvements: string[];
  summary: string;
  metadata?: {
    wordCount: number;
    questionType: string;
    timestamp: string;
  };
}

export interface IeltsScoreResponse {
  success: boolean;
  score?: IeltsScore;
  formattedMessage?: string;
  error?: string;
}

/**
 * Get IELTS band score for a transcript
 */
export const getIeltsScore = async (
  transcript: string,
  questionType: string = 'Part 1'
): Promise<IeltsScoreResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ielts/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        questionType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get IELTS score');
    }

    return data;
  } catch (error) {
    console.error('Error getting IELTS score:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get IELTS score',
    };
  }
};