import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/types';
import { DashboardState, Activity } from './types';

const initialState: DashboardState = {
  stats: {
    totalUsers: 1234,
    totalRevenue: 89500,
    activeProjects: 42,
  },
  recentActivity: [
    {
      id: '1',
      type: 'user',
      message: 'New user registered',
      timestamp: '2 minutes ago',
    },
    {
      id: '2',
      type: 'project',
      message: 'Project "Website Redesign" completed',
      timestamp: '1 hour ago',
    },
    {
      id: '3',
      type: 'revenue',
      message: 'Payment of $2,500 received',
      timestamp: '3 hours ago',
    },
  ],
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateStats: (state, action: PayloadAction<Partial<DashboardState['stats']>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.recentActivity.unshift(action.payload);
      if (state.recentActivity.length > 10) {
        state.recentActivity.pop();
      }
    },
  },
});

export const { updateStats, addActivity } = dashboardSlice.actions;

export const selectStats = (state: RootState) => state.dashboard.stats;
export const selectRecentActivity = (state: RootState) => state.dashboard.recentActivity;

export default dashboardSlice.reducer;