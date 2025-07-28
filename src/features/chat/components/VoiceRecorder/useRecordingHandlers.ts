import { useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  selectRecordingState,
  startRecording,
  updateRecordingDuration,
  setIsPressed,
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

  // Start recording when space is pressed
  const handleMouseDown = async () => {
    if (recordingState !== 'idle') return;
    
    dispatch(setIsPressed(true));
    
    // Reset duration before starting
    durationRef.current = 0;
    dispatch(updateRecordingDuration(0));
    
    const success = await initializeRecorder();
    
    if (success && mediaRecorderRef.current) {
      dispatch(startRecording());
      mediaRecorderRef.current.start();
      
      // Start timer
      recordingTimerRef.current = setInterval(() => {
        durationRef.current += 1;
        dispatch(updateRecordingDuration(durationRef.current));
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
    durationRef.current = 0;
  };

  return {
    handleMouseDown,
    handleMouseUp,
    handleClear
  };
};