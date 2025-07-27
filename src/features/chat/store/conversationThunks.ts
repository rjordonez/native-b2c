import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/types';
import { 
  Conversation, 
  Message,
  SendMessagePayload, 
  CreateConversationPayload
} from '../types';
import { DELAYS } from '../../../constants/timing';
import { chatPersistence } from '../services/chatPersistence';

// Async thunks for API calls
export const loadConversations = createAsyncThunk(
  'conversation/loadConversations',
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await chatPersistence.loadUserConversations(userId);
      return result;
    } catch (error) {
      console.error('Failed to load conversations:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load conversations');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'conversation/sendMessage',
  async ({ conversationId, content }: SendMessagePayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      
      // Skip AI response during topic practice sessions
      // Check both topicPractice state and if conversation has topic questions
      const conversation = state.conversation.conversations.find(c => c.id === conversationId);
      const hasTopicQuestions = conversation?.messages.some(m => m.isTopicQuestion) ?? false;
      
      if (state.topicPractice.currentTopic || hasTopicQuestions) {
        console.log('Skipping AI response during topic practice session');
        return null;
      }
      
      // Simulate API call delay for regular conversations
      await new Promise(resolve => setTimeout(resolve, DELAYS.SIMULATED_API_RESPONSE));
      
      // Simulate AI response (replace with actual API call)
      const aiResponse: Message = {
        id: `msg-${Date.now()}`,
        content: `Thank you for your message: "${content}". This is a simulated AI response. In a real implementation, this would be connected to an AI service.`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      };
      
      return { conversationId, message: aiResponse };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to send message');
    }
  }
);

export const createConversation = createAsyncThunk(
  'conversation/createConversation',
  async ({ title }: CreateConversationPayload, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, DELAYS.SIMULATED_CONVERSATION_CREATE));
      
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newConversation;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create conversation');
    }
  }
);