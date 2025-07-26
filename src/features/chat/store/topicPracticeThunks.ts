import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/types';
import type { AppDispatch } from '../../../store/types';
import { Message, Conversation } from '../types';
import { fetchTopics, Topic } from '../../../lib/supabase/topics';
import { addConversation, addMessage, setLoading, setTyping } from './conversationSlice';
import { setAutoPlayMessageId } from './audioPlaybackSlice';

// Topic practice data interface
interface TopicPractice {
  currentTopic: Topic;
  currentQuestionIndex: number;
  questions: Topic['questionsList'];
}

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
      
      // Fetch all topics from Supabase
      const topics = await fetchTopics();
      const selectedTopic = topics.find(topic => 
        topic.title.toLowerCase() === topicName.toLowerCase()
      );
      
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
      
      // Generate audio for the first question using TTS
      const { API_BASE_URL } = await import('../../../config/api');
      
      // Get current TTS settings from state
      const state = getState();
      const ttsSpeed = state.audioPlayback.ttsSpeed;
      const ttsVoice = state.audioPlayback.ttsVoice;
      
      const ttsRequestBody = {
        text: firstQuestion.text,
        speed: ttsSpeed,
        voice: ttsVoice
      };

      let audioUrl = null;
      let audioData = null;
      
      try {
        const ttsResponse = await fetch(`${API_BASE_URL}/api/audio/tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ttsRequestBody),
        });

        if (!ttsResponse.ok) {
          throw new Error(`TTS failed: ${ttsResponse.statusText}`);
        }

        const audioBlob = await ttsResponse.blob();
        audioUrl = URL.createObjectURL(audioBlob);
        
        // Convert blob to base64 for storage
        const reader = new FileReader();
        audioData = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(audioBlob);
        });
      } catch (ttsError) {
        console.error('TTS generation failed:', ttsError);
        // Continue without audio - text-only question
      }

      // Create initial message with first question
      const firstMessage: Message = {
        id: `msg-${Date.now()}-topic`,
        content: firstQuestion.text,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        isTopicQuestion: true,
        audioUrl: audioUrl || undefined,
        audioData: audioData || undefined,
      };

      // Add conversation and message
      dispatch(addConversation(conversation));
      dispatch(addMessage({ conversationId: conversation.id, message: firstMessage }));
      
      // Set topic practice state
      const topicData: TopicPractice = {
        currentTopic: selectedTopic,
        currentQuestionIndex: 0,
        questions: selectedTopic.questionsList,
      };
      
      dispatch(setLoading(false));
      
      // Set auto-play for the first message if audio was generated
      if (audioUrl) {
        dispatch(setAutoPlayMessageId(firstMessage.id));
      }
      
      return { conversation, topicData, autoPlayMessageId: firstMessage.id };
    } catch (error) {
      dispatch(setLoading(false));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to start topic practice');
    }
  }
);

// Redo topic question async thunk
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
      
      
      // Generate audio for the current question
      const { API_BASE_URL } = await import('../../../config/api');
      
      // Get current TTS settings from state
      const ttsSpeed = state.audioPlayback.ttsSpeed;
      const ttsVoice = state.audioPlayback.ttsVoice;
      
      
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
        const errorData = await ttsResponse.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Failed to generate audio';
        
        // Provide more specific error for TTS configuration issues
        if (ttsResponse.status === 503 || errorMessage.includes('unavailable')) {
          throw new Error('Text-to-speech service is not configured. Please check backend TTS settings.');
        }
        throw new Error(errorMessage);
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
      const { API_BASE_URL } = await import('../../../config/api');
      
      // Get current TTS settings from state
      const ttsSpeed = state.audioPlayback.ttsSpeed;
      const ttsVoice = state.audioPlayback.ttsVoice;
      
      
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
        const errorData = await ttsResponse.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Failed to generate audio';
        
        // Provide more specific error for TTS configuration issues
        if (ttsResponse.status === 503 || errorMessage.includes('unavailable')) {
          throw new Error('Text-to-speech service is not configured. Please check backend TTS settings.');
        }
        throw new Error(errorMessage);
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
      const { API_BASE_URL } = await import('../../../config/api');
      
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