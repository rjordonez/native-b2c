import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/types';
import type { AppDispatch } from '../../../store/types';
import { VoiceRecording } from '../types';
import { transcriptionApi } from '../../../services/transcriptionApi';
import { updateMessage } from './conversationSlice';
import { ErrorMessages } from '../../../utils/error';

interface TranscriptionData {
  text: string;
  confidence?: number;
  transcriptId?: string;
  isLoading: boolean;
  error?: string;
}

interface PronunciationData {
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
  { messageId: string; audioData: string; contentType?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  'voiceRecording/transcribeWithPronunciation',
  async ({ messageId, audioData, contentType }, { getState, dispatch, rejectWithValue }) => {
    try {
      
      const result = await transcriptionApi.transcribeWithPronunciation(
        audioData,
        contentType || 'audio/wav',
        {
          speechModel: 'universal',
          punctuate: true,
          formatText: true
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

interface VoiceRecordingState {
  voiceRecording: VoiceRecording;
}

const initialState: VoiceRecordingState = {
  voiceRecording: {
    isRecording: false,
    isPaused: false,
    audioUrl: null,
    audioData: null,
    recordingDuration: 0,
    recordingState: 'idle',
    isPressed: false,
    mimeType: null,
  },
};

export const voiceRecordingSlice = createSlice({
  name: 'voiceRecording',
  initialState,
  reducers: {
    startRecording: (state) => {
      state.voiceRecording.isRecording = true;
      state.voiceRecording.recordingState = 'recording';
      state.voiceRecording.recordingDuration = 0;
    },
    stopRecording: (state, action: PayloadAction<{ audioUrl: string; audioData: string; duration: number; mimeType: string }>) => {
      state.voiceRecording.isRecording = false;
      state.voiceRecording.recordingState = 'recorded';
      state.voiceRecording.audioUrl = action.payload.audioUrl;
      state.voiceRecording.audioData = action.payload.audioData;
      state.voiceRecording.recordingDuration = action.payload.duration;
      state.voiceRecording.mimeType = action.payload.mimeType;
    },
    playRecording: (state) => {
      state.voiceRecording.recordingState = 'playing';
    },
    pauseRecording: (state) => {
      state.voiceRecording.recordingState = 'recorded';
    },
    clearRecording: (state) => {
      state.voiceRecording = {
        isRecording: false,
        isPaused: false,
        audioUrl: null,
        audioData: null,
        recordingDuration: 0,
        recordingState: 'idle',
        isPressed: false,
        mimeType: null,
      };
    },
    updateRecordingDuration: (state, action: PayloadAction<number>) => {
      state.voiceRecording.recordingDuration = action.payload;
    },
    setIsPressed: (state, action: PayloadAction<boolean>) => {
      state.voiceRecording.isPressed = action.payload;
    },
    startTranscription: (state, action: PayloadAction<{ messageId: string }>) => {
      // This is now handled by updating the message directly in conversation slice
      // Kept for compatibility but functionality moved to transcribeAudio thunk
    },
  },
  extraReducers: (builder) => {
    builder
      // Transcription
      .addCase(transcribeAudio.pending, (state) => {
        // Loading state handled by message update
      })
      .addCase(transcribeAudio.fulfilled, (state, action) => {
        // Success handled by message update
      })
      .addCase(transcribeAudio.rejected, (state, action) => {
        // Error handled by message update
      })
      // Combined transcription + pronunciation
      .addCase(transcribeWithPronunciation.pending, (state) => {
        // Loading state handled by message update
      })
      .addCase(transcribeWithPronunciation.fulfilled, (state, action) => {
        // Success handled by message update
      })
      .addCase(transcribeWithPronunciation.rejected, (state, action) => {
        // Error handled by message update
      });
  },
});

export const {
  startRecording,
  stopRecording,
  playRecording,
  pauseRecording,
  clearRecording,
  updateRecordingDuration,
  setIsPressed,
  startTranscription,
} = voiceRecordingSlice.actions;

// Selectors
export const selectVoiceRecording = (state: RootState) => state.voiceRecording.voiceRecording;
export const selectIsRecording = (state: RootState) => state.voiceRecording.voiceRecording.isRecording;
export const selectRecordingState = (state: RootState) => state.voiceRecording.voiceRecording.recordingState;
export const selectAudioUrl = (state: RootState) => state.voiceRecording.voiceRecording.audioUrl;
export const selectAudioData = (state: RootState) => state.voiceRecording.voiceRecording.audioData;
export const selectRecordingDuration = (state: RootState) => state.voiceRecording.voiceRecording.recordingDuration;
export const selectIsPressed = (state: RootState) => state.voiceRecording.voiceRecording.isPressed;
export const selectMimeType = (state: RootState) => state.voiceRecording.voiceRecording.mimeType;

export default voiceRecordingSlice.reducer;