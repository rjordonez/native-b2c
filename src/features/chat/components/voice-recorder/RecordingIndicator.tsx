import React from 'react';
import { Stop, X } from 'phosphor-react';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { selectRecordingDuration, clearRecording } from '../../store/voiceRecordingSlice';
import { formatDuration } from '@/shared/utils/audio';

interface RecordingIndicatorProps {
  onClick: () => void;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({ onClick }) => {
  const dispatch = useAppDispatch();
  const recordingDuration = useAppSelector(selectRecordingDuration);
  const minimumDuration = 10; // 10 seconds minimum
  const hasMetMinimum = recordingDuration >= minimumDuration;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        {/* Recording time display with cancel button */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          hasMetMinimum 
            ? 'bg-green-50 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {/* Cancel button inside the time display */}
          <button
            onClick={() => dispatch(clearRecording())}
            className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors -ml-1"
            title="Cancel recording"
          >
            <X size={16} />
          </button>
          
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            hasMetMinimum ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-lg font-medium font-mono">
            {recordingDuration}s
          </span>
          {hasMetMinimum && <span className="text-green-600">✓</span>}
        </div>
      </div>

      {/* iPhone-style stop button */}
      <div className="relative group">
        <button
          onClick={onClick}
          disabled={!hasMetMinimum}
          className={`relative flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg transition-all duration-200 ${
            hasMetMinimum 
              ? 'bg-red-500 hover:bg-red-600 transform hover:scale-105 active:scale-95 cursor-pointer' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          aria-label="Stop recording"
        >
          <div className={`w-6 h-6 rounded-sm ${hasMetMinimum ? 'bg-white' : 'bg-gray-500'}`} />
        </button>
        {!hasMetMinimum && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            Keep speaking (10s minimum)
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className={`text-sm ${
        hasMetMinimum ? 'text-gray-600' : 'text-gray-500'
      }`}>
        {hasMetMinimum 
          ? 'Click to stop recording'
          : `Keep recording (minimum ${minimumDuration}s)`
        }
      </p>
    </div>
  );
};

export default RecordingIndicator;