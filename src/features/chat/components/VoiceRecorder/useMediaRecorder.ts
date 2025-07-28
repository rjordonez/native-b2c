import { useRef } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { audioBufferToWav } from '../../../../utils/audioUtils';
import { stopRecording, updateRecordingDuration } from '../../store/voiceRecordingSlice';

export const useMediaRecorder = () => {
  const dispatch = useAppDispatch();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationRef = useRef<number>(0);

  const initializeRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Record as WebM (will convert to WAV for pronunciation)
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const webmBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        try {
          // Convert WebM to WAV for Azure pronunciation assessment
          const arrayBuffer = await webmBlob.arrayBuffer();
          
          // Create audio context for conversion
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const wavBlob = await audioBufferToWav(audioBuffer);
          
          // Create audio URL for playback (use original WebM for better browser compatibility)
          const audioUrl = URL.createObjectURL(webmBlob);
          
          // Convert WAV blob to base64 for API
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result as string;
            
            dispatch(stopRecording({
              audioUrl,
              audioData: base64Data, // WAV base64 data for API
              duration: durationRef.current,
              mimeType: 'audio/wav' // Now it's actually WAV
            }));
          };
          reader.readAsDataURL(wavBlob);
          
          // Clean up audio context
          audioContext.close();
          
        } catch (conversionError) {
          console.error('WAV conversion failed, falling back to WebM:', conversionError);
          // Fallback to WebM if conversion fails
          const audioUrl = URL.createObjectURL(webmBlob);
          
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result as string;
            
            dispatch(stopRecording({
              audioUrl,
              audioData: base64Data,
              duration: durationRef.current,
              mimeType: 'audio/webm' // Fallback to WebM
            }));
          };
          reader.readAsDataURL(webmBlob);
        }

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      return false;
    }
  };

  return {
    mediaRecorderRef,
    durationRef,
    initializeRecorder
  };
};