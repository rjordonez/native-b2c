import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../types';

interface SidebarUIState {
  chatSessions: {
    displayedSessions: number;
    isLoadingMore: boolean;
    menuOpenId: string | null;
    menuPosition: { top: number; left: number } | null;
    hoveredId: string | null;
    editingId: string | null;
    editValue: string;
  };
}

const initialState: SidebarUIState = {
  chatSessions: {
    displayedSessions: 14, // SESSIONS_PER_PAGE
    isLoadingMore: false,
    menuOpenId: null,
    menuPosition: null,
    hoveredId: null,
    editingId: null,
    editValue: ''
  }
};

const sidebarUISlice = createSlice({
  name: 'sidebarUI',
  initialState,
  reducers: {
    setDisplayedSessions: (state, action: PayloadAction<number>) => {
      state.chatSessions.displayedSessions = action.payload;
    },
    setIsLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.chatSessions.isLoadingMore = action.payload;
    },
    setMenuOpenId: (state, action: PayloadAction<string | null>) => {
      state.chatSessions.menuOpenId = action.payload;
    },
    setMenuPosition: (state, action: PayloadAction<{ top: number; left: number } | null>) => {
      state.chatSessions.menuPosition = action.payload;
    },
    setHoveredId: (state, action: PayloadAction<string | null>) => {
      state.chatSessions.hoveredId = action.payload;
    },
    setEditingId: (state, action: PayloadAction<string | null>) => {
      state.chatSessions.editingId = action.payload;
    },
    setEditValue: (state, action: PayloadAction<string>) => {
      state.chatSessions.editValue = action.payload;
    },
    resetChatSessionsUI: (state) => {
      state.chatSessions = initialState.chatSessions;
    },
    incrementDisplayedSessions: (state, action: PayloadAction<number>) => {
      state.chatSessions.displayedSessions += action.payload;
    }
  }
});

// Actions
export const {
  setDisplayedSessions,
  setIsLoadingMore,
  setMenuOpenId,
  setMenuPosition,
  setHoveredId,
  setEditingId,
  setEditValue,
  resetChatSessionsUI,
  incrementDisplayedSessions
} = sidebarUISlice.actions;

// Selectors
export const selectChatSessionsUI = (state: RootState) => state.sidebarUI.chatSessions;
export const selectDisplayedSessions = (state: RootState) => state.sidebarUI.chatSessions.displayedSessions;
export const selectIsLoadingMore = (state: RootState) => state.sidebarUI.chatSessions.isLoadingMore;
export const selectMenuOpenId = (state: RootState) => state.sidebarUI.chatSessions.menuOpenId;
export const selectMenuPosition = (state: RootState) => state.sidebarUI.chatSessions.menuPosition;
export const selectHoveredId = (state: RootState) => state.sidebarUI.chatSessions.hoveredId;
export const selectEditingId = (state: RootState) => state.sidebarUI.chatSessions.editingId;
export const selectEditValue = (state: RootState) => state.sidebarUI.chatSessions.editValue;

export default sidebarUISlice.reducer;