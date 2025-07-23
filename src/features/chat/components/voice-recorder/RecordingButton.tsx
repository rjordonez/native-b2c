import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { selectIsPressed } from '../../chatSlice';

interface RecordingButtonProps {
  onMouseDown: () => void;
  onMouseUp: () => void;
}

const RecordingButton: React.FC<RecordingButtonProps> = ({
  onMouseDown,
  onMouseUp,
}) => {
  const dispatch = useAppDispatch();
  const isPressed = useAppSelector(selectIsPressed);

  const handleMouseLeave = () => {
    onMouseUp(); // Stop recording if mouse leaves
  };

  return (
    <div className="flex items-center justify-center w-full max-w-md px-6 py-2 bg-white border border-gray-300 rounded-full shadow-sm">
      <button
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`flex items-center justify-center w-full transition-colors ${
          isPressed ? 'bg-gray-100' : 'hover:bg-gray-50'
        }`}
      >
        <span className="inline-block px-2 py-1 mr-2 text-xs font-semibold uppercase bg-gray-100 border border-gray-400 rounded">
          SPACE
        </span>
        <span className="text-sm text-gray-600">Press and hold to talk</span>
      </button>
    </div>
  );
};

export default RecordingButton;