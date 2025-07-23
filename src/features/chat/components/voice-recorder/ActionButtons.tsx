import React from 'react';
import { ArrowCounterClockwise, ArrowRight } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { getNextTopicQuestion, redoTopicQuestion } from '../../chatSlice';

const ActionButtons: React.FC = () => {
  const dispatch = useAppDispatch();
  const topicPractice = useAppSelector(state => state.chat.topicPractice);
  
  // Only show buttons during topic practice
  if (!topicPractice.currentTopic) {
    return null;
  }

  const handleRedo = () => {
    console.log('Redo button clicked');
    dispatch(redoTopicQuestion({}));
  };

  const handleNextQuestion = () => {
    dispatch(getNextTopicQuestion({}));
  };

  return (
    <div className="flex gap-3">
      {/* Redo Button */}
      <button
        onClick={handleRedo}
        className="p-3 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-all duration-200 shadow-sm hover:shadow-md group relative"
        aria-label="Redo"
      >
        <ArrowCounterClockwise size={20} />
        {/* Tooltip */}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Redo
        </span>
      </button>

      {/* Next Question Button */}
      <button
        onClick={handleNextQuestion}
        className="p-3 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-all duration-200 shadow-sm hover:shadow-md group relative"
        aria-label="Next Question"
      >
        <ArrowRight size={20} />
        {/* Tooltip */}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Next Question
        </span>
      </button>
    </div>
  );
};

export default ActionButtons;