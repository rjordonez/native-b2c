import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store/types';
import { HomeState, Task } from './dashboardTypes';
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
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
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
} = dashboardSlice.actions;

// Selectors
export const selectWelcomeMessage = (state: RootState) => state.dashboard.welcomeMessage;
export const selectVisitCount = (state: RootState) => state.dashboard.visitCount;
export const selectTestDateString = (state: RootState) => state.dashboard.testDate;
export const selectPracticeActivityDateStrings = (state: RootState) => state.dashboard.practiceActivityDates;
export const selectTasks = (state: RootState) => state.dashboard.tasks;

// Memoized selectors for date objects
export const selectTestDate = createSelector(
  [selectTestDateString],
  (dateString) => new Date(dateString)
);

export const selectPracticeActivityDates = createSelector(
  [selectPracticeActivityDateStrings],
  (dateStrings) => dateStrings.map(date => new Date(date))
);

export const selectCompletedTasksCount = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(task => task.completed).length
);

export default dashboardSlice.reducer;