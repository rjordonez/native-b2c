import React from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { selectRecordingDuration } from '../../store/voiceRecordingSlice';
import { formatDuration } from '@/shared/utils/audio';

const RecordingIndicator: React.FC = () => {
  const recordingDuration = useAppSelector(selectRecordingDuration);


  return (
    <div className="flex items-center justify-center w-full max-w-md px-6 py-2 bg-red-50 border border-red-300 rounded-full shadow-sm">
      <div className="flex items-center">
        <div className="w-3 h-3 mr-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-red-600 font-medium">
          Release to finish • {formatDuration(recordingDuration)}
        </span>
      </div>
    </div>
  );
};

export default RecordingIndicator;