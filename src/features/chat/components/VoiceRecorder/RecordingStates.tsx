import React from 'react';
import { RecordingButton, WaveformPlayer, ActionButtons } from '../voice-recorder';

interface IdleStateProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const IdleState: React.FC<IdleStateProps> = ({ onStartRecording, onStopRecording }) => {
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <ActionButtons />
      </div>
      <RecordingButton onStart={onStartRecording} onStop={onStopRecording} />
    </div>
  );
};

interface RecordingStateProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
}

export const RecordingState: React.FC<RecordingStateProps> = ({ onStartRecording, onStopRecording, onCancelRecording }) => {
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in w-full max-w-md">
      <RecordingButton onStart={onStartRecording} onStop={onStopRecording} onCancel={onCancelRecording} />
    </div>
  );
};

interface RecordedStateProps {
  onClear: () => void;
}

export const RecordedState: React.FC<RecordedStateProps> = ({ onClear }) => {
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in w-full max-w-md">
      <WaveformPlayer onClear={onClear} />
    </div>
  );
};