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
      // Start with 100ms timeslice to ensure data is collected regularly
      mediaRecorderRef.current.start(100);
      
      // Start timer
      recordingTimerRef.current = setInterval(() => {
        durationRef.current += 1;
        dispatch(updateRecordingDuration(durationRef.current));
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

  return {
    handleStartRecording,
    handleStopRecording,
    handleClear
  };
};