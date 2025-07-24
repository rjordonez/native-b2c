import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/types';
import { 
  Conversation, 
  Message,
  SendMessagePayload, 
  CreateConversationPayload,
  UpdateConversationPayload 
} from '../types';
import { SAMPLE_CONVERSATIONS } from '../constants/chatData';

// Async thunks for API calls
export const sendMessage = createAsyncThunk(
  'conversation/sendMessage',
  async ({ conversationId, content }: SendMessagePayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      
      // Skip AI response during topic practice sessions
      if (state.topicPractice.currentTopic) {
        console.log('Skipping AI response during topic practice session');
        return null;
      }
      
      // Simulate API call delay for regular conversations
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
}

const initialState: ConversationState = {
  conversations: SAMPLE_CONVERSATIONS,
  activeConversationId: SAMPLE_CONVERSATIONS[0]?.id || null,
  isLoading: false,
  isTyping: false,
  error: null,
};

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    addUserMessage: (state, action: PayloadAction<{ conversationId: string; content: string; audioUrl?: string; audioData?: string; messageId?: string }>) => {
      const { conversationId, content, audioUrl, audioData, messageId } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        const userMessage: Message = {
          id: messageId || `msg-${Date.now()}-user`,
          content,
          sender: 'user',
          timestamp: new Date().toISOString(),
          audioUrl,
          audioData,
        };
        
        conversation.messages.push(userMessage);
        conversation.updatedAt = new Date().toISOString();
      }
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        conversation.messages.push(message);
        conversation.updatedAt = new Date().toISOString();
      }
    },
    updateConversationTitle: (state, action: PayloadAction<UpdateConversationPayload>) => {
      const { conversationId, title } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation && title) {
        conversation.title = title;
        conversation.updatedAt = new Date().toISOString();
      }
    },
    deleteConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      state.conversations = state.conversations.filter(c => c.id !== conversationId);
      
      // If deleted conversation was active, set a new active conversation
      if (state.activeConversationId === conversationId) {
        state.activeConversationId = state.conversations[0]?.id || null;
      }
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload);
      state.activeConversationId = action.payload.id;
    },
    updateMessage: (state, action: PayloadAction<{ conversationId: string; messageId: string; updates: Partial<Message> }>) => {
      const { conversationId, messageId, updates } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        const message = conversation.messages.find(m => m.id === messageId);
        if (message) {
          Object.assign(message, updates);
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        
        // Skip if no response (topic practice mode)
        if (!action.payload) {
          return;
        }
        
        const { conversationId, message } = action.payload;
        const conversation = state.conversations.find(c => c.id === conversationId);
        
        if (conversation) {
          conversation.messages.push(message);
          conversation.updatedAt = new Date().toISOString();
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.error = action.payload as string;
      })
      // Create conversation
      .addCase(createConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations.unshift(action.payload);
        state.activeConversationId = action.payload.id;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setActiveConversation,
  addUserMessage,
  addMessage,
  updateConversationTitle,
  deleteConversation,
  addConversation,
  updateMessage,
  clearError,
  setTyping,
  setLoading,
} = conversationSlice.actions;

// Selectors
export const selectConversations = (state: RootState) => state.conversation.conversations;
export const selectActiveConversationId = (state: RootState) => state.conversation.activeConversationId;
export const selectIsLoading = (state: RootState) => state.conversation.isLoading;
export const selectIsTyping = (state: RootState) => state.conversation.isTyping;
export const selectError = (state: RootState) => state.conversation.error;

export const selectActiveConversation = (state: RootState) => {
  const { conversations, activeConversationId } = state.conversation;
  return conversations.find(c => c.id === activeConversationId) || null;
};

export const selectConversationById = (state: RootState, conversationId: string) => {
  return state.conversation.conversations.find(c => c.id === conversationId) || null;
};

export default conversationSlice.reducer;