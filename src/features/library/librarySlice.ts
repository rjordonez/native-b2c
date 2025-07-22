import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/types';
import { LibraryState, Topic, TopicProgressPayload, FilterUpdatePayload } from './types';

const initialState: LibraryState = {
  topics: [
    {
      id: '1',
      title: 'Environmental Issues',
      category: 'speaking',
      difficulty: 'medium',
      progress: 85,
      completed: false,
      description: 'Discuss environmental challenges and solutions',
      estimatedTime: '15 min',
    },
    {
      id: '2',
      title: 'Technology in Education',
      category: 'writing',
      difficulty: 'hard',
      progress: 60,
      completed: false,
      description: 'Write about the impact of technology in modern education',
      estimatedTime: '45 min',
    },
    {
      id: '3',
      title: 'Cultural Traditions',
      category: 'speaking',
      difficulty: 'easy',
      progress: 100,
      completed: true,
      description: 'Talk about traditions in your culture',
      estimatedTime: '10 min',
    },
    {
      id: '4',
      title: 'Global Health Challenges',
      category: 'reading',
      difficulty: 'hard',
      progress: 30,
      completed: false,
      description: 'Reading comprehension on health topics',
      estimatedTime: '30 min',
    },
    {
      id: '5',
      title: 'Urban Planning',
      category: 'listening',
      difficulty: 'medium',
      progress: 45,
      completed: false,
      description: 'Listen to discussions about city development',
      estimatedTime: '25 min',
    },
    {
      id: '6',
      title: 'Social Media Impact',
      category: 'writing',
      difficulty: 'medium',
      progress: 90,
      completed: false,
      description: 'Analyze the effects of social media on society',
      estimatedTime: '40 min',
    },
  ],
  filters: {
    category: 'all',
    difficulty: 'all',
    completed: null,
  },
  searchQuery: '',
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
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        category: 'all',
        difficulty: 'all',
        completed: null,
      };
      state.searchQuery = '';
    },
  },
});

export const {
  updateTopicProgress,
  toggleTopicCompletion,
  updateFilters,
  setSearchQuery,
  resetFilters,
} = librarySlice.actions;

export const selectTopics = (state: RootState) => state.library.topics;
export const selectFilters = (state: RootState) => state.library.filters;
export const selectSearchQuery = (state: RootState) => state.library.searchQuery;

export const selectFilteredTopics = (state: RootState) => {
  const { topics, filters, searchQuery } = state.library;
  
  return topics.filter(topic => {
    const matchesCategory = filters.category === 'all' || topic.category === filters.category;
    const matchesDifficulty = filters.difficulty === 'all' || topic.difficulty === filters.difficulty;
    const matchesCompleted = filters.completed === null || topic.completed === filters.completed;
    const matchesSearch = searchQuery === '' || 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesCompleted && matchesSearch;
  });
};

export default librarySlice.reducer;