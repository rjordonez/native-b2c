import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/types';
import type { AppDispatch } from '../../../store/types';

interface AudioPlaybackState {
  ttsSpeed: number;
  ttsVoice: string;
  autoPlayMessageId: string | null;
  currentlyPlayingMessageId: string | null;
  // TTS Preview states
  previewSpeed: number;
  previewVoice: string;
  isGeneratingPreview: boolean;
  previewAudioUrl: string | null;
}

const initialState: AudioPlaybackState = {
  ttsSpeed: 1.0,
  ttsVoice: 'en-US-Journey-F',
  autoPlayMessageId: null,
  currentlyPlayingMessageId: null,
  // TTS Preview states
  previewSpeed: 1.0,
  previewVoice: 'en-US-Journey-F',
  isGeneratingPreview: false,
  previewAudioUrl: null,
};

// Async thunk for generating TTS preview
export const generateTtsPreview = createAsyncThunk<
  { audioUrl: string },
  { text: string },
  { dispatch: AppDispatch; state: RootState }
>(
  'audioPlayback/generateTtsPreview',
  async ({ text }, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsGeneratingPreview(true));
      dispatch(clearPreview());
      
      const state = getState();
      const previewSpeed = state.audioPlayback.previewSpeed;
      const previewVoice = state.audioPlayback.previewVoice;
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceName: previewVoice,
          speakingRate: previewSpeed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const result = await response.json();
      
      if (!result.success || !result.data?.audioUrl) {
        throw new Error(result.message || 'No audio URL in response');
      }

      dispatch(setPreviewAudioUrl(result.data.audioUrl));
      dispatch(setIsGeneratingPreview(false));
      
      return { audioUrl: result.data.audioUrl };
    } catch (error) {
      dispatch(setIsGeneratingPreview(false));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to generate preview');
    }
  }
);

export const audioPlaybackSlice = createSlice({
  name: 'audioPlayback',
  initialState,
  reducers: {
    setTtsSpeed: (state, action: PayloadAction<number>) => {
      state.ttsSpeed = action.payload;
    },
    setTtsVoice: (state, action: PayloadAction<string>) => {
      state.ttsVoice = action.payload;
    },
    setAutoPlayMessageId: (state, action: PayloadAction<string | null>) => {
      state.autoPlayMessageId = action.payload;
    },
    clearAutoPlayMessageId: (state) => {
      state.autoPlayMessageId = null;
    },
    setCurrentlyPlayingMessageId: (state, action: PayloadAction<string | null>) => {
      state.currentlyPlayingMessageId = action.payload;
    },
    // TTS Preview actions
    setPreviewSpeed: (state, action: PayloadAction<number>) => {
      state.previewSpeed = action.payload;
    },
    setPreviewVoice: (state, action: PayloadAction<string>) => {
      state.previewVoice = action.payload;
    },
    setIsGeneratingPreview: (state, action: PayloadAction<boolean>) => {
      state.isGeneratingPreview = action.payload;
    },
    setPreviewAudioUrl: (state, action: PayloadAction<string | null>) => {
      state.previewAudioUrl = action.payload;
    },
    initializePreviewSettings: (state) => {
      state.previewSpeed = state.ttsSpeed;
      state.previewVoice = state.ttsVoice;
    },
    applyPreviewSettings: (state) => {
      state.ttsSpeed = state.previewSpeed;
      state.ttsVoice = state.previewVoice;
    },
    clearPreview: (state) => {
      state.previewAudioUrl = null;
      state.isGeneratingPreview = false;
    },
  },
});

export const {
  setTtsSpeed,
  setTtsVoice,
  setAutoPlayMessageId,
  clearAutoPlayMessageId,
  setCurrentlyPlayingMessageId,
  setPreviewSpeed,
  setPreviewVoice,
  setIsGeneratingPreview,
  setPreviewAudioUrl,
  initializePreviewSettings,
  applyPreviewSettings,
  clearPreview,
} = audioPlaybackSlice.actions;

// Selectors
export const selectTtsSpeed = (state: RootState) => state.audioPlayback.ttsSpeed;
export const selectTtsVoice = (state: RootState) => state.audioPlayback.ttsVoice;
export const selectAutoPlayMessageId = (state: RootState) => state.audioPlayback.autoPlayMessageId;
export const selectCurrentlyPlayingMessageId = (state: RootState) => state.audioPlayback.currentlyPlayingMessageId;
// TTS Preview selectors
export const selectPreviewSpeed = (state: RootState) => state.audioPlayback.previewSpeed;
export const selectPreviewVoice = (state: RootState) => state.audioPlayback.previewVoice;
export const selectIsGeneratingPreview = (state: RootState) => state.audioPlayback.isGeneratingPreview;
export const selectPreviewAudioUrl = (state: RootState) => state.audioPlayback.previewAudioUrl;

export default audioPlaybackSlice.reducer;