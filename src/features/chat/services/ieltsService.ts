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
 * Get IELTS band score for a complete topic (all responses)
 */
export const getTopicIeltsScore = async (
  responses: Array<{ questionText: string; userResponse: string }>,
  topicTitle: string,
  questionType: string = 'Part 1'
): Promise<IeltsScoreResponse> => {
  try {
    // Format all Q&A pairs for scoring
    const fullTranscript = responses
      .map((r, i) => `Question ${i + 1}: ${r.questionText}\nAnswer: ${r.userResponse}`)
      .join('\n\n');
    
    const response = await fetch(`${API_BASE_URL}/ielts/score-topic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        responses,
        fullTranscript,
        topicTitle,
        questionType,
        questionCount: responses.length
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to score topic: ${response.status}`);
    }

    const data: IeltsScoreResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get IELTS score');
    }

    return data;
  } catch (error) {
    console.error('IELTS topic scoring error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to score transcript',
    };
  }
};

/**
 * Get IELTS band score for a single transcript
 */
export const getIeltsScore = async (
  transcript: string,
  questionType: string = 'Part 1',
  questionText?: string
): Promise<IeltsScoreResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ielts/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        questionType,
        questionText,
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