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
      expanded: false,
      questions: [
        { id: '1-1', text: 'What are the main environmental problems in your country?', type: 'part1' },
        { id: '1-2', text: 'Do you think individuals can make a difference in protecting the environment?', type: 'part1' },
        { id: '1-3', text: 'Describe a time when you did something to help the environment.', type: 'part2' },
        { id: '1-4', text: 'What role should governments play in environmental protection?', type: 'part3' },
      ],
    },
    {
      id: '2',
      title: 'Technology in Education',
      category: 'speaking',
      difficulty: 'hard',
      progress: 60,
      completed: false,
      description: 'Discuss the impact of technology in modern education',
      estimatedTime: '15 min',
      expanded: false,
      questions: [
        { id: '2-1', text: 'Do you use technology for studying?', type: 'part1' },
        { id: '2-2', text: 'How has technology changed the way people learn?', type: 'part1' },
        { id: '2-3', text: 'Describe a useful app or website you use for learning.', type: 'part2' },
        { id: '2-4', text: 'Will traditional classrooms become obsolete in the future?', type: 'part3' },
      ],
    },
    {
      id: '3',
      title: 'Cultural Traditions',
      category: 'speaking',
      difficulty: 'easy',
      progress: 100,
      completed: true,
      description: 'Talk about traditions in your culture',
      estimatedTime: '15 min',
      expanded: false,
      questions: [
        { id: '3-1', text: 'What traditions are important in your family?', type: 'part1' },
        { id: '3-2', text: 'Do you think traditions are important for young people?', type: 'part1' },
        { id: '3-3', text: 'Describe a traditional celebration in your country.', type: 'part2' },
        { id: '3-4', text: 'How do traditions change over time?', type: 'part3' },
      ],
    },
    {
      id: '4',
      title: 'Global Health Challenges',
      category: 'speaking',
      difficulty: 'hard',
      progress: 30,
      completed: false,
      description: 'Discuss health topics and medical issues',
      estimatedTime: '15 min',
      expanded: false,
      questions: [
        { id: '4-1', text: 'How do you stay healthy?', type: 'part1' },
        { id: '4-2', text: 'What are the biggest health challenges facing the world today?', type: 'part1' },
        { id: '4-3', text: 'Describe a time when you had to visit a doctor or hospital.', type: 'part2' },
        { id: '4-4', text: 'How can governments improve public health?', type: 'part3' },
      ],
    },
    {
      id: '5',
      title: 'Urban Planning',
      category: 'speaking',
      difficulty: 'medium',
      progress: 45,
      completed: false,
      description: 'Discuss city development and urban issues',
      estimatedTime: '15 min',
      expanded: false,
      questions: [
        { id: '5-1', text: 'Do you prefer living in the city or countryside?', type: 'part1' },
        { id: '5-2', text: 'What makes a good neighborhood?', type: 'part1' },
        { id: '5-3', text: 'Describe a place in your city that has changed recently.', type: 'part2' },
        { id: '5-4', text: 'What are the advantages and disadvantages of urbanization?', type: 'part3' },
      ],
    },
    {
      id: '6',
      title: 'Social Media Impact',
      category: 'speaking',
      difficulty: 'medium',
      progress: 90,
      completed: false,
      description: 'Analyze the effects of social media on society',
      estimatedTime: '15 min',
      expanded: false,
      questions: [
        { id: '6-1', text: 'Do you use social media regularly?', type: 'part1' },
        { id: '6-2', text: 'How has social media changed the way people communicate?', type: 'part1' },
        { id: '6-3', text: 'Describe a social media platform that you find useful.', type: 'part2' },
        { id: '6-4', text: 'What are the negative effects of social media on young people?', type: 'part3' },
      ],
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
    toggleTopicExpansion: (state, action: PayloadAction<string>) => {
      const topic = state.topics.find(t => t.id === action.payload);
      if (topic) {
        topic.expanded = !topic.expanded;
      }
    },
  },
});

export const {
  updateTopicProgress,
  toggleTopicCompletion,
  updateFilters,
  setSearchQuery,
  resetFilters,
  toggleTopicExpansion,
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