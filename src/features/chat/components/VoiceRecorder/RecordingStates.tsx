import React from 'react';
import { RecordingButton, RecordingIndicator, WaveformPlayer, ActionButtons } from '../voice-recorder';

interface IdleStateProps {
  // No props needed for idle state
}

export const IdleState: React.FC<IdleStateProps> = () => {
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <ActionButtons />
      </div>
      <RecordingButton />
    </div>
  );
};

interface RecordingStateProps {
  // No props needed for recording state
}

export const RecordingState: React.FC<RecordingStateProps> = () => {
  return <RecordingIndicator />;
};

interface RecordedStateProps {
  onClear: () => void;
}

export const RecordedState: React.FC<RecordedStateProps> = ({ onClear }) => {
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <ActionButtons />
      </div>
      <WaveformPlayer onClear={onClear} />
    </div>
  );
};