import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store/types';
import type { AppDispatch } from '../../../../store/types';
import { addMessage, setTyping, selectActiveConversation } from '../conversationSlice';
import { updateTopicProgressInDB } from '../../../library/libraryThunks';
import { setTopicCompleted } from '../topicPracticeSlice';
import { completeChecklistForPart } from '../../../../store/slices/dashboard/dashboardThunks';
import { generateMessageId } from '../../../../utils/idGenerator';
import { getTopicIeltsScore } from '../../services/ieltsService';
import { getGrammarFeedback } from '../../services/grammarService';
import { collectTopicResponses } from '../../utils/collectTopicResponses';

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
      let grammarMessages: string[] = [];
      
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
          
          // Get grammar and vocabulary feedback for the transcript
          if (latestVoiceMessage.transcription?.text) {
            try {
              // Get the current question text
              const currentQuestion = topicPractice.questions[currentIndex];
              const questionText = currentQuestion?.text || '';
              
              const feedbackResult = await getGrammarFeedback(
                latestVoiceMessage.transcription.text,
                questionText
              );
              
              if (feedbackResult.success && feedbackResult.messages) {
                grammarMessages = feedbackResult.messages;
              }
            } catch (error) {
              console.error('Failed to get grammar feedback:', error);
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
      let ieltsScore = null;
      
      if (isLastQuestion) {
        // Final question completed - congratulations message
        messageContent = `Excellent work! You have completed "${topicTitle}" - ${topicPart}. You've practiced all ${totalQuestions} questions successfully.`;
        
        // Collect ALL responses from the topic for comprehensive IELTS scoring
        if (activeConversation && topicPractice.questions) {
          const allResponses = collectTopicResponses(
            activeConversation.messages,
            topicPractice.questions
          );
          
          // Only score if we have responses for most questions
          console.log(`[IELTS] Collected ${allResponses.length} responses out of ${totalQuestions} questions`);
          
          if (allResponses.length >= Math.ceil(totalQuestions * 0.75)) {
            try {
              console.log('[IELTS] Sending responses for scoring...');
              const scoringResponses = allResponses.map(r => ({
                questionText: r.questionText,
                userResponse: r.userResponse
              }));
              
              const ieltsResult = await getTopicIeltsScore(
                scoringResponses,
                topicTitle,
                topicPart
              );
              
              console.log('[IELTS] Result:', ieltsResult);
              
              if (ieltsResult.success && ieltsResult.score) {
                ieltsScore = ieltsResult.score;
                console.log('[IELTS] Score received:', ieltsScore.overallBand);
              } else {
                console.error('[IELTS] No score in result:', ieltsResult);
              }
            } catch (error) {
              console.error('[IELTS] Failed to get comprehensive IELTS score:', error);
            }
          } else {
            console.log(`[IELTS] Not enough responses to score (need at least ${Math.ceil(totalQuestions * 0.75)})`);
          }
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
      }
      
      const completionMessage = {
        id: generateMessageId('completion'),
        content: messageContent,
        sender: 'assistant' as const,
        timestamp: new Date().toISOString(),
      };
      
      dispatch(addMessage({ conversationId, message: completionMessage }));
      
      // Send grammar feedback as separate conversational messages
      if (grammarMessages.length > 0) {
        // Filter out null/empty messages
        const validMessages = grammarMessages.filter(msg => msg && msg.trim());
        
        // Wait a bit between messages for natural feel
        for (let i = 0; i < validMessages.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000 + (i * 800)));
          
          const feedbackMessage = {
            id: generateMessageId(`feedback-${i}`),
            content: validMessages[i],
            sender: 'assistant' as const,
            timestamp: new Date().toISOString(),
          };
          
          dispatch(addMessage({ conversationId, message: feedbackMessage }));
        }
      }
      
      // Send comprehensive IELTS feedback ONLY at topic completion
      console.log('[IELTS] isLastQuestion:', isLastQuestion, 'ieltsScore:', !!ieltsScore);
      if (isLastQuestion && ieltsScore) {
        console.log('[IELTS] Preparing to send IELTS feedback message...');
        // Wait a bit before sending the detailed feedback
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let feedbackContent = `**IELTS Speaking Assessment**\n\n`;
        feedbackContent += `**Overall Band Score: ${ieltsScore.overallBand}**\n\n`;
        
        feedbackContent += `**Your Scores:**\n`;
        feedbackContent += `• Fluency & Coherence: ${ieltsScore.fluencyCoherence.score}\n`;
        feedbackContent += `• Lexical Resource: ${ieltsScore.lexicalResource.score}\n`;
        feedbackContent += `• Grammar: ${ieltsScore.grammaticalRange.score}\n`;
        feedbackContent += `• Pronunciation: ${ieltsScore.pronunciation.score}\n\n`;
        
        feedbackContent += `${ieltsScore.summary}\n\n`;
        
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
        
        feedbackContent += `\n—\n*Based on all ${totalQuestions} questions in this topic*`;
        
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