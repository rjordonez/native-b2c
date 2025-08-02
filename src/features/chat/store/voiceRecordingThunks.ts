import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/types';
import type { AppDispatch } from '../../../store/types';
import { transcriptionApi } from '../services';
import { updateMessage } from './conversationSlice';
import { handleTopicPracticeCompletion } from './topicPracticeThunks';
import { ErrorMessages } from '../../../utils/error';

export interface TranscriptionData {
  text: string;
  confidence?: number;
  transcriptId?: string;
  isLoading: boolean;
  error?: string;
}

export interface PronunciationData {
  words: Array<{
    text: string;
    score?: number;
    phonemes?: Array<{
      phoneme: string;
      score: number;
    }>;
  }>;
  overallScore: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  isLoading: boolean;
  error?: string;
}

// Transcription async thunk
export const transcribeAudio = createAsyncThunk<
  { messageId: string; transcription: TranscriptionData },
  { messageId: string; audioData: string; contentType?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  'voiceRecording/transcribeAudio',
  async ({ messageId, audioData, contentType }, { getState, dispatch, rejectWithValue }) => {
    try {
      
      const result = await transcriptionApi.transcribeBase64Audio(
        audioData,
        contentType || 'audio/wav',
        {
          speechModel: 'universal',
          punctuate: true,
          formatText: true
        }
      );
      
      const transcription = {
        text: result.text,
        confidence: result.confidence,
        transcriptId: result.id,
        isLoading: false,
        error: undefined
      };
      
      // Update message in conversation slice
      const state = getState();
      const conversationId = state.conversation.activeConversationId;
      
      if (conversationId) {
        dispatch(updateMessage({
          conversationId,
          messageId,
          updates: { transcription }
        }));
      }
      
      return { messageId, transcription };
    } catch (error) {
      return rejectWithValue({
        messageId,
        error: error instanceof Error ? error.message : ErrorMessages.TRANSCRIPTION_FAILED
      });
    }
  }
);

export const transcribeWithPronunciation = createAsyncThunk<
  { messageId: string; transcription: TranscriptionData; pronunciation: PronunciationData },
  { messageId: string; audioData: string; contentType?: string; referenceText?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  'voiceRecording/transcribeWithPronunciation',
  async ({ messageId, audioData, contentType, referenceText }, { getState, dispatch, rejectWithValue }) => {
    try {
      
      const result = await transcriptionApi.transcribeWithPronunciation(
        audioData,
        contentType || 'audio/wav',
        {
          speechModel: 'universal',
          punctuate: true,
          formatText: true,
          referenceText: referenceText
        }
      );
      
      const transcription = {
        text: result.transcription.text,
        confidence: result.transcription.confidence,
        transcriptId: result.transcription.id,
        isLoading: false,
        error: undefined
      };
      
      const pronunciation = {
        ...result.pronunciation,
        isLoading: false
      };
      
      // Update message in conversation slice
      const state = getState();
      const conversationId = state.conversation.activeConversationId;
      
      if (conversationId) {
        dispatch(updateMessage({
          conversationId,
          messageId,
          updates: { transcription, pronunciation }
        }));
        
        // Check if this is during topic practice to send completion message
        const topicPractice = state.topicPractice;
        if (topicPractice.currentTopic && topicPractice.questions) {
          // Dispatch the completion handler
          dispatch(handleTopicPracticeCompletion({ conversationId }));
        }
      }
      
      return { messageId, transcription, pronunciation };
    } catch (error) {
      const errorMessage = error instanceof Error && error.message.includes('pronunciation') 
        ? ErrorMessages.PRONUNCIATION_FAILED 
        : ErrorMessages.TRANSCRIPTION_FAILED;
      return rejectWithValue({
        messageId,
        error: error instanceof Error ? error.message : errorMessage
      });
    }
  }
);