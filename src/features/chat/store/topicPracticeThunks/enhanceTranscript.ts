import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch } from '../../../../store/types';
import { addMessage, setTyping } from '../conversationSlice';
import { API_BASE_URL } from '../../../../config/api';
import type { EnhanceTranscriptResult } from './types';

// Enhanced transcript async thunk
export const enhanceTranscript = createAsyncThunk<
  EnhanceTranscriptResult,
  { conversationId: string; transcript: string },
  { dispatch: AppDispatch }
>(
  'topicPractice/enhanceTranscript',
  async ({ conversationId, transcript }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setTyping(true));
      
      const response = await fetch(`${API_BASE_URL}/enhancement/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript
        }),
      });

      if (!response.ok) {
        throw new Error(`Enhancement failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Enhancement failed');
      }

      // Create an AI message with the enhanced transcript
      const enhancedMessage = {
        id: `msg-${Date.now()}`,
        content: result.data.enhancedTranscript,
        sender: 'assistant' as const,
        timestamp: new Date().toISOString(),
        isEnhanced: true,
      };

      // Add message to conversation
      dispatch(addMessage({ conversationId, message: enhancedMessage }));

      dispatch(setTyping(false));

      return { conversationId, message: enhancedMessage };
    } catch (error) {
      dispatch(setTyping(false));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to enhance transcript');
    }
  }
);