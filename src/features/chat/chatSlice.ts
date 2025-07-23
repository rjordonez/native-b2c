import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/types';
import { 
  ChatState, 
  Message, 
  Conversation, 
  SendMessagePayload, 
  CreateConversationPayload,
  UpdateConversationPayload 
} from './types';
import { SAMPLE_CONVERSATIONS } from './constants/chatData';

// Async thunks for API calls (future implementation)
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, content }: SendMessagePayload, { rejectWithValue }) => {
    try {
      // Simulate API call delay
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
  'chat/createConversation',
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

const initialState: ChatState = {
  conversations: SAMPLE_CONVERSATIONS,
  activeConversationId: SAMPLE_CONVERSATIONS[0]?.id || null,
  isLoading: false,
  isTyping: false,
  error: null,
  voiceRecording: {
    isRecording: false,
    isPaused: false,
    audioUrl: null,
    recordingDuration: 0,
    recordingState: 'idle',
  },
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
    },
    addUserMessage: (state, action: PayloadAction<{ conversationId: string; content: string; audioUrl?: string }>) => {
      const { conversationId, content, audioUrl } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        const userMessage: Message = {
          id: `msg-${Date.now()}-user`,
          content,
          sender: 'user',
          timestamp: new Date().toISOString(),
          audioUrl,
        };
        
        conversation.messages.push(userMessage);
        conversation.updatedAt = new Date();
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
    clearError: (state) => {
      state.error = null;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    // Voice recording actions
    startRecording: (state) => {
      state.voiceRecording.isRecording = true;
      state.voiceRecording.recordingState = 'recording';
      state.voiceRecording.recordingDuration = 0;
    },
    stopRecording: (state, action: PayloadAction<{ audioUrl: string; duration: number }>) => {
      state.voiceRecording.isRecording = false;
      state.voiceRecording.recordingState = 'recorded';
      state.voiceRecording.audioUrl = action.payload.audioUrl;
      state.voiceRecording.recordingDuration = action.payload.duration;
    },
    playRecording: (state) => {
      state.voiceRecording.recordingState = 'playing';
    },
    pauseRecording: (state) => {
      state.voiceRecording.recordingState = 'recorded';
    },
    clearRecording: (state) => {
      state.voiceRecording = {
        isRecording: false,
        isPaused: false,
        audioUrl: null,
        recordingDuration: 0,
        recordingState: 'idle',
      };
    },
    updateRecordingDuration: (state, action: PayloadAction<number>) => {
      state.voiceRecording.recordingDuration = action.payload;
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
  updateConversationTitle,
  deleteConversation,
  clearError,
  setTyping,
  startRecording,
  stopRecording,
  playRecording,
  pauseRecording,
  clearRecording,
  updateRecordingDuration,
} = chatSlice.actions;

// Selectors
export const selectConversations = (state: RootState) => state.chat.conversations;
export const selectActiveConversationId = (state: RootState) => state.chat.activeConversationId;
export const selectIsLoading = (state: RootState) => state.chat.isLoading;
export const selectIsTyping = (state: RootState) => state.chat.isTyping;
export const selectError = (state: RootState) => state.chat.error;

export const selectActiveConversation = (state: RootState) => {
  const { conversations, activeConversationId } = state.chat;
  return conversations.find(c => c.id === activeConversationId) || null;
};

export const selectConversationById = (state: RootState, conversationId: string) => {
  return state.chat.conversations.find(c => c.id === conversationId) || null;
};

// Voice recording selectors
export const selectVoiceRecording = (state: RootState) => state.chat.voiceRecording;
export const selectIsRecording = (state: RootState) => state.chat.voiceRecording.isRecording;
export const selectRecordingState = (state: RootState) => state.chat.voiceRecording.recordingState;
export const selectAudioUrl = (state: RootState) => state.chat.voiceRecording.audioUrl;
export const selectRecordingDuration = (state: RootState) => state.chat.voiceRecording.recordingDuration;

export default chatSlice.reducer;