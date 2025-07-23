import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../types';

interface NavigationState {
  currentPage: string;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  userDropdownOpen: boolean;
}

const initialState: NavigationState = {
  currentPage: 'home',
  sidebarOpen: true,
  sidebarCollapsed: false,
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
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const { setCurrentPage, toggleSidebar, setSidebarOpen, setUserDropdownOpen, toggleUserDropdown, toggleSidebarCollapse, setSidebarCollapsed } = navigationSlice.actions;

export const selectCurrentPage = (state: RootState) => state.navigation.currentPage;
export const selectSidebarOpen = (state: RootState) => state.navigation.sidebarOpen;
export const selectSidebarCollapsed = (state: RootState) => state.navigation.sidebarCollapsed;
export const selectUserDropdownOpen = (state: RootState) => state.navigation.userDropdownOpen;

export default navigationSlice.reducer;