import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { selectIsPressed } from '../../store/voiceRecordingSlice';

interface RecordingButtonProps {
  // No mouse event props needed - spacebar only
}

const RecordingButton: React.FC<RecordingButtonProps> = () => {
  const dispatch = useAppDispatch();
  const isPressed = useAppSelector(selectIsPressed);

  return (
    <div className="flex items-center justify-center w-full max-w-md px-6 py-2 bg-white border border-gray-300 rounded-full shadow-sm">
      <div
        className={`flex items-center justify-center w-full transition-colors cursor-default ${
          isPressed ? 'bg-gray-100' : ''
        }`}
      >
        <span className="text-sm text-gray-600">Hold </span>
        <span className="inline-block px-2 py-1 mx-1 text-xs font-semibold uppercase bg-gray-100 border border-gray-400 rounded">
          SPACE
        </span>
        <span className="text-sm text-gray-600"> to record</span>
      </div>
    </div>
  );
};

export default RecordingButton;