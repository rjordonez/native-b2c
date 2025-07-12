import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/types';
import { HomeState } from './types';

const initialState: HomeState = {
  welcomeMessage: 'Welcome to the Home Page!',
  visitCount: 0,
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    incrementVisitCount: (state) => {
      state.visitCount += 1;
    },
    setWelcomeMessage: (state, action: PayloadAction<string>) => {
      state.welcomeMessage = action.payload;
    },
  },
});

export const { incrementVisitCount, setWelcomeMessage } = homeSlice.actions;

export const selectWelcomeMessage = (state: RootState) => state.home.welcomeMessage;
export const selectVisitCount = (state: RootState) => state.home.visitCount;

export default homeSlice.reducer;