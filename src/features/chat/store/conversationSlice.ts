import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/types';
import { 
  Conversation, 
  Message,
  UpdateConversationPayload 
} from '../types';
import { SAMPLE_CONVERSATIONS } from '../constants/chatData';
import { loadConversations, sendMessage, createConversation, switchConversation, loadExistingConversation } from './conversationThunks';
import { generateMessageId } from '../../../utils/idGenerator';

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
}

const initialState: ConversationState = {
  conversations: [],
  activeConversationId: null,
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
    addUserMessage: (state, action: PayloadAction<{ conversationId: string; content: string; audioUrl?: string; audioData?: string; messageId?: string; questionIndex?: number }>) => {
      const { conversationId, content, audioUrl, audioData, messageId, questionIndex } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        const userMessage: Message = {
          id: messageId || generateMessageId('user'),
          content,
          sender: 'user',
          timestamp: new Date().toISOString(),
          audioUrl,
          audioData,
          questionIndex,
        };
        
        conversation.messages.push(userMessage);
        conversation.updatedAt = new Date().toISOString();
        // Update message count if it exists
        if (conversation.messageCount !== undefined) {
          conversation.messageCount++;
        }
      }
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        conversation.messages.push(message);
        conversation.updatedAt = new Date().toISOString();
        // Update message count if it exists
        if (conversation.messageCount !== undefined) {
          conversation.messageCount++;
        }
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
      })
      // Load conversations
      .addCase(loadConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload.conversations;
        // Set active conversation to the first one if exists
        if (action.payload.conversations.length > 0 && !state.activeConversationId) {
          state.activeConversationId = action.payload.conversations[0].id;
        }
      })
      .addCase(loadConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Fallback to sample data if loading fails
        state.conversations = SAMPLE_CONVERSATIONS;
        state.activeConversationId = SAMPLE_CONVERSATIONS[0]?.id || null;
      })
      // Switch conversation
      .addCase(switchConversation.pending, (state, action) => {
        // Switch immediately to remove perceived delay but show brief loading
        state.activeConversationId = action.meta.arg;
        state.isLoading = true;
      })
      .addCase(switchConversation.fulfilled, (state, action) => {
        // Background processing complete, update with loaded messages
        const { conversationId, messages } = action.payload;
        state.activeConversationId = conversationId;
        state.isLoading = false;
        
        // Update the conversation's messages if they were loaded
        if (conversationId && messages && messages.length > 0) {
          const conversation = state.conversations.find(c => c.id === conversationId);
          if (conversation) {
            // Always update messages to ensure we have the latest data including pronunciation
            conversation.messages = messages;
          }
        }
      })
      .addCase(switchConversation.rejected, (state, action) => {
        console.error('Failed to switch conversation:', action.error);
      })
      // Load existing conversation (for dev dashboard navigation)
      .addCase(loadExistingConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadExistingConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add the conversation if it doesn't exist
        const existingIndex = state.conversations.findIndex(c => c.id === action.payload.id);
        if (existingIndex === -1) {
          state.conversations.unshift(action.payload);
        } else {
          // Update existing conversation
          state.conversations[existingIndex] = action.payload;
        }
        state.activeConversationId = action.payload.id;
      })
      .addCase(loadExistingConversation.rejected, (state, action) => {
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

// Re-export thunks for convenience
export { loadConversations, sendMessage, createConversation, switchConversation } from './conversationThunks';

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