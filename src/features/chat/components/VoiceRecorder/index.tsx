import React from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { selectRecordingState } from '../../store/voiceRecordingSlice';
import { useMediaRecorder } from './useMediaRecorder';
import { useRecordingHandlers } from './useRecordingHandlers';
import { IdleState, RecordingState, RecordedState } from './RecordingStates';

const VoiceRecorder: React.FC = () => {
  const recordingState = useAppSelector(selectRecordingState);
  
  const { mediaRecorderRef, durationRef, initializeRecorder } = useMediaRecorder();
  const { handleStartRecording, handleStopRecording, handleClear, handleCancelRecording } = useRecordingHandlers({
    mediaRecorderRef,
    durationRef,
    initializeRecorder
  });

  // Render different states
  if (recordingState === 'idle') {
    return <IdleState onStartRecording={handleStartRecording} onStopRecording={handleStopRecording} />;
  }

  if (recordingState === 'recording') {
    return <RecordingState onStartRecording={handleStartRecording} onStopRecording={handleStopRecording} onCancelRecording={handleCancelRecording} />;
  }

  if (recordingState === 'recorded' || recordingState === 'playing') {
    return <RecordedState onClear={handleClear} />;
  }

  return null;
};

export default VoiceRecorder;