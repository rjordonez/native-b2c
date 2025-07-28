import React, { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectTopicPractice } from '../../store/topicPracticeSlice';
import { getNextTopicQuestion, redoTopicQuestion } from '../../store/topicPracticeThunks';
import { selectActiveConversation } from '../../store/conversationSlice';

const ActionButtons: React.FC = () => {
  const dispatch = useAppDispatch();
  const topicPractice = useAppSelector(selectTopicPractice);
  const activeConversation = useAppSelector(selectActiveConversation);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check if this is a topic practice session
  // Either by having currentTopic in state OR by detecting topic questions in messages
  const isTopicPractice = topicPractice.currentTopic || 
    (activeConversation?.messages.some(m => m.isTopicQuestion) ?? false);
  
  // Only show buttons during topic practice
  if (!isTopicPractice) {
    return null;
  }

  const handleRedo = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    await dispatch(redoTopicQuestion({}));
    // Add a small delay to prevent rapid clicks
    setTimeout(() => setIsProcessing(false), 500);
  };

  const handleNextQuestion = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    await dispatch(getNextTopicQuestion({}));
    // Add a small delay to prevent rapid clicks
    setTimeout(() => setIsProcessing(false), 500);
  };

  return (
    <div className="flex gap-3">
      {/* Redo Button */}
      <button
        onClick={handleRedo}
        className={`p-3 rounded-full transition-all duration-200 shadow-sm group relative ${
          isProcessing 
            ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
            : 'text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 hover:shadow-md'
        }`}
        aria-label="Redo"
        disabled={isProcessing}
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
        className={`p-3 rounded-full transition-all duration-200 shadow-sm group relative ${
          isProcessing 
            ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
            : 'text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 hover:shadow-md'
        }`}
        aria-label="Next Question"
        disabled={isProcessing}
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