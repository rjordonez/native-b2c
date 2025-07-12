import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/types';
import { AboutState } from './types';

const initialState: AboutState = {
  title: 'About Our App',
  description: 'This is a modern React application built with Redux Toolkit and TypeScript.',
  features: [
    'Redux Toolkit for state management',
    'TypeScript for type safety',
    'React Router for navigation',
    'Responsive design with Tailwind CSS',
    'Feature-based folder structure',
  ],
};

export const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    addFeature: (state, action: PayloadAction<string>) => {
      state.features.push(action.payload);
    },
  },
});

export const { setTitle, setDescription, addFeature } = aboutSlice.actions;

export const selectTitle = (state: RootState) => state.about.title;
export const selectDescription = (state: RootState) => state.about.description;
export const selectFeatures = (state: RootState) => state.about.features;

export default aboutSlice.reducer;