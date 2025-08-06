import { createSlice } from '@reduxjs/toolkit';
import { DevDashState } from './types';
import {
  fetchUserAnalytics,
  fetchDatabaseMetrics,
  fetchSystemStats,
  fetchUserGrowthData,
  fetchUserDetails,
  fetchPracticeSessionData,
  fetchTopicData,
  fetchCompleteUserData,
  fetchTrafficData,
} from './devDashThunks';

const initialState: DevDashState = {
  userAnalytics: null,
  databaseMetrics: null,
  systemStats: null,
  userDetails: null,
  userGrowthData: null,
  practiceSessionData: null,
  topicData: null,
  userDetailModal: {
    selectedUser: null,
    completeUserData: null,
    loading: false,
    error: null,
    isOpen: false,
  },
  trafficData: null,
  loading: {
    userAnalytics: false,
    databaseMetrics: false,
    systemStats: false,
    userDetails: false,
    userGrowthData: false,
    practiceSessionData: false,
    topicData: false,
    completeUserData: false,
    trafficData: false,
  },
  error: {
    userAnalytics: null,
    databaseMetrics: null,
    systemStats: null,
    userDetails: null,
    userGrowthData: null,
    practiceSessionData: null,
    topicData: null,
    completeUserData: null,
    trafficData: null,
  },
};

const devDashSlice = createSlice({
  name: 'devDash',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        userAnalytics: null,
        databaseMetrics: null,
        systemStats: null,
        userDetails: null,
        userGrowthData: null,
        practiceSessionData: null,
        topicData: null,
        completeUserData: null,
        trafficData: null,
      };
    },
    refreshAllData: () => {
      // This will be handled by calling all fetch thunks in the component
    },
    openUserDetailModal: (state, action) => {
      state.userDetailModal.selectedUser = action.payload.user || action.payload;
      state.userDetailModal.isOpen = true;
      state.userDetailModal.error = null;
      // Track if we came from practice sessions
      state.userDetailModal.previousView = action.payload.source || null;
    },
    closeUserDetailModal: (state) => {
      state.userDetailModal.isOpen = false;
      state.userDetailModal.selectedUser = null;
      state.userDetailModal.completeUserData = null;
      state.userDetailModal.error = null;
    },
  },
  extraReducers: (builder) => {
    // User Analytics
    builder
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.loading.userAnalytics = true;
        state.error.userAnalytics = null;
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.loading.userAnalytics = false;
        state.userAnalytics = action.payload;
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.loading.userAnalytics = false;
        state.error.userAnalytics = action.payload as string;
      })

    // Database Metrics
      .addCase(fetchDatabaseMetrics.pending, (state) => {
        state.loading.databaseMetrics = true;
        state.error.databaseMetrics = null;
      })
      .addCase(fetchDatabaseMetrics.fulfilled, (state, action) => {
        state.loading.databaseMetrics = false;
        state.databaseMetrics = action.payload;
      })
      .addCase(fetchDatabaseMetrics.rejected, (state, action) => {
        state.loading.databaseMetrics = false;
        state.error.databaseMetrics = action.payload as string;
      })

    // System Stats
      .addCase(fetchSystemStats.pending, (state) => {
        state.loading.systemStats = true;
        state.error.systemStats = null;
      })
      .addCase(fetchSystemStats.fulfilled, (state, action) => {
        state.loading.systemStats = false;
        state.systemStats = action.payload;
      })
      .addCase(fetchSystemStats.rejected, (state, action) => {
        state.loading.systemStats = false;
        state.error.systemStats = action.payload as string;
      })

    // User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading.userDetails = true;
        state.error.userDetails = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading.userDetails = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        console.error('❌ [Redux] fetchUserDetails.rejected - Error:', action.payload);
        state.loading.userDetails = false;
        state.error.userDetails = action.payload as string;
      })

    // Practice Session Data
      .addCase(fetchPracticeSessionData.pending, (state) => {
        state.loading.practiceSessionData = true;
        state.error.practiceSessionData = null;
      })
      .addCase(fetchPracticeSessionData.fulfilled, (state, action) => {
        state.loading.practiceSessionData = false;
        state.practiceSessionData = action.payload;
      })
      .addCase(fetchPracticeSessionData.rejected, (state, action) => {
        state.loading.practiceSessionData = false;
        state.error.practiceSessionData = action.payload as string;
      })

    // Topic Data
      .addCase(fetchTopicData.pending, (state) => {
        state.loading.topicData = true;
        state.error.topicData = null;
      })
      .addCase(fetchTopicData.fulfilled, (state, action) => {
        state.loading.topicData = false;
        state.topicData = action.payload;
      })
      .addCase(fetchTopicData.rejected, (state, action) => {
        state.loading.topicData = false;
        state.error.topicData = action.payload as string;
      })

    // Complete User Data
      .addCase(fetchCompleteUserData.pending, (state) => {
        state.loading.completeUserData = true;
        state.error.completeUserData = null;
        state.userDetailModal.loading = true;
        state.userDetailModal.error = null;
      })
      .addCase(fetchCompleteUserData.fulfilled, (state, action) => {
        state.loading.completeUserData = false;
        state.userDetailModal.loading = false;
        state.userDetailModal.completeUserData = action.payload;
      })
      .addCase(fetchCompleteUserData.rejected, (state, action) => {
        state.loading.completeUserData = false;
        state.userDetailModal.loading = false;
        state.error.completeUserData = action.payload as string;
        state.userDetailModal.error = action.payload as string;
      })

    // User Growth Data
      .addCase(fetchUserGrowthData.pending, (state) => {
        state.loading.userGrowthData = true;
        state.error.userGrowthData = null;
      })
      .addCase(fetchUserGrowthData.fulfilled, (state, action) => {
        state.loading.userGrowthData = false;
        state.userGrowthData = action.payload;
      })
      .addCase(fetchUserGrowthData.rejected, (state, action) => {
        state.loading.userGrowthData = false;
        state.error.userGrowthData = action.payload as string;
      })

    // Traffic Data
      .addCase(fetchTrafficData.pending, (state) => {
        state.loading.trafficData = true;
        state.error.trafficData = null;
      })
      .addCase(fetchTrafficData.fulfilled, (state, action) => {
        state.loading.trafficData = false;
        state.trafficData = action.payload;
      })
      .addCase(fetchTrafficData.rejected, (state, action) => {
        state.loading.trafficData = false;
        state.error.trafficData = action.payload as string;
      })
  },
});

export const { clearErrors, refreshAllData, openUserDetailModal, closeUserDetailModal } = devDashSlice.actions;

// Re-export thunks for convenience
export {
  fetchUserAnalytics,
  fetchDatabaseMetrics,
  fetchSystemStats,
  fetchUserGrowthData,
  fetchUserDetails,
  fetchPracticeSessionData,
  fetchTopicData,
  fetchCompleteUserData,
  fetchTrafficData,
} from './devDashThunks';

export default devDashSlice.reducer;