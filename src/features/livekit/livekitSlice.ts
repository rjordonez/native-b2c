import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IELTSScenario } from './types';

interface LiveKitState {
  isConnected: boolean;
  currentScenario: IELTSScenario | null;
  participantToken: string | null;
  roomName: string | null;
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LiveKitState = {
  isConnected: false,
  currentScenario: null,
  participantToken: null,
  roomName: null,
  serverUrl: null,
  isLoading: false,
  error: null,
};

const livekitSlice = createSlice({
  name: 'livekit',
  initialState,
  reducers: {
    setCurrentScenario: (state, action: PayloadAction<IELTSScenario>) => {
      state.currentScenario = action.payload;
      state.error = null;
    },
    
    setConnectionDetails: (state, action: PayloadAction<{
      participantToken: string;
      roomName: string;
      serverUrl: string;
    }>) => {
      state.participantToken = action.payload.participantToken;
      state.roomName = action.payload.roomName;
      state.serverUrl = action.payload.serverUrl;
      state.error = null;
    },
    
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearScenario: (state) => {
      state.currentScenario = null;
      state.participantToken = null;
      state.roomName = null;
      state.serverUrl = null;
      state.isConnected = false;
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCurrentScenario,
  setConnectionDetails,
  setConnected,
  setLoading,
  setError,
  clearScenario,
  clearError,
} = livekitSlice.actions;

// Selectors
export const selectCurrentScenario = (state: { livekit: LiveKitState }) => state.livekit.currentScenario;
export const selectConnectionDetails = (state: { livekit: LiveKitState }) => ({
  participantToken: state.livekit.participantToken,
  roomName: state.livekit.roomName,
  serverUrl: state.livekit.serverUrl,
});
export const selectIsConnected = (state: { livekit: LiveKitState }) => state.livekit.isConnected;
export const selectIsLoading = (state: { livekit: LiveKitState }) => state.livekit.isLoading;
export const selectError = (state: { livekit: LiveKitState }) => state.livekit.error;

export default livekitSlice.reducer;