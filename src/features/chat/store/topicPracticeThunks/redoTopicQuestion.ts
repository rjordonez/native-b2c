import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store/types';
import type { AppDispatch } from '../../../../store/types';
import { addMessage, setTyping } from '../conversationSlice';
import { setAutoPlayMessageId } from '../audioPlaybackSlice';
import { generateTTS } from './ttsService';
import type { TopicQuestionResult } from './types';

// Redo topic question async thunk
export const redoTopicQuestion = createAsyncThunk<
  TopicQuestionResult,
  {},
  { dispatch: AppDispatch; state: RootState }
>(
  'topicPractice/redoTopicQuestion',
  async ({}, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setTyping(true));
      const state = getState();
      const { currentTopic, currentQuestionIndex, questions } = state.topicPractice;
      const activeConversationId = state.conversation.activeConversationId;
      
      if (!currentTopic || !activeConversationId || !questions) {
        throw new Error('No active topic practice session');
      }
      
      // Get the current question
      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion) {
        throw new Error('No current question to redo');
      }
      
      // Get current TTS settings from state
      const ttsSpeed = state.audioPlayback.ttsSpeed;
      const ttsVoice = state.audioPlayback.ttsVoice;
      
      const ttsResult = await generateTTS({
        text: currentQuestion.text,
        voiceName: ttsVoice,
        speakingRate: ttsSpeed
      });
      
      if (!ttsResult.success) {
        throw new Error(ttsResult.message || 'TTS generation failed');
      }
      
      // Create a new question message (redo) - no content for voice-only messages
      const redoMessage = {
        id: `msg-${Date.now()}`,
        content: currentQuestion.text,  // Include question text for transcript display
        sender: 'assistant' as const,
        timestamp: new Date().toISOString(),
        isTopicQuestion: true,
        audioUrl: ttsResult.data?.audioUrl,
        audioData: ttsResult.data?.audioData,  // Include audioData for persistence
      };
      
      // Add message to conversation
      dispatch(addMessage({ conversationId: activeConversationId, message: redoMessage }));
      
      // Set autoplay
      dispatch(setAutoPlayMessageId(redoMessage.id));
      
      dispatch(setTyping(false));
      
      return {
        conversationId: activeConversationId,
        message: redoMessage,
        autoPlayMessageId: redoMessage.id
      };
    } catch (error) {
      dispatch(setTyping(false));
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to reload question. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('TTS')) {
          errorMessage = 'Audio generation failed. Please try again.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        }
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);