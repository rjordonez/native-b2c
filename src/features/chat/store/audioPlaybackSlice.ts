import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/types';

interface AudioPlaybackState {
  ttsSpeed: number;
  ttsVoice: string;
  autoPlayMessageId: string | null;
  currentlyPlayingMessageId: string | null;
}

const initialState: AudioPlaybackState = {
  ttsSpeed: 1.0,
  ttsVoice: 'en-US-Journey-F',
  autoPlayMessageId: null,
  currentlyPlayingMessageId: null,
};

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
  },
});

export const {
  setTtsSpeed,
  setTtsVoice,
  setAutoPlayMessageId,
  clearAutoPlayMessageId,
  setCurrentlyPlayingMessageId,
} = audioPlaybackSlice.actions;

// Selectors
export const selectTtsSpeed = (state: RootState) => state.audioPlayback.ttsSpeed;
export const selectTtsVoice = (state: RootState) => state.audioPlayback.ttsVoice;
export const selectAutoPlayMessageId = (state: RootState) => state.audioPlayback.autoPlayMessageId;
export const selectCurrentlyPlayingMessageId = (state: RootState) => state.audioPlayback.currentlyPlayingMessageId;

export default audioPlaybackSlice.reducer;