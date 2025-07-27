import React from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { selectTopicPractice } from '../../store/topicPracticeSlice';
import { selectShowProgressDots } from '../../store/audioPlaybackSlice';
import { selectActiveConversation } from '../../store/conversationSlice';

const ProgressDots: React.FC = () => {
  const topicPractice = useAppSelector(selectTopicPractice);
  const showProgressDots = useAppSelector(selectShowProgressDots);
  const activeConversation = useAppSelector(selectActiveConversation);
  const { currentTopic, currentQuestionIndex, questions } = topicPractice;
  
  // Check both topic practice state and conversation metadata
  const hasTopicPractice = currentTopic && questions && questions.length > 0;
  const hasTopicMetadata = activeConversation?.topicPracticeMetadata;
  
  // Only show during topic practice and when enabled in settings
  if (!showProgressDots || (!hasTopicPractice && !hasTopicMetadata)) {
    return null;
  }
  
  // Use metadata if topic practice state is not loaded yet
  const totalQuestions = questions?.length || activeConversation?.topicPracticeMetadata?.totalQuestions || 0;
  const currentIndex = currentQuestionIndex ?? activeConversation?.topicPracticeMetadata?.currentQuestionIndex ?? 0;
  
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalQuestions }, (_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            index < currentIndex 
              ? 'bg-primary' 
              : index === currentIndex
              ? 'bg-primary/50 ring-2 ring-primary/30'
              : 'bg-gray-300'
          }`}
          aria-label={`Question ${index + 1} of ${totalQuestions}`}
        />
      ))}
    </div>
  );
};

export default ProgressDots;