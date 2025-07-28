import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../types';
import { HomeState, Task } from './types';
import { DASHBOARD_CONFIG, PRACTICE_ACTIVITY_DATES } from './constants/dashboardData';
import { fetchTodayChecklist, completeChecklistTask, completeChecklistForPart, fetchPracticeActivity } from './dashboardThunks';

const initialState: HomeState = {
  welcomeMessage: 'Welcome to the Home Page!',
  visitCount: 0,
  testDate: DASHBOARD_CONFIG.testDate.toISOString(),
  practiceActivityDates: PRACTICE_ACTIVITY_DATES.map(date => date.toISOString()),
  tasks: [
    { id: 1, text: 'Practice Part 1', completed: false },
    { id: 2, text: 'Practice Part 2', completed: false },
    { id: 3, text: 'Practice Part 3', completed: false },
  ],
  practiceActivities: [],
  practiceStreak: null,
  isLoadingActivities: false,
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
      })
      // Handle fetchPracticeActivity
      .addCase(fetchPracticeActivity.pending, (state) => {
        state.isLoadingActivities = true;
      })
      .addCase(fetchPracticeActivity.fulfilled, (state, action) => {
        state.isLoadingActivities = false;
        state.practiceActivities = action.payload.activities;
        state.practiceStreak = action.payload.streak;
      })
      .addCase(fetchPracticeActivity.rejected, (state) => {
        state.isLoadingActivities = false;
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

// New practice activity selectors
export const selectPracticeActivities = (state: RootState) => state.dashboard.practiceActivities;
export const selectPracticeStreak = (state: RootState) => state.dashboard.practiceStreak;
export const selectIsLoadingActivities = (state: RootState) => state.dashboard.isLoadingActivities;

// Memoized selector for practice dates in Date format
export const selectPracticeActivityDatesFromDB = createSelector(
  [selectPracticeActivities],
  (activities) => activities
    .filter(activity => activity.tasksCompleted > 0)
    .map(activity => new Date(activity.date))
);

export default dashboardSlice.reducer;