import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/types';
import { LibraryState, Topic, TopicProgressPayload, FilterUpdatePayload } from './types';
import { fetchTopics, updateTopicProgress as updateTopicProgressAPI, toggleTopicCompletion as toggleTopicCompletionAPI } from '../../lib/supabase/topics';

// Async thunks for API calls
export const fetchTopicsFromDB = createAsyncThunk(
  'library/fetchTopics',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTopics();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch topics');
    }
  }
);

export const updateTopicProgressInDB = createAsyncThunk(
  'library/updateTopicProgress',
  async ({ topicId, progress, completed }: { topicId: string; progress: number; completed?: boolean }, { rejectWithValue }) => {
    try {
      await updateTopicProgressAPI(topicId, progress, completed || false);
      return { topicId, progress, completed: completed || false };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update progress');
    }
  }
);

export const toggleTopicCompletionInDB = createAsyncThunk(
  'library/toggleTopicCompletion',
  async (topicId: string, { rejectWithValue }) => {
    try {
      const result = await toggleTopicCompletionAPI(topicId);
      return { topicId, progress: result.progress, completed: result.completed };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to toggle completion');
    }
  }
);

interface ExtendedLibraryState extends LibraryState {
  loading: boolean;
  error: string | null;
  fixedHeight: number | null;
}

const initialState: ExtendedLibraryState = {
  topics: [],
  filters: {
    part: 'all',
    completed: null,
  },
  searchQuery: '',
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
  },
  loading: false,
  error: null,
  fixedHeight: null,
};

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    updateTopicProgress: (state, action: PayloadAction<TopicProgressPayload>) => {
      const topic = state.topics.find(t => t.id === action.payload.topicId);
      if (topic) {
        topic.progress = action.payload.progress;
        topic.completed = action.payload.progress >= 100;
      }
    },
    toggleTopicCompletion: (state, action: PayloadAction<string>) => {
      const topic = state.topics.find(t => t.id === action.payload);
      if (topic) {
        topic.completed = !topic.completed;
        topic.progress = topic.completed ? 100 : Math.max(0, topic.progress - 10);
      }
    },
    updateFilters: (state, action: PayloadAction<FilterUpdatePayload>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.pagination.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = {
        part: 'all',
        completed: null,
      };
      state.searchQuery = '';
      state.pagination.currentPage = 1;
    },
    toggleTopicExpansion: (state, action: PayloadAction<string>) => {
      const topic = state.topics.find(t => t.id === action.payload);
      if (topic) {
        topic.expanded = !topic.expanded;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    nextPage: (state) => {
      state.pagination.currentPage += 1;
    },
    previousPage: (state) => {
      if (state.pagination.currentPage > 1) {
        state.pagination.currentPage -= 1;
      }
    },
    setFixedHeight: (state, action: PayloadAction<number>) => {
      state.fixedHeight = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch topics
      .addCase(fetchTopicsFromDB.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopicsFromDB.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
        state.error = null;
      })
      .addCase(fetchTopicsFromDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update topic progress
      .addCase(updateTopicProgressInDB.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTopicProgressInDB.fulfilled, (state, action) => {
        const { topicId, progress, completed } = action.payload;
        const topic = state.topics.find(t => t.id === topicId);
        if (topic) {
          topic.progress = progress;
          topic.completed = completed;
        }
      })
      .addCase(updateTopicProgressInDB.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Toggle topic completion
      .addCase(toggleTopicCompletionInDB.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleTopicCompletionInDB.fulfilled, (state, action) => {
        const { topicId, progress, completed } = action.payload;
        const topic = state.topics.find(t => t.id === topicId);
        if (topic) {
          topic.progress = progress;
          topic.completed = completed;
        }
      })
      .addCase(toggleTopicCompletionInDB.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  updateTopicProgress,
  toggleTopicCompletion,
  updateFilters,
  setSearchQuery,
  resetFilters,
  toggleTopicExpansion,
  clearError,
  setCurrentPage,
  nextPage,
  previousPage,
  setFixedHeight,
} = librarySlice.actions;

export const selectTopics = (state: RootState) => state.library.topics;
export const selectFilters = (state: RootState) => state.library.filters;
export const selectSearchQuery = (state: RootState) => state.library.searchQuery;
export const selectPagination = (state: RootState) => state.library.pagination;
export const selectLoading = (state: RootState) => state.library.loading;
export const selectError = (state: RootState) => state.library.error;
export const selectFixedHeight = (state: RootState) => state.library.fixedHeight;

export const selectFilteredTopics = (state: RootState) => {
  const { topics, filters, searchQuery } = state.library;
  
  return topics.filter(topic => {
    const matchesPart = filters.part === 'all' || topic.part === filters.part;
    const matchesCompleted = filters.completed === null || topic.completed === filters.completed;
    const matchesSearch = searchQuery === '' || 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.questions.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPart && matchesCompleted && matchesSearch;
  });
};

export const selectPaginatedTopics = (state: RootState) => {
  const filteredTopics = selectFilteredTopics(state);
  const { currentPage, itemsPerPage } = state.library.pagination;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return filteredTopics.slice(startIndex, endIndex);
};

export const selectPaginationInfo = (state: RootState) => {
  const filteredTopics = selectFilteredTopics(state);
  const { currentPage, itemsPerPage } = state.library.pagination;
  
  const totalItems = filteredTopics.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex
  };
};

export default librarySlice.reducer;