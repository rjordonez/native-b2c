import { API_BASE_URL } from '../../../../config/api';

export async function generateTTS(options: {
  text: string;
  voiceName: string;
  speakingRate: number;
}): Promise<{ success: boolean; data?: { audioUrl: string; audioData?: string }; message?: string }> {
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

  const result = await ttsResponse.json();
  
  
  // If we have an audio URL that's already a data URL, use it as audioData
  if (result.success && result.data?.audioUrl) {
    if (result.data.audioUrl.startsWith('data:')) {
      // It's already a base64 data URL, just use it
      result.data.audioData = result.data.audioUrl;
    } else {
      // It's a blob URL, need to fetch and convert
      try {
        const audioResponse = await fetch(result.data.audioUrl);
        
        if (!audioResponse.ok) {
          throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
        }
        
        const audioBlob = await audioResponse.blob();
        
        // Convert blob to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64);
          };
        });
        reader.readAsDataURL(audioBlob);
        
        const audioData = await base64Promise;
        result.data.audioData = audioData;
      } catch (error) {
        console.error('[TTS] Failed to convert audio to base64:', error);
        // Continue without base64 data - URL will still work for current session
      }
    }
  }

  return result;
}