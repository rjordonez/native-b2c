import { useState, useRef, useCallback } from 'react';

interface UseAudioRecordingProps {
  onRecordingComplete: (audioBlob: Blob, audioUrl: string) => void;
}

export const useAudioRecording = ({ onRecordingComplete }: UseAudioRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedAudioUrl, setCachedAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });

      // Create AudioContext for WAV conversion
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          // Convert to WAV
          const arrayBuffer = await webmBlob.arrayBuffer();
          const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
          const wavBlob = await audioBufferToWav(audioBuffer);
          
          // Create audio URL for playback
          const audioUrl = URL.createObjectURL(webmBlob);
          setCachedAudioUrl(audioUrl);
          
          onRecordingComplete(wavBlob, audioUrl);
        } catch (conversionError) {
          console.error('Audio conversion error:', conversionError);
          // Fallback to webm if conversion fails
          const audioUrl = URL.createObjectURL(webmBlob);
          setCachedAudioUrl(audioUrl);
          onRecordingComplete(webmBlob, audioUrl);
        }
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to access microphone. Please ensure microphone permissions are granted.');
      console.error('Recording error:', err);
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const cleanupAudio = useCallback(() => {
    if (cachedAudioUrl) {
      URL.revokeObjectURL(cachedAudioUrl);
      setCachedAudioUrl(null);
    }
  }, [cachedAudioUrl]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error,
    cachedAudioUrl,
    cleanupAudio
  };
};

// Convert AudioBuffer to WAV Blob
function audioBufferToWav(buffer: AudioBuffer): Promise<Blob> {
  return new Promise((resolve) => {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels: Float32Array[] = [];
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };

    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    // RIFF identifier
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    // fmt sub-chunk
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // subchunk size
    setUint16(1); // PCM
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels); // byte rate
    setUint16(buffer.numberOfChannels * 2); // block align
    setUint16(16); // bits per sample

    // data sub-chunk
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4); // subchunk size

    // Write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        const sample = Math.max(-1, Math.min(1, channels[i][offset]));
        view.setInt16(pos, sample * 0x7FFF, true);
        pos += 2;
      }
      offset++;
    }

    resolve(new Blob([arrayBuffer], { type: 'audio/wav' }));
  });
}