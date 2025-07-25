import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { devDashService } from './services/devDashService';
import { DevDashState, UserAnalytics, DatabaseMetrics, SystemStats, UserDetail, PracticeSessionData, TopicData, CompleteUserData, ConversationWithMessages } from './types';

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
    selectedConversation: null,
    loading: false,
    messagesLoading: false,
    error: null,
    messagesError: null,
    isOpen: false,
    view: 'conversations',
  },
  loading: {
    userAnalytics: false,
    databaseMetrics: false,
    systemStats: false,
    userDetails: false,
    userGrowthData: false,
    practiceSessionData: false,
    topicData: false,
    completeUserData: false,
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
  },
};

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
      console.log('🚀 [fetchUserDetails] Starting Redux thunk...');
      const userDetails = await devDashService.getAllUserDetails();
      console.log('✅ [fetchUserDetails] Redux thunk received data:', userDetails?.length || 0, 'users');
      console.log('📋 [fetchUserDetails] Sample user in Redux:', userDetails?.[0]);
      return userDetails as UserDetail[];
    } catch (error) {
      console.error('❌ [fetchUserDetails] Redux thunk error:', error);
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

export const fetchConversationMessages = createAsyncThunk(
  'devDash/fetchConversationMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const messages = await devDashService.getConversationMessages(conversationId);
      return { conversationId, messages };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch conversation messages');
    }
  }
);

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
      };
    },
    refreshAllData: () => {
      // This will be handled by calling all fetch thunks in the component
    },
    openUserDetailModal: (state, action) => {
      state.userDetailModal.selectedUser = action.payload;
      state.userDetailModal.isOpen = true;
      state.userDetailModal.error = null;
    },
    closeUserDetailModal: (state) => {
      state.userDetailModal.isOpen = false;
      state.userDetailModal.selectedUser = null;
      state.userDetailModal.completeUserData = null;
      state.userDetailModal.selectedConversation = null;
      state.userDetailModal.error = null;
      state.userDetailModal.messagesError = null;
      state.userDetailModal.view = 'conversations';
    },
    selectConversation: (state, action) => {
      state.userDetailModal.selectedConversation = action.payload;
      state.userDetailModal.view = 'messages';
      state.userDetailModal.messagesError = null;
    },
    backToConversations: (state) => {
      state.userDetailModal.view = 'conversations';
      state.userDetailModal.selectedConversation = null;
      state.userDetailModal.messagesError = null;
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
        console.log('⏳ [Redux] fetchUserDetails.pending - Starting to load user details...');
        state.loading.userDetails = true;
        state.error.userDetails = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        console.log('✅ [Redux] fetchUserDetails.fulfilled - Received user details:', action.payload?.length || 0, 'users');
        console.log('📋 [Redux] Sample user stored in state:', action.payload?.[0]);
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

    // Conversation Messages
      .addCase(fetchConversationMessages.pending, (state) => {
        state.userDetailModal.messagesLoading = true;
        state.userDetailModal.messagesError = null;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.userDetailModal.messagesLoading = false;
        if (state.userDetailModal.selectedConversation) {
          state.userDetailModal.selectedConversation.messages = action.payload.messages;
        }
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.userDetailModal.messagesLoading = false;
        state.userDetailModal.messagesError = action.payload as string;
      });
  },
});

export const { clearErrors, refreshAllData, openUserDetailModal, closeUserDetailModal, selectConversation, backToConversations } = devDashSlice.actions;
export default devDashSlice.reducer;