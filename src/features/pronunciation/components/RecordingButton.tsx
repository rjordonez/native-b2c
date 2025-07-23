import React from 'react';
import { Microphone, Square } from 'phosphor-react';
import { cn } from '../../../utils/cn';

interface RecordingButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const RecordingButton: React.FC<RecordingButtonProps> = ({
  isRecording,
  onStart,
  onStop,
  disabled = false
}) => {
  const handleClick = () => {
    if (disabled) return;
    
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200',
        'focus:outline-none focus:ring-4 focus:ring-blue-500/20',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'bg-blue-500 hover:bg-blue-600',
        isRecording && !disabled && 'bg-red-500 hover:bg-red-600'
      )}
    >
      {isRecording ? (
        <Square size={24} weight="fill" className="text-white" />
      ) : (
        <Microphone size={24} weight="fill" className="text-white" />
      )}
    </button>
  );
};