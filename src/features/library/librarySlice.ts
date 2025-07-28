import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store/types';
import { LibraryState, Topic, TopicProgressPayload, FilterUpdatePayload } from './types';
import { fetchTopicsFromDB, updateTopicProgressInDB, toggleTopicCompletionInDB } from './libraryThunks';

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

// Memoized selector for filtered topics - prevents expensive recalculations
export const selectFilteredTopics = createSelector(
  [(state: RootState) => state.library.topics,
   (state: RootState) => state.library.filters,
   (state: RootState) => state.library.searchQuery],
  (topics, filters, searchQuery) => {
    return topics.filter(topic => {
      const matchesPart = filters.part === 'all' || topic.part === filters.part;
      const matchesCompleted = filters.completed === null || topic.completed === filters.completed;
      const matchesSearch = searchQuery === '' || 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.questions.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesPart && matchesCompleted && matchesSearch;
    });
  }
);

// Memoized selector for paginated topics
export const selectPaginatedTopics = createSelector(
  [selectFilteredTopics,
   (state: RootState) => state.library.pagination.currentPage,
   (state: RootState) => state.library.pagination.itemsPerPage],
  (filteredTopics, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredTopics.slice(startIndex, endIndex);
  }
);

// Memoized selector for pagination info
export const selectPaginationInfo = createSelector(
  [selectFilteredTopics,
   (state: RootState) => state.library.pagination.currentPage,
   (state: RootState) => state.library.pagination.itemsPerPage],
  (filteredTopics, currentPage, itemsPerPage) => {
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
  }
);

// Re-export thunks for convenience
export { fetchTopicsFromDB, updateTopicProgressInDB, toggleTopicCompletionInDB } from './libraryThunks';

export default librarySlice.reducer;