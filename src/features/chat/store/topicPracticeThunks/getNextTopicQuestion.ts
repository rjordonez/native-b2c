import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store/types';
import type { AppDispatch } from '../../../../store/types';
import { addMessage, setLoading, setTyping, updateConversationMetadata } from '../conversationSlice';
import { setAutoPlayMessageId } from '../audioPlaybackSlice';
import { generateTTS } from './ttsService';
import type { NextQuestionResult } from './types';

// Next topic question async thunk
export const getNextTopicQuestion = createAsyncThunk<
  NextQuestionResult,
  {},
  { dispatch: AppDispatch; state: RootState }
>(
  'topicPractice/getNextTopicQuestion',
  async ({}, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setTyping(true));
      const state = getState();
      const { currentQuestionIndex, questions } = state.topicPractice;
      const activeConversationId = state.conversation.activeConversationId;
      
      if (!activeConversationId) {
        throw new Error('No active conversation');
      }
      
      const nextIndex = currentQuestionIndex + 1;
      
      if (!questions || nextIndex >= questions.length) {
        // No more questions - send text message
        const endMessage = {
          id: `msg-${Date.now()}`,
          content: 'There are no more questions.',
          sender: 'assistant' as const,
          timestamp: new Date().toISOString(),
        };
        
        dispatch(addMessage({ conversationId: activeConversationId, message: endMessage }));
        
        dispatch(setLoading(false));
        dispatch(setTyping(false));
        
        return {
          conversationId: activeConversationId,
          message: endMessage,
          isEnd: true
        };
      }
      
      const nextQuestion = questions[nextIndex];
      
      // Get current TTS settings from state
      const ttsSpeed = state.audioPlayback.ttsSpeed;
      const ttsVoice = state.audioPlayback.ttsVoice;
      
      const ttsResult = await generateTTS({
        text: nextQuestion.text,
        voiceName: ttsVoice,
        speakingRate: ttsSpeed
      });
      
      if (!ttsResult.success) {
        throw new Error(ttsResult.message || 'TTS generation failed');
      }

      // Create the question message
      const questionMessage = {
        id: `msg-${Date.now()}`,
        content: nextQuestion.text,
        sender: 'assistant' as const,
        timestamp: new Date().toISOString(),
        isTopicQuestion: true,
        audioUrl: ttsResult.data?.audioUrl,
      };

      // Add message to conversation
      dispatch(addMessage({ conversationId: activeConversationId, message: questionMessage }));
      
      // Update conversation metadata with new question index
      const activeConversation = state.conversation.conversations.find(c => c.id === activeConversationId);
      if (activeConversation?.topicPracticeMetadata) {
        dispatch(updateConversationMetadata({
          conversationId: activeConversationId,
          metadata: {
            ...activeConversation.topicPracticeMetadata,
            currentQuestionIndex: nextIndex,
          }
        }));
      }
      
      // Set autoplay
      dispatch(setAutoPlayMessageId(questionMessage.id));

      dispatch(setLoading(false));
      dispatch(setTyping(false));

      return {
        conversationId: activeConversationId,
        message: questionMessage,
        questionIndex: nextIndex,
        isEnd: false,
        autoPlayMessageId: questionMessage.id
      };
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setTyping(false));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get next question');
    }
  }
);