import React from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { selectRecordingDuration } from '../../store/voiceRecordingSlice';
import { formatDuration } from '@/shared/utils/audio';

const RecordingIndicator: React.FC = () => {
  const recordingDuration = useAppSelector(selectRecordingDuration);
  const minimumDuration = 10; // 10 seconds minimum
  const hasMetMinimum = recordingDuration >= minimumDuration;

  return (
    <div className={`flex items-center justify-center w-full max-w-md px-6 py-2 rounded-full shadow-sm transition-all duration-300 ${
      hasMetMinimum 
        ? 'bg-green-50 border border-green-300' 
        : 'bg-red-50 border border-red-300'
    }`}>
      <div className="flex items-center">
        <div className={`w-3 h-3 mr-2 rounded-full animate-pulse ${
          hasMetMinimum ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className={`text-sm font-medium ${
          hasMetMinimum ? 'text-green-600' : 'text-red-600'
        }`}>
          {hasMetMinimum 
            ? `Release to finish • ${formatDuration(recordingDuration)} ✓`
            : `Keep recording • ${formatDuration(recordingDuration)} (min ${minimumDuration}s)`
          }
        </span>
      </div>
    </div>
  );
};

export default RecordingIndicator;