import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/types';
import { HomeState, Task } from './types';
import { DASHBOARD_CONFIG, PRACTICE_ACTIVITY_DATES } from './constants/dashboardData';

const initialState: HomeState = {
  welcomeMessage: 'Welcome to the Home Page!',
  visitCount: 0,
  testDate: DASHBOARD_CONFIG.testDate.toISOString(),
  practiceActivityDates: PRACTICE_ACTIVITY_DATES.map(date => date.toISOString()),
  tasks: [
    { id: 1, text: 'Complete Reading Practice Test', completed: true },
    { id: 2, text: 'Review vocabulary flashcards', completed: false },
    { id: 3, text: 'Practice speaking with partner', completed: false },
  ],
  speakingPractices: [
    { type: 'Part 1: Introduction', time: '5 min', difficulty: 'Easy' },
    { type: 'Part 2: Cue Card', time: '5 min', difficulty: 'Easy' },
    { type: 'Part 3: Discussion', time: '0 min', difficulty: 'Easy' },
  ],
  speakingTests: [
    { type: 'Full Mock Test', time: '15 min', difficulty: 'Hard' },
    { type: 'Part 1 Only', time: '5 min', difficulty: 'Easy' },
    { type: 'Part 2 Only', time: '4 min', difficulty: 'Medium' },
  ],
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
    toggleTask: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    addPracticeActivity: (state, action: PayloadAction<string>) => {
      state.practiceActivityDates.push(action.payload);
    },
    setTestDate: (state, action: PayloadAction<string>) => {
      state.testDate = action.payload;
    },
  },
});

export const { 
  incrementVisitCount, 
  setWelcomeMessage, 
  toggleTask, 
  addPracticeActivity, 
  setTestDate 
} = homeSlice.actions;

// Selectors
export const selectWelcomeMessage = (state: RootState) => state.home.welcomeMessage;
export const selectVisitCount = (state: RootState) => state.home.visitCount;
export const selectTestDate = (state: RootState) => new Date(state.home.testDate);
export const selectPracticeActivityDates = (state: RootState) => 
  state.home.practiceActivityDates.map(date => new Date(date));
export const selectTasks = (state: RootState) => state.home.tasks;
export const selectCompletedTasksCount = (state: RootState) => 
  state.home.tasks.filter(task => task.completed).length;
export const selectSpeakingPractices = (state: RootState) => state.home.speakingPractices;
export const selectSpeakingTests = (state: RootState) => state.home.speakingTests;
export const selectPracticeFrequency = (state: RootState) => 
  state.home.practiceActivityDates.length;

export default homeSlice.reducer;