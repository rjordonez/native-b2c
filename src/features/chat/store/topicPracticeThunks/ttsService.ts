import { API_BASE_URL } from '../../../../config/api';

export async function generateTTS(options: {
  text: string;
  voiceName: string;
  speakingRate: number;
}): Promise<{ success: boolean; data?: { audioUrl: string }; message?: string }> {
  const ttsResponse = await fetch(`${API_BASE_URL}/tts/synthesize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!ttsResponse.ok) {
    const errorData = await ttsResponse.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Failed to generate audio';
    
    // Provide more specific error for TTS configuration issues
    if (ttsResponse.status === 503 || errorMessage.includes('unavailable')) {
      throw new Error('Text-to-speech service is not configured. Please check backend TTS settings.');
    }
    throw new Error(errorMessage);
  }

  return await ttsResponse.json();
}