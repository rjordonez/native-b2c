import { createAsyncThunk } from '@reduxjs/toolkit';
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