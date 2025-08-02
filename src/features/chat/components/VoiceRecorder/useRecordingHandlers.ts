import { useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  selectRecordingState,
  startRecording,
  updateRecordingDuration,
  clearRecording
} from '../../store/voiceRecordingSlice';

interface UseRecordingHandlersProps {
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  durationRef: React.MutableRefObject<number>;
  initializeRecorder: () => Promise<boolean>;
}

export const useRecordingHandlers = ({
  mediaRecorderRef,
  durationRef,
  initializeRecorder
}: UseRecordingHandlersProps) => {
  const dispatch = useAppDispatch();
  const recordingState = useAppSelector(selectRecordingState);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start recording when clicked
  const handleStartRecording = async () => {
    if (recordingState !== 'idle') return;
    
    // Reset duration before starting
    durationRef.current = 0;
    dispatch(updateRecordingDuration(0));
    
    const success = await initializeRecorder();
    
    if (success && mediaRecorderRef.current) {
      dispatch(startRecording());
      
      // Use a larger timeslice for mobile (1 second) to ensure data collection
      const timeslice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 1000 : 100;
      mediaRecorderRef.current.start(timeslice);
      
      // Start timer - use Date.now() for more accurate timing on mobile
      const startTime = Date.now();
      recordingTimerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        durationRef.current = elapsed;
        dispatch(updateRecordingDuration(elapsed));
      }, 1000);
    }
  };

  // Stop recording when clicked
  const handleStopRecording = () => {
    if (recordingState !== 'recording') return;
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      // Stop the recording
      mediaRecorderRef.current.stop();
    }
  };

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
    durationRef.current = 0;
  };

  // Handle canceling recording (stops everything before clearing)
  const handleCancelRecording = () => {
    // Stop the timer
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    // Stop the media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        // Remove the onstop handler to prevent saving
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
        
        // Stop all tracks
        const stream = mediaRecorderRef.current.stream;
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
    
    // Clear the state
    dispatch(clearRecording());
    durationRef.current = 0;
  };

  return {
    handleStartRecording,
    handleStopRecording,
    handleClear,
    handleCancelRecording
  };
};