import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store/types';
import type { AppDispatch } from '../../../../store/types';
import { addMessage, setTyping, selectActiveConversation } from '../conversationSlice';
import { updateTopicProgressInDB } from '../../../library/libraryThunks';
import { setTopicCompleted } from '../topicPracticeSlice';
import { completeChecklistForPart } from '../../../../store/slices/dashboard/dashboardThunks';
import { generateMessageId } from '../../../../utils/idGenerator';
import { getIeltsScore } from '../../services/ieltsService';

// Helper function to get conversational completion messages
const getCompletionMessage = (currentQuestionIndex: number, totalQuestions: number, messageCount: number = 0): string => {
  const questionNumber = currentQuestionIndex + 1;
  const remaining = totalQuestions - questionNumber;
  
  const messages = [
    `Nice! You've finished question ${questionNumber}. Hit the next arrow whenever you're ready to keep going - ${remaining} more to go!`,
    `Great job on question ${questionNumber}! When you feel ready, just tap that next arrow and we'll jump into question ${questionNumber + 1}.`,
    `You're done with question ${questionNumber} - that's ${questionNumber} down, ${remaining} to go! Take your time, and click next when you want to continue.`,
    `Question ${questionNumber} complete! 🎯 Ready for the next one? Just hit the arrow when you are.`,
    `Question ${questionNumber} is in the books! Feel free to move on to question ${questionNumber + 1} whenever - just click that next arrow.`,
    `Awesome work on question ${questionNumber}! ${remaining} more to tackle. Click next when you're ready to continue.`,
    `That's question ${questionNumber} done! ✓ Take a moment if you need, then hit next for question ${questionNumber + 1}.`,
  ];
  
  // Use the total message count to pick a message (cycling through available messages)
  // This ensures variety even when multiple recordings are made for the same question
  const messageIndex = messageCount % messages.length;
  return messages[messageIndex];
};

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
    const activeConversation = selectActiveConversation(state);
    
    if (topicPractice.currentTopic && topicPractice.questions) {
      const currentIndex = topicPractice.currentQuestionIndex;
      const totalQuestions = topicPractice.questions.length;
      const isLastQuestion = currentIndex === totalQuestions - 1;
      const topicTitle = topicPractice.currentTopic.title;
      const topicPart = topicPractice.currentTopic.part || 'Part 1';
      
      // Find the latest voice message for the current question
      let latestVoiceMessage = null;
      let ieltsScore = null;
      
      if (activeConversation) {
        // Get all voice messages for the current question index
        const voiceMessagesForQuestion = activeConversation.messages.filter(
          msg => msg.sender === 'user' && 
                 msg.audioData && 
                 msg.questionIndex === currentIndex &&
                 msg.transcription?.text
        );
        
        // Get the latest one
        if (voiceMessagesForQuestion.length > 0) {
          latestVoiceMessage = voiceMessagesForQuestion[voiceMessagesForQuestion.length - 1];
          
          // Get IELTS score for the transcript
          if (latestVoiceMessage.transcription?.text) {
            try {
              // Get the current question text
              const currentQuestion = topicPractice.questions[currentIndex];
              const questionText = currentQuestion?.text || '';
              
              const scoreResult = await getIeltsScore(
                latestVoiceMessage.transcription.text,
                topicPart,
                questionText
              );
              
              if (scoreResult.success && scoreResult.score) {
                ieltsScore = scoreResult.score;
              }
            } catch (error) {
              console.error('Failed to get IELTS score:', error);
            }
          }
        }
      }
      
      // Show AI typing
      dispatch(setTyping(true));
      
      // Wait a bit to simulate AI thinking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create appropriate completion message
      let messageContent: string;
      if (isLastQuestion) {
        // Final question completed - congratulations message
        messageContent = `🎉 Congratulations! You have completed "${topicTitle}" - ${topicPart}. Great job practicing all ${totalQuestions} questions!`;
        
        // Add IELTS score if available
        if (ieltsScore) {
          const bandEmoji = ieltsScore.overallBand >= 7 ? '🌟' : ieltsScore.overallBand >= 6 ? '✨' : '💪';
          messageContent += `\n\n${bandEmoji} Your IELTS Band Score for the last response: ${ieltsScore.overallBand}`;
        }
        
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
          
          // Update the daily checklist for this part
          await dispatch(completeChecklistForPart(topicPart)).unwrap();
          
          // Set the flag to prevent duplicate updates
          dispatch(setTopicCompleted());
        }
      } else {
        // Not the last question - use conversational completion message
        // Count how many completion messages we've sent for variety
        const completionMessageCount = activeConversation ? 
          activeConversation.messages.filter(msg => 
            msg.sender === 'assistant' && 
            msg.content.includes('finished question')
          ).length : 0;
        
        messageContent = getCompletionMessage(currentIndex, totalQuestions, completionMessageCount);
        
        // Add IELTS score if available
        if (ieltsScore) {
          const bandEmoji = ieltsScore.overallBand >= 7 ? '🌟' : ieltsScore.overallBand >= 6 ? '✨' : '💪';
          messageContent = `${bandEmoji} Your IELTS Band Score: ${ieltsScore.overallBand}\n\n${messageContent}`;
        }
      }
      
      const completionMessage = {
        id: generateMessageId('completion'),
        content: messageContent,
        sender: 'assistant' as const,
        timestamp: new Date().toISOString(),
      };
      
      dispatch(addMessage({ conversationId, message: completionMessage }));
      
      // Send detailed IELTS feedback as a separate message if score is available
      if (ieltsScore) {
        // Wait a bit before sending the detailed feedback
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let feedbackContent = `**IELTS Speaking Assessment**\n\n`;
        feedbackContent += `**Overall Band Score: ${ieltsScore.overallBand}**\n\n`;
        
        feedbackContent += `**Breakdown:**\n`;
        feedbackContent += `• Fluency & Coherence: ${ieltsScore.fluencyCoherence.score}\n`;
        feedbackContent += `• Lexical Resource: ${ieltsScore.lexicalResource.score}\n`;
        feedbackContent += `• Grammar: ${ieltsScore.grammaticalRange.score}\n`;
        feedbackContent += `• Pronunciation: ${ieltsScore.pronunciation.score}\n\n`;
        
        feedbackContent += `**Summary:** ${ieltsScore.summary}\n\n`;
        
        if (ieltsScore.strengths && ieltsScore.strengths.length > 0) {
          feedbackContent += `**Strengths:**\n`;
          ieltsScore.strengths.forEach(strength => {
            feedbackContent += `• ${strength}\n`;
          });
          feedbackContent += '\n';
        }
        
        if (ieltsScore.improvements && ieltsScore.improvements.length > 0) {
          feedbackContent += `**Areas for Improvement:**\n`;
          ieltsScore.improvements.forEach(improvement => {
            feedbackContent += `• ${improvement}\n`;
          });
        }
        
        const feedbackMessage = {
          id: generateMessageId('ielts-feedback'),
          content: feedbackContent,
          sender: 'assistant' as const,
          timestamp: new Date().toISOString(),
        };
        
        dispatch(addMessage({ conversationId, message: feedbackMessage }));
      }
      
      dispatch(setTyping(false));
    }
  }
);