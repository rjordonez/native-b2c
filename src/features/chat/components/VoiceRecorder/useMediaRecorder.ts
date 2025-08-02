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
      // Check if getUserMedia is available (requires HTTPS on iOS)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const message = isIOS 
          ? 'Microphone access requires HTTPS on iOS. Please use an HTTPS connection or test on desktop.'
          : 'Microphone access is not available. Please check your browser permissions.';
        alert(message);
        throw new Error(message);
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      // Check for supported MIME types (mobile compatibility)
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Create blob with the actual mime type used
        const recordedBlob = new Blob(chunksRef.current, { type: mimeType });
        
        // Check if we have valid data
        if (recordedBlob.size === 0) {
          console.error('No audio data recorded');
          dispatch(stopRecording({
            audioUrl: '',
            audioData: '',
            duration: 0,
            mimeType: mimeType
          }));
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        try {
          // Convert to WAV for Azure pronunciation assessment
          const arrayBuffer = await recordedBlob.arrayBuffer();
          
          // Create audio context for conversion (with webkit prefix for iOS)
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const audioContext = new AudioContextClass();
          
          // Try to decode the audio data
          let audioBuffer;
          try {
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          } catch (decodeError) {
            console.error('Failed to decode audio, using original format:', decodeError);
            // If decoding fails, just use the original blob
            const audioUrl = URL.createObjectURL(recordedBlob);
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Data = reader.result as string;
              dispatch(stopRecording({
                audioUrl,
                audioData: base64Data,
                duration: durationRef.current,
                mimeType: mimeType
              }));
            };
            reader.readAsDataURL(recordedBlob);
            audioContext.close();
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          
          const wavBlob = await audioBufferToWav(audioBuffer);
          
          // Create audio URL for playback (use original for better browser compatibility)
          const audioUrl = URL.createObjectURL(recordedBlob);
          
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