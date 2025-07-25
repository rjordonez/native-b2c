import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../types';

interface SaveStatusState {
  isSaving: boolean;
  lastSaved: number | null; // timestamp
  error: string | null;
  pendingOperations: number;
}

const initialState: SaveStatusState = {
  isSaving: false,
  lastSaved: null,
  error: null,
  pendingOperations: 0,
};

export const saveStatusSlice = createSlice({
  name: 'saveStatus',
  initialState,
  reducers: {
    startSaving: (state) => {
      state.isSaving = true;
      state.error = null;
      state.pendingOperations += 1;
    },
    completeSaving: (state) => {
      state.pendingOperations = Math.max(0, state.pendingOperations - 1);
      if (state.pendingOperations === 0) {
        state.isSaving = false;
        state.lastSaved = Date.now();
      }
    },
    failSaving: (state, action: PayloadAction<string>) => {
      state.pendingOperations = Math.max(0, state.pendingOperations - 1);
      state.isSaving = state.pendingOperations > 0;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { startSaving, completeSaving, failSaving, clearError } = saveStatusSlice.actions;

// Selectors
export const selectSaveStatus = (state: RootState) => state.saveStatus;
export const selectIsSaving = (state: RootState) => state.saveStatus.isSaving;
export const selectLastSaved = (state: RootState) => state.saveStatus.lastSaved;
export const selectSaveError = (state: RootState) => state.saveStatus.error;

export default saveStatusSlice.reducer;