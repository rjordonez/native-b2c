import React from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { selectTopicPractice } from '../../store/topicPracticeSlice';
import { selectShowProgressDots } from '../../store/audioPlaybackSlice';

const ProgressDots: React.FC = () => {
  const topicPractice = useAppSelector(selectTopicPractice);
  const showProgressDots = useAppSelector(selectShowProgressDots);
  const { currentTopic, currentQuestionIndex, questions } = topicPractice;
  
  // Only show during topic practice and when enabled in settings
  if (!currentTopic || !showProgressDots || !questions) {
    return null;
  }
  
  const totalQuestions = questions.length;
  
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalQuestions }, (_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            index < currentQuestionIndex 
              ? 'bg-primary' 
              : index === currentQuestionIndex
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