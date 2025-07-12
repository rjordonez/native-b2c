import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../types';

interface NavigationState {
  currentPage: string;
  sidebarOpen: boolean;
}

const initialState: NavigationState = {
  currentPage: 'home',
  sidebarOpen: true,
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setCurrentPage, toggleSidebar, setSidebarOpen } = navigationSlice.actions;

export const selectCurrentPage = (state: RootState) => state.navigation.currentPage;
export const selectSidebarOpen = (state: RootState) => state.navigation.sidebarOpen;

export default navigationSlice.reducer;