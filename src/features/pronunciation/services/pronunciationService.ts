import { Word } from '../types';
import { API_BASE_URL } from '../../../config/api';

interface PronunciationResponse {
  pronunciationScore: {
    accuracy: number;
    fluency: number;
    completeness: number;
    pronunciation: number;
  };
  words: Array<{
    word: string;
    accuracy: number;
    errorType: string;
    phonemes: Array<{
      phoneme: string;
      accuracy: number;
    }>;
  }>;
}

export const pronunciationService = {
  async assessPronunciation(audioBlob: Blob, referenceText: string): Promise<Word[]> {
    try {
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      const response = await fetch(`${API_BASE_URL}/pronunciation/assess-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: base64Audio,
          referenceText: referenceText,
          contentType: 'audio/wav'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API error: ${response.statusText}`);
      }

      const response_data = await response.json();
      console.log('API response:', response_data); // Debug log
      
      // Check if response is successful
      if (!response_data.success) {
        throw new Error(response_data.message || 'Pronunciation assessment failed');
      }
      
      // Extract data from response
      const { data } = response_data;
      
      // Check if any words were recognized
      if (!data.wordScores || data.wordScores.length === 0) {
        console.warn('No words recognized. Recognized text:', data.recognizedText);
        // Return words from reference text with 0 scores
        const referenceWords = referenceText.split(' ');
        return referenceWords.map(word => ({
          text: word,
          score: 0,
          isCorrect: false,
          phonemes: []
        }));
      }
      
      // Map API response to our Word format
      return data.wordScores.map((wordData: any) => ({
        text: wordData.word,
        score: wordData.score || 0,
        isCorrect: (wordData.score || 0) >= 80,
        phonemes: wordData.phonemes?.map((p: any) => ({
          phoneme: p.phoneme,
          score: p.score || 0
        })) || [],
        audioTimestamp: wordData.offset && wordData.duration ? {
          start: wordData.offset / 10000000, // Convert from ticks to seconds
          end: (wordData.offset + wordData.duration) / 10000000
        } : undefined
      }));
    } catch (error) {
      console.error('Pronunciation assessment error:', error);
      throw error;
    }
  }
};

// Helper function to convert blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:audio/webm;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}