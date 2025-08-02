import React from 'react';
import { Microphone, Square, X } from 'phosphor-react';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { selectRecordingState, selectRecordingDuration, clearRecording } from '../../store/voiceRecordingSlice';
import { cn } from '../../../../utils/cn';
import { formatDuration } from '@/shared/utils/audio';

interface RecordingButtonProps {
  onStart: () => void;
  onStop: () => void;
  onCancel?: () => void;
}

const RecordingButton: React.FC<RecordingButtonProps> = ({ onStart, onStop, onCancel }) => {
  const dispatch = useAppDispatch();
  const recordingState = useAppSelector(selectRecordingState);
  const recordingDuration = useAppSelector(selectRecordingDuration);
  const isRecording = recordingState === 'recording';
  const minimumDuration = 10;
  const hasMetMinimum = recordingDuration >= minimumDuration;

  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  if (!isRecording) {
    // Simple microphone button when not recording
    return (
      <button
        onClick={handleClick}
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200',
          'focus:outline-none shadow-sm',
          'bg-secondary hover:bg-secondary/90'
        )}
        aria-label="Start recording"
      >
        <Microphone size={24} weight="fill" className="text-white" />
      </button>
    );
  }

  // Clean inline design when recording (similar to waveform player)
  return (
    <div className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm">
      {/* Stop button */}
      <div className="relative group">
        <button
          onClick={handleClick}
          disabled={!hasMetMinimum}
          className={cn(
            "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors",
            hasMetMinimum 
              ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          <Square size={16} weight="fill" />
        </button>
        {!hasMetMinimum && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Keep speaking (10s minimum)
          </div>
        )}
      </div>

      {/* Recording indicator */}
      <div className="flex-1 flex items-center justify-center">
        <div className={cn(
          "w-2 h-2 rounded-full mr-2",
          hasMetMinimum ? 'bg-green-500' : 'bg-red-500 animate-pulse'
        )} />
        <span className="text-sm text-gray-600">Recording</span>
      </div>

      {/* Cancel button (X) */}
      <button
        onClick={() => {
          if (onCancel) {
            onCancel();
          }
        }}
        className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors mr-2"
        title="Cancel recording"
      >
        <X size={16} />
      </button>

      {/* Timer */}
      <span className="text-xs text-gray-500">
        {recordingDuration}s
      </span>
    </div>
  );
};

export default RecordingButton;