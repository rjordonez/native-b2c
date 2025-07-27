import { API_BASE_URL } from '../../../../config/api';

interface TTSOptions {
  text: string;
  speed: number;
  voice: string;
}

interface TTSResult {
  audioUrl: string | null;
  audioData: string | null;
}

export async function generateTTS(options: TTSOptions): Promise<TTSResult> {
  const ttsRequestBody = {
    text: options.text,
    speed: options.speed,
    voice: options.voice
  };

  try {
    const ttsResponse = await fetch(`${API_BASE_URL}/api/audio/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ttsRequestBody),
    });

    if (!ttsResponse.ok) {
      throw new Error(`TTS failed: ${ttsResponse.statusText}`);
    }

    const audioBlob = await ttsResponse.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Convert blob to base64 for storage
    const reader = new FileReader();
    const audioData = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(audioBlob);
    });

    return { audioUrl, audioData };
  } catch (error) {
    console.error('TTS generation failed:', error);
    // Return null values to continue without audio
    return { audioUrl: null, audioData: null };
  }
}

export async function generateTTSLegacy(options: {
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