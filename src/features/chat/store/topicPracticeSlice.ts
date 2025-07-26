import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/types';
import { Topic } from '../../../lib/supabase/topics';
import { startTopicPractice, redoTopicQuestion, getNextTopicQuestion, enhanceTranscript } from './topicPracticeThunks';

// Async thunks moved to topicPracticeThunks.ts

interface TopicPracticeState {
  currentTopic: Topic | null;
  currentQuestionIndex: number;
  questions: Topic['questionsList'] | null;
}

const initialState: TopicPracticeState = {
  currentTopic: null,
  currentQuestionIndex: 0,
  questions: null,
};

export const topicPracticeSlice = createSlice({
  name: 'topicPractice',
  initialState,
  reducers: {
    setCurrentTopic: (state, action: PayloadAction<Topic | null>) => {
      state.currentTopic = action.payload;
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    setQuestions: (state, action: PayloadAction<Topic['questionsList'] | null>) => {
      state.questions = action.payload;
    },
    resetTopicPractice: (state) => {
      state.currentTopic = null;
      state.currentQuestionIndex = 0;
      state.questions = null;
    },
    restoreTopicPracticeState: (state, action: PayloadAction<{
      currentTopic: Topic;
      currentQuestionIndex: number;
      questions: Topic['questionsList'];
    }>) => {
      state.currentTopic = action.payload.currentTopic;
      state.currentQuestionIndex = action.payload.currentQuestionIndex;
      state.questions = action.payload.questions;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start topic practice
      .addCase(startTopicPractice.fulfilled, (state, action) => {
        const { topicData } = action.payload;
        state.currentTopic = topicData.currentTopic;
        state.currentQuestionIndex = topicData.currentQuestionIndex;
        state.questions = topicData.questions;
      })
      .addCase(startTopicPractice.rejected, (state) => {
        state.currentTopic = null;
        state.currentQuestionIndex = 0;
        state.questions = null;
      })
      // Redo topic question - no state change needed
      .addCase(redoTopicQuestion.fulfilled, () => {
        // No state changes needed - just adds a new message
      })
      // Next topic question
      .addCase(getNextTopicQuestion.fulfilled, (state, action) => {
        if (action.payload.questionIndex !== undefined) {
          state.currentQuestionIndex = action.payload.questionIndex;
        }
      })
      // Enhance transcript - no state change needed
      .addCase(enhanceTranscript.fulfilled, () => {
        // No state changes needed - just adds a new message
      });
  },
});

export const {
  setCurrentTopic,
  setCurrentQuestionIndex,
  setQuestions,
  resetTopicPractice,
  restoreTopicPracticeState,
} = topicPracticeSlice.actions;

// Selectors
export const selectTopicPractice = (state: RootState) => state.topicPractice;
export const selectCurrentTopic = (state: RootState) => state.topicPractice.currentTopic;
export const selectCurrentQuestionIndex = (state: RootState) => state.topicPractice.currentQuestionIndex;
export const selectTopicQuestions = (state: RootState) => state.topicPractice.questions;

export default topicPracticeSlice.reducer;