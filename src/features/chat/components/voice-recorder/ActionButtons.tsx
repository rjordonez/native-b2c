import React, { useState, useEffect } from 'react';
import { ArrowCounterClockwise, ArrowRight, CircleNotch, Warning } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectTopicPractice, selectIsLoadingQuestion, selectQuestionError } from '../../store/topicPracticeSlice';
import { getNextTopicQuestion, redoTopicQuestion } from '../../store/topicPracticeThunks';
import { selectActiveConversation } from '../../store/conversationSlice';

const ActionButtons: React.FC = () => {
  const dispatch = useAppDispatch();
  const topicPractice = useAppSelector(selectTopicPractice);
  const activeConversation = useAppSelector(selectActiveConversation);
  const isLoadingQuestion = useAppSelector(selectIsLoadingQuestion);
  const questionError = useAppSelector(selectQuestionError);
  const [showError, setShowError] = useState(false);
  
  // Check if this is a topic practice session
  // Either by having currentTopic in state OR by detecting topic questions in messages
  const isTopicPractice = topicPractice.currentTopic || 
    (activeConversation?.messages.some(m => m.isTopicQuestion) ?? false);
  
  // Show error message for 3 seconds when error occurs
  useEffect(() => {
    if (questionError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [questionError]);
  
  // Only show buttons during topic practice
  if (!isTopicPractice) {
    return null;
  }

  const handleRedo = async () => {
    if (isLoadingQuestion) return;
    await dispatch(redoTopicQuestion({}));
  };

  const handleNextQuestion = async () => {
    if (isLoadingQuestion) return;
    await dispatch(getNextTopicQuestion({}));
  };

  return (
    <div className="relative">
      {/* Error Message */}
      {showError && questionError && (
        <div className="absolute bottom-full mb-2 left-0 right-0 flex items-center justify-center">
          <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg flex items-center gap-2 shadow-md animate-fade-in">
            <Warning size={16} />
            <span className="text-sm">{questionError}</span>
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        {/* Redo Button */}
        <button
          onClick={handleRedo}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 shadow-sm group relative ${
            isLoadingQuestion 
              ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
              : 'text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 hover:shadow-md'
          }`}
          aria-label="Redo"
          disabled={isLoadingQuestion}
        >
          {isLoadingQuestion ? (
            <CircleNotch size={20} className="animate-spin" />
          ) : (
            <ArrowCounterClockwise size={20} />
          )}
          {/* Tooltip */}
          {!isLoadingQuestion && (
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Redo
            </span>
          )}
        </button>

        {/* Next Question Button */}
        <button
          onClick={handleNextQuestion}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 shadow-sm group relative ${
            isLoadingQuestion 
              ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
              : 'text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 hover:shadow-md'
          }`}
          aria-label="Next Question"
          disabled={isLoadingQuestion}
        >
          {isLoadingQuestion ? (
            <CircleNotch size={20} className="animate-spin" />
          ) : (
            <ArrowRight size={20} />
          )}
          {/* Tooltip */}
          {!isLoadingQuestion && (
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Next Question
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;