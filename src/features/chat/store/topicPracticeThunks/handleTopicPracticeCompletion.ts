import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store/types';
import type { AppDispatch } from '../../../../store/types';
import { addMessage, setTyping } from '../conversationSlice';
import { updateTopicProgressInDB } from '../../../library/libraryThunks';
import { setTopicCompleted } from '../topicPracticeSlice';

// Handle topic practice completion message
export const handleTopicPracticeCompletion = createAsyncThunk<
  void,
  { conversationId: string },
  { dispatch: AppDispatch; state: RootState }
>(
  'topicPractice/handleCompletion',
  async ({ conversationId }, { getState, dispatch }) => {
    const state = getState();
    const topicPractice = state.topicPractice;
    
    if (topicPractice.currentTopic && topicPractice.questions) {
      const currentIndex = topicPractice.currentQuestionIndex;
      const totalQuestions = topicPractice.questions.length;
      const isLastQuestion = currentIndex === totalQuestions - 1;
      const topicTitle = topicPractice.currentTopic.title;
      const topicPart = topicPractice.currentTopic.part || 'Part 1';
      
      // Show AI typing
      dispatch(setTyping(true));
      
      // Wait a bit to simulate AI thinking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create appropriate completion message
      let messageContent: string;
      if (isLastQuestion) {
        // Final question completed - congratulations message
        messageContent = `🎉 Congratulations! You have completed "${topicTitle}" - ${topicPart}. Great job practicing all ${totalQuestions} questions!`;
        
        // Check if we haven't already marked this topic as completed
        const hasCompletedTopic = state.topicPractice.hasCompletedTopic;
        if (!hasCompletedTopic) {
          // Update topic progress to mark as completed
          const topicId = topicPractice.currentTopic.id;
          await dispatch(updateTopicProgressInDB({ 
            topicId, 
            progress: 100, 
            completed: true 
          })).unwrap();
          
          // Set the flag to prevent duplicate updates
          dispatch(setTopicCompleted());
        }
      } else {
        // Not the last question - regular completion message
        messageContent = `You have completed question ${currentIndex + 1} out of ${totalQuestions}. Let me know when you want to go to the next question.`;
      }
      
      const completionMessage = {
        id: `msg-${Date.now()}`,
        content: messageContent,
        sender: 'assistant' as const,
        timestamp: new Date().toISOString(),
      };
      
      dispatch(addMessage({ conversationId, message: completionMessage }));
      dispatch(setTyping(false));
    }
  }
);