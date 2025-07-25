import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { audioBufferToWav } from '../../../utils/audioUtils';
import {
  selectRecordingState,
  selectRecordingDuration,
  startRecording,
  stopRecording,
  clearRecording,
  updateRecordingDuration,
  setIsPressed
} from '../store/voiceRecordingSlice';
import { RecordingButton, RecordingIndicator, WaveformPlayer, ActionButtons } from './voice-recorder';

const VoiceRecorder: React.FC = () => {
  const dispatch = useAppDispatch();
  const recordingState = useAppSelector(selectRecordingState);
  const recordingDuration = useAppSelector(selectRecordingDuration);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Initialize media recorder
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
              duration: recordingDuration,
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
              duration: recordingDuration,
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

  // Start recording when space is pressed
  const handleMouseDown = async () => {
    if (recordingState !== 'idle') return;
    
    dispatch(setIsPressed(true));
    const success = await initializeRecorder();
    
    if (success && mediaRecorderRef.current) {
      dispatch(startRecording());
      mediaRecorderRef.current.start();
      
      // Start timer
      let duration = 0;
      recordingTimerRef.current = setInterval(() => {
        duration += 1;
        dispatch(updateRecordingDuration(duration));
      }, 1000);
    }
  };

  // Stop recording when space is released
  const handleMouseUp = () => {
    if (recordingState !== 'recording') return;
    
    dispatch(setIsPressed(false));
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat && recordingState === 'idle') {
        event.preventDefault();
        handleMouseDown();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space' && recordingState === 'recording') {
        event.preventDefault();
        handleMouseUp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [recordingState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Handle clearing recording
  const handleClear = () => {
    dispatch(clearRecording());
  };

  // Render different states
  if (recordingState === 'idle') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <ActionButtons />
        </div>
        <RecordingButton
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      </div>
    );
  }

  if (recordingState === 'recording') {
    return <RecordingIndicator />;
  }

  if (recordingState === 'recorded' || recordingState === 'playing') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <ActionButtons />
        </div>
        <WaveformPlayer onClear={handleClear} />
      </div>
    );
  }

  return null;
};

export default VoiceRecorder;