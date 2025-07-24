import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/types';
import type { AppDispatch } from '../../../store/types';
import { Message, Conversation, TopicPractice, Topic } from '../types';
import { fetchTopics } from '../../../lib/supabase/topics';
import { addConversation, addMessage, setLoading, setTyping } from './conversationSlice';
import { setAutoPlayMessageId } from './audioPlaybackSlice';

// Topic practice async thunk
export const startTopicPractice = createAsyncThunk<
  { conversation: Conversation; topicData: TopicPractice; autoPlayMessageId: string },
  { topicName: string },
  { dispatch: AppDispatch; state: RootState }
>(
  'topicPractice/startTopicPractice',
  async ({ topicName }, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      console.log('Starting topic practice for:', topicName);
      
      // Fetch all topics from Supabase
      const topics = await fetchTopics();
      console.log('Using topics from Supabase:', topics);
      const selectedTopic = topics.find(topic => 
        topic.title.toLowerCase() === topicName.toLowerCase()
      );
      
      console.log('Selected topic:', selectedTopic);
      
      if (!selectedTopic || !selectedTopic.questionsList || selectedTopic.questionsList.length === 0) {
        throw new Error(`No questions found for topic: ${topicName}`);
      }

      // Create new conversation
      const conversation: Conversation = {
        id: `conv-${Date.now()}`,
        title: topicName,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Get first question
      const firstQuestion = selectedTopic.questionsList[0];
      console.log('First question:', firstQuestion);
      
      // Generate audio for the first question using TTS
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      console.log('Making TTS request to:', `${API_BASE_URL}/tts/synthesize`);
      
      // Get current TTS settings from state
      const state = getState();
      const ttsSpeed = state.audioPlayback.ttsSpeed;
      const ttsVoice = state.audioPlayback.ttsVoice;
      
      console.log('Using TTS settings - Voice:', ttsVoice, 'Speed:', ttsSpeed);
      
      const ttsResponse = await fetch(`${API_BASE_URL}/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: firstQuestion.text,
          voiceName: ttsVoice,
          speakingRate: ttsSpeed
        }),
      });

      console.log('TTS response status:', ttsResponse.status);

      if (!ttsResponse.ok) {
        console.error('TTS request failed:', ttsResponse.statusText);
        throw new Error('Failed to generate audio for question');
      }

      const ttsResult = await ttsResponse.json();
      console.log('TTS result:', ttsResult);
      
      if (!ttsResult.success) {
        throw new Error(ttsResult.message || 'TTS generation failed');
      }

      // Create the question message with audio
      const questionMessage: Message = {
        id: `msg-${Date.now()}`,
        content: firstQuestion.text,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        isTopicQuestion: true,
        audioUrl: ttsResult.data.audioUrl,
      };

      conversation.messages.push(questionMessage);
      console.log('Created conversation with audio:', conversation);

      // Add conversation to conversation slice
      dispatch(addConversation(conversation));
      
      // Set autoplay for this message
      dispatch(setAutoPlayMessageId(questionMessage.id));

      dispatch(setLoading(false));
      return {
        conversation,
        topicData: {
          currentTopic: selectedTopic,
          currentQuestionIndex: 0,
          questions: selectedTopic.questionsList
        },
        autoPlayMessageId: questionMessage.id
      };
    } catch (error) {
      console.error('Error in startTopicPractice:', error);
      dispatch(setLoading(false));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to start topic practice');
    }
  }
);

// Redo current topic question async thunk
export const redoTopicQuestion = createAsyncThunk<
  { conversationId: string; message: Message; autoPlayMessageId: string },
  {},
  { dispatch: AppDispatch; state: RootState }
>(
  'topicPractice/redoTopicQuestion',
  async ({}, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setTyping(true));
      const state = getState();
      const { currentTopic, currentQuestionIndex, questions } = state.topicPractice;
      const activeConversationId = state.conversation.activeConversationId;
      
      if (!currentTopic || !activeConversationId || !questions) {
        throw new Error('No active topic practice session');
      }
      
      // Get the current question
      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion) {
        throw new Error('No current question to redo');
      }
      
      console.log('Redoing question:', currentQuestion.text);
      
      // Generate audio for the current question
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      
      // Get current TTS settings from state
      const ttsSpeed = state.audioPlayback.ttsSpeed;
      const ttsVoice = state.audioPlayback.ttsVoice;
      
      console.log('Using TTS settings for redo - Voice:', ttsVoice, 'Speed:', ttsSpeed);
      
      const ttsResponse = await fetch(`${API_BASE_URL}/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentQuestion.text,
          voiceName: ttsVoice,
          speakingRate: ttsSpeed
        }),
      });

      if (!ttsResponse.ok) {
        throw new Error('Failed to generate audio for redo question');
      }

      const ttsResult = await ttsResponse.json();
      
      if (!ttsResult.success) {
        throw new Error(ttsResult.message || 'TTS generation failed');
      }
      
      // Create a new question message (redo)
      const redoMessage: Message = {
        id: `msg-${Date.now()}`,
        content: currentQuestion.text,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        isTopicQuestion: true,
        audioUrl: ttsResult.data.audioUrl,
      };
      
      // Add message to conversation
      dispatch(addMessage({ conversationId: activeConversationId, message: redoMessage }));
      
      // Set autoplay
      dispatch(setAutoPlayMessageId(redoMessage.id));
      
      dispatch(setLoading(false));
      dispatch(setTyping(false));
      
      return {
        conversationId: activeConversationId,
        message: redoMessage,
        autoPlayMessageId: redoMessage.id
      };
    } catch (error) {
      console.error('Redo action error:', error);
      dispatch(setLoading(false));
      dispatch(setTyping(false));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to redo question');
    }
  }
);

