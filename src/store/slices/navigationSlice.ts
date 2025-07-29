import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../types';

interface NavigationState {
  currentPage: string;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  userDropdownOpen: boolean;
  hoveredItem: string | null;
  tooltipPosition: { top: number; left: number } | null;
  mobileMenuOpen: boolean;
}

const initialState: NavigationState = {
  currentPage: 'home',
  sidebarOpen: true,
  sidebarCollapsed: false,
  userDropdownOpen: false,
  hoveredItem: null,
  tooltipPosition: null,
  mobileMenuOpen: false,
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
    setHoveredItem: (state, action: PayloadAction<string | null>) => {
      state.hoveredItem = action.payload;
    },
    setTooltipPosition: (state, action: PayloadAction<{ top: number; left: number } | null>) => {
      state.tooltipPosition = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const { 
  setCurrentPage, 
  toggleSidebar, 
  setSidebarOpen, 
  setUserDropdownOpen, 
  toggleUserDropdown, 
  toggleSidebarCollapse, 
  setSidebarCollapsed,
  setHoveredItem,
  setTooltipPosition,
  toggleMobileMenu,
  setMobileMenuOpen
} = navigationSlice.actions;

export const selectCurrentPage = (state: RootState) => state.navigation.currentPage;
export const selectSidebarOpen = (state: RootState) => state.navigation.sidebarOpen;
export const selectSidebarCollapsed = (state: RootState) => state.navigation.sidebarCollapsed;
export const selectUserDropdownOpen = (state: RootState) => state.navigation.userDropdownOpen;
export const selectHoveredItem = (state: RootState) => state.navigation.hoveredItem;
export const selectTooltipPosition = (state: RootState) => state.navigation.tooltipPosition;
export const selectMobileMenuOpen = (state: RootState) => state.navigation.mobileMenuOpen;

export default navigationSlice.reducer;