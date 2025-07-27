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
import { restoreTopicPracticeState, resetTopicPractice } from './topicPracticeSlice';
import { updateConversationMetadata } from './conversationSlice';
import { fetchTopics } from '../../../lib/supabase/topics';

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

export const switchConversation = createAsyncThunk(
  'conversation/switchConversation',
  async (conversationId: string | null, { getState, dispatch }) => {
    const state = getState() as RootState;
    
    // If null, just reset topic practice
    if (!conversationId) {
      dispatch(resetTopicPractice());
      return null;
    }
    
    const conversation = state.conversation.conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      return conversationId;
    }
    
    // Check if this is a topic practice conversation
    const hasTopicQuestions = conversation.messages.some(m => m.isTopicQuestion);
    
    if (hasTopicQuestions || conversation.topicPracticeMetadata) {
      try {
        // Try to get topic info from metadata or conversation title
        let topicName = conversation.topicPracticeMetadata?.topicTitle || conversation.title;
        let currentQuestionIndex = conversation.topicPracticeMetadata?.currentQuestionIndex || 0;
        
        // Count topic questions to determine current index
        const topicQuestionCount = conversation.messages.filter(m => m.isTopicQuestion).length;
        if (!conversation.topicPracticeMetadata && topicQuestionCount > 0) {
          currentQuestionIndex = topicQuestionCount - 1; // Last question index
        }
        
        // Fetch topics to get the full topic data
        const topics = await fetchTopics();
        const topic = topics.find(t => 
          t.id === conversation.topicPracticeMetadata?.topicId ||
          t.title.toLowerCase() === topicName.toLowerCase()
        );
        
        if (topic && topic.questionsList) {
          // Restore the topic practice state
          dispatch(restoreTopicPracticeState({
            currentTopic: topic,
            currentQuestionIndex: currentQuestionIndex,
            questions: topic.questionsList,
          }));
          
          // Also update the conversation metadata for future use
          dispatch(updateConversationMetadata({
            conversationId: conversation.id,
            metadata: {
              topicId: topic.id,
              topicTitle: topic.title,
              currentQuestionIndex: currentQuestionIndex,
              totalQuestions: topic.questionsList.length,
            }
          }));
        } else {
          // Topic not found, reset
          dispatch(resetTopicPractice());
        }
      } catch (error) {
        console.error('Error restoring topic practice:', error);
        dispatch(resetTopicPractice());
      }
    } else {
      // Not a topic practice conversation
      dispatch(resetTopicPractice());
    }
    
    return conversationId;
  }
);