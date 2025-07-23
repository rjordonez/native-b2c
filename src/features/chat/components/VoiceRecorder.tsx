import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectRecordingState,
  selectRecordingDuration,
  startRecording,
  stopRecording,
  clearRecording,
  updateRecordingDuration,
  setIsPressed
} from '../chatSlice';
import { RecordingButton, RecordingIndicator, WaveformPlayer } from './voice-recorder';

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
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Convert blob to base64 for persistent storage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          
          dispatch(stopRecording({
            audioUrl,
            audioData: base64Data, // Store base64 data for persistence
            duration: recordingDuration
          }));
        };
        reader.readAsDataURL(audioBlob);

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
      <RecordingButton
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    );
  }

  if (recordingState === 'recording') {
    return <RecordingIndicator />;
  }

  if (recordingState === 'recorded' || recordingState === 'playing') {
    return <WaveformPlayer onClear={handleClear} />;
  }

  return null;
};

export default VoiceRecorder;