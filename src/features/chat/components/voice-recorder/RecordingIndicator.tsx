import React from 'react';
import { Stop } from 'phosphor-react';
import { useAppSelector } from '../../../../store/hooks';
import { selectRecordingDuration } from '../../store/voiceRecordingSlice';
import { formatDuration } from '@/shared/utils/audio';

interface RecordingIndicatorProps {
  onClick: () => void;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({ onClick }) => {
  const recordingDuration = useAppSelector(selectRecordingDuration);
  const minimumDuration = 10; // 10 seconds minimum
  const hasMetMinimum = recordingDuration >= minimumDuration;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        {/* Recording time display */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          hasMetMinimum 
            ? 'bg-green-50 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            hasMetMinimum ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-lg font-medium font-mono">
            {formatDuration(recordingDuration)}
          </span>
          {hasMetMinimum && <span className="text-green-600">✓</span>}
        </div>
      </div>

      {/* iPhone-style stop button */}
      <button
        onClick={onClick}
        className="relative flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        aria-label="Stop recording"
      >
        <div className="w-6 h-6 bg-white rounded-sm" />
      </button>

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