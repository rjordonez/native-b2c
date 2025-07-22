import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../types';

interface NavigationState {
  currentPage: string;
  sidebarOpen: boolean;
  userDropdownOpen: boolean;
}

const initialState: NavigationState = {
  currentPage: 'home',
  sidebarOpen: true,
  userDropdownOpen: false,
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
    setUserDropdownOpen: (state, action: PayloadAction<boolean>) => {
      state.userDropdownOpen = action.payload;
    },
    toggleUserDropdown: (state) => {
      state.userDropdownOpen = !state.userDropdownOpen;
    },
  },
});

export const { setCurrentPage, toggleSidebar, setSidebarOpen, setUserDropdownOpen, toggleUserDropdown } = navigationSlice.actions;

export const selectCurrentPage = (state: RootState) => state.navigation.currentPage;
export const selectSidebarOpen = (state: RootState) => state.navigation.sidebarOpen;
export const selectUserDropdownOpen = (state: RootState) => state.navigation.userDropdownOpen;

export default navigationSlice.reducer;