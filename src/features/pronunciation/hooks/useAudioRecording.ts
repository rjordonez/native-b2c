import { useState, useRef, useCallback } from 'react';
import { audioBufferToWav, RECORDING_CONSTRAINTS } from '@/shared/utils/audio';

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

      const stream = await navigator.mediaDevices.getUserMedia(RECORDING_CONSTRAINTS);

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