// Next topic question async thunk
export const getNextTopicQuestion = createAsyncThunk<
  { conversationId: string; message: Message; questionIndex?: number; isEnd: boolean; autoPlayMessageId?: string },
  {},
  { dispatch: AppDispatch; state: RootState }
>(
  'topicPractice/getNextTopicQuestion',
  async ({}, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setTyping(true));
      const state = getState();
      const { currentQuestionIndex, questions } = state.topicPractice;
      const activeConversationId = state.conversation.activeConversationId;
      
      if (!activeConversationId) {
        throw new Error('No active conversation');
      }
      
      const nextIndex = currentQuestionIndex + 1;
      
      if (!questions || nextIndex >= questions.length) {
        // No more questions - send text message
        const endMessage: Message = {
          id: `msg-${Date.now()}`,
          content: 'There are no more questions.',
          sender: 'assistant',
          timestamp: new Date().toISOString(),
        };
        
        dispatch(addMessage({ conversationId: activeConversationId, message: endMessage }));
        
        dispatch(setLoading(false));
        dispatch(setTyping(false));
        
        return {
          conversationId: activeConversationId,
          message: endMessage,
          isEnd: true
        };
      }
      
      const nextQuestion = questions[nextIndex];
      
      // Generate audio for the next question
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      
      // Get current TTS settings from state
      const ttsSpeed = state.audioPlayback.ttsSpeed;
      const ttsVoice = state.audioPlayback.ttsVoice;
      
      console.log('Using TTS settings for next question - Voice:', ttsVoice, 'Speed:', ttsSpeed);
      
      const ttsResponse = await fetch(`${API_BASE_URL}/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: nextQuestion.text,
          voiceName: ttsVoice,
          speakingRate: ttsSpeed
        }),
      });

      if (!ttsResponse.ok) {
        throw new Error('Failed to generate audio for next question');
      }

      const ttsResult = await ttsResponse.json();
      
      if (!ttsResult.success) {
        throw new Error(ttsResult.message || 'TTS generation failed');
      }

      // Create the question message
      const questionMessage: Message = {
        id: `msg-${Date.now()}`,
        content: nextQuestion.text,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        isTopicQuestion: true,
        audioUrl: ttsResult.data.audioUrl,
      };

      // Add message to conversation
      dispatch(addMessage({ conversationId: activeConversationId, message: questionMessage }));
      
      // Set autoplay
      dispatch(setAutoPlayMessageId(questionMessage.id));

      dispatch(setLoading(false));
      dispatch(setTyping(false));

      return {
        conversationId: activeConversationId,
        message: questionMessage,
        questionIndex: nextIndex,
        isEnd: false,
        autoPlayMessageId: questionMessage.id
      };
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setTyping(false));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get next question');
    }
  }
);

// Enhanced transcript async thunk
export const enhanceTranscript = createAsyncThunk<
  { conversationId: string; message: Message },
  { conversationId: string; transcript: string },
  { dispatch: AppDispatch }
>(
  'topicPractice/enhanceTranscript',
  async ({ conversationId, transcript }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setTyping(true));
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      
      const response = await fetch(`${API_BASE_URL}/enhancement/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript
        }),
      });

      if (!response.ok) {
        throw new Error(`Enhancement failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Enhancement failed');
      }

      // Create an AI message with the enhanced transcript
      const enhancedMessage: Message = {
        id: `msg-${Date.now()}`,
        content: result.data.enhancedTranscript,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        isEnhanced: true,
      };

      // Add message to conversation
      dispatch(addMessage({ conversationId, message: enhancedMessage }));

      dispatch(setLoading(false));
      dispatch(setTyping(false));

      return { conversationId, message: enhancedMessage };
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setTyping(false));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to enhance transcript');
    }
  }
);

interface TopicPracticeState {
  currentTopic: Topic | null;
  currentQuestionIndex: number;
  questions: Array<{ text: string }>;
}

const initialState: TopicPracticeState = {
  currentTopic: null,
  currentQuestionIndex: 0,
  questions: [],
};

export const topicPracticeSlice = createSlice({
  name: 'topicPractice',
  initialState,
  reducers: {
    nextTopicQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    resetTopicPractice: (state) => {
      state.currentTopic = null;
      state.currentQuestionIndex = 0;
      state.questions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Start topic practice
      .addCase(startTopicPractice.pending, () => {
        // Loading state handled in thunk
      })
      .addCase(startTopicPractice.fulfilled, (state, action) => {
        const { topicData } = action.payload;
        state.currentTopic = topicData.currentTopic;
        state.currentQuestionIndex = topicData.currentQuestionIndex;
        state.questions = topicData.questions;
      })
      .addCase(startTopicPractice.rejected, () => {
        // Error state handled in thunk
      })
      // Redo topic question
      .addCase(redoTopicQuestion.pending, () => {
        // Loading state handled in thunk
      })
      .addCase(redoTopicQuestion.fulfilled, () => {
        // Success state handled in thunk
      })
      .addCase(redoTopicQuestion.rejected, () => {
        // Error state handled in thunk
      })
      // Get next topic question
      .addCase(getNextTopicQuestion.pending, () => {
        // Loading state handled in thunk
      })
      .addCase(getNextTopicQuestion.fulfilled, (state, action) => {
        const { questionIndex, isEnd } = action.payload;
        
        // Update question index if not end
        if (!isEnd && questionIndex !== undefined) {
          state.currentQuestionIndex = questionIndex;
        }
      })
      .addCase(getNextTopicQuestion.rejected, () => {
        // Error state handled in thunk
      })
      // Enhance transcript
      .addCase(enhanceTranscript.pending, () => {
        // Loading state handled in thunk
      })
      .addCase(enhanceTranscript.fulfilled, () => {
        // Success state handled in thunk
      })
      .addCase(enhanceTranscript.rejected, () => {
        // Error state handled in thunk
      });
  },
});

export const {
  nextTopicQuestion,
  resetTopicPractice,
} = topicPracticeSlice.actions;

// Selectors
export const selectTopicPractice = (state: RootState) => state.topicPractice;
export const selectCurrentTopic = (state: RootState) => state.topicPractice.currentTopic;
export const selectCurrentQuestionIndex = (state: RootState) => state.topicPractice.currentQuestionIndex;
export const selectTopicQuestions = (state: RootState) => state.topicPractice.questions;

export default topicPracticeSlice.reducer;