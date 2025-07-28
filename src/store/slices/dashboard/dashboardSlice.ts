import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../types';
import { HomeState, Task } from './types';
import { DASHBOARD_CONFIG, PRACTICE_ACTIVITY_DATES } from './constants/dashboardData';
import { fetchTodayChecklist, completeChecklistTask, completeChecklistForPart } from './dashboardThunks';

const initialState: HomeState = {
  welcomeMessage: 'Welcome to the Home Page!',
  visitCount: 0,
  testDate: DASHBOARD_CONFIG.testDate.toISOString(),
  practiceActivityDates: PRACTICE_ACTIVITY_DATES.map(date => date.toISOString()),
  tasks: [
    { id: 1, text: 'Practice Part 1', completed: true },
    { id: 2, text: 'Practice Part 2', completed: false },
    { id: 3, text: 'Practice Part 3', completed: false },
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
  extraReducers: (builder) => {
    builder
      // Handle fetchTodayChecklist
      .addCase(fetchTodayChecklist.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      // Handle completeChecklistTask
      .addCase(completeChecklistTask.fulfilled, (state, action) => {
        if (action.payload.success) {
          const task = state.tasks.find(t => t.id === action.payload.taskId);
          if (task) {
            task.completed = true;
          }
        }
      })
      // Handle completeChecklistForPart
      .addCase(completeChecklistForPart.fulfilled, (state, action) => {
        if (action.payload && action.payload.success) {
          const task = state.tasks.find(t => t.id === action.payload.taskId);
          if (task) {
            task.completed = true;
          }
        }
      });
  }
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