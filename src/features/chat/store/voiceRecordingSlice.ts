import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/types';
import { VoiceRecordingState } from '../types';
import { transcribeAudio, transcribeWithPronunciation } from './voiceRecordingThunks';

interface VoiceRecordingSliceState {
  voiceRecording: VoiceRecordingState;
}

const initialState: VoiceRecordingSliceState = {
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

// Re-export thunks for convenience
export { transcribeAudio, transcribeWithPronunciation } from './voiceRecordingThunks';

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