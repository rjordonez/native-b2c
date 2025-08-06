import { createAsyncThunk } from '@reduxjs/toolkit';
import { devDashService } from './services/devDashService';
import { UserAnalytics, DatabaseMetrics, SystemStats, UserDetail, PracticeSessionData, TopicData, CompleteUserData } from './types';
import { TrafficData, TimePeriod } from './types';
import { createAvatarScope } from '@radix-ui/react-avatar';

// Async thunks
export const fetchUserAnalytics = createAsyncThunk(
  'devDash/fetchUserAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const [totalUsers, newUsersToday, newUsersThisWeek, newUsersThisMonth] = await Promise.all([
        devDashService.getTotalUsers(),
        devDashService.getUsersCreatedToday(),
        devDashService.getUsersCreatedThisWeek(),
        devDashService.getUsersCreatedThisMonth(),
      ]);

      // Calculate growth rate (week over week)
      const prevWeekUsers = totalUsers - newUsersThisWeek;
      const growthRate = prevWeekUsers > 0 ? ((newUsersThisWeek / prevWeekUsers) * 100) : 0;

      const userAnalytics: UserAnalytics = {
        totalUsers,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        growthRate: Math.round(growthRate * 100) / 100,
      };

      return userAnalytics;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user analytics');
    }
  }
);

export const fetchDatabaseMetrics = createAsyncThunk(
  'devDash/fetchDatabaseMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const metrics = await devDashService.getDatabaseMetrics();
      return metrics as DatabaseMetrics;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch database metrics');
    }
  }
);

export const fetchSystemStats = createAsyncThunk(
  'devDash/fetchSystemStats',
  async (_, { rejectWithValue }) => {
    try {
      // Mock system stats for now - can be replaced with real monitoring data
      const systemStats: SystemStats = {
        uptime: '99.9%',
        responseTime: Math.round(Math.random() * 100 + 50), // 50-150ms
        errorRate: Math.round(Math.random() * 2 * 100) / 100, // 0-2%
        lastUpdated: new Date().toISOString(),
      };

      return systemStats;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch system stats');
    }
  }
);

export const fetchUserGrowthData = createAsyncThunk(
  'devDash/fetchUserGrowthData',
  async (days: number = 30, { rejectWithValue }) => {
    try {
      const growthData = await devDashService.getUserGrowthData(days);
      
      // Calculate cumulative counts
      let cumulative = 0;
      return growthData.map(item => {
        cumulative += item.count;
        return { ...item, cumulative };
      });
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user growth data');
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'devDash/fetchUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const userDetails = await devDashService.getAllUserDetails();
      return userDetails as UserDetail[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user details');
    }
  }
);

export const fetchPracticeSessionData = createAsyncThunk(
  'devDash/fetchPracticeSessionData',
  async (_, { rejectWithValue }) => {
    try {
      const sessionData = await devDashService.getPracticeSessionData(14);
      return sessionData as PracticeSessionData[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch practice session data');
    }
  }
);

export const fetchTopicData = createAsyncThunk(
  'devDash/fetchTopicData',
  async (_, { rejectWithValue }) => {
    try {
      const topicData = await devDashService.getTopicAnalytics();
      return topicData as TopicData[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch topic data');
    }
  }
);

export const fetchCompleteUserData = createAsyncThunk(
  'devDash/fetchCompleteUserData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const completeUserData = await devDashService.getCompleteUserData(userId);
      return completeUserData as CompleteUserData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch complete user data');
    }
  }
);

export const fetchTrafficData = createAsyncThunk(
  'devDash/fetchTrafficData',
  async (timePeriod: TimePeriod = '30d', { rejectWithValue }) => {
    try {
      const trafficData = await devDashService.getTrafficData(timePeriod);
      return trafficData as TrafficData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch traffic data');
    }
  }
);