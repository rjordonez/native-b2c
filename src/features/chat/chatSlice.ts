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
import { transcriptionApi } from '../../services/transcriptionApi';
import { fetchTopics } from '../../lib/supabase/topics';

// Async thunks for API calls (future implementation)
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, content }: SendMessagePayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      
      // Skip AI response during topic practice sessions (when we have topic practice state)
      if (state.chat.topicPractice.currentTopic) {
        console.log('Skipping AI response during topic practice session');
        return null; // Don't add any AI response
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

// Transcription async thunk
export const transcribeAudio = createAsyncThunk(
  'chat/transcribeAudio',
  async ({ messageId, audioData, contentType }: { 
    messageId: string; 
    audioData: string; 
    contentType?: string; 
  }, { rejectWithValue }) => {
    try {
      console.log(`Starting transcription for message ${messageId}`);
      
      const result = await transcriptionApi.transcribeBase64Audio(
        audioData,
        contentType || 'audio/wav',
        {
          speechModel: 'universal',
          punctuate: true,
          formatText: true
        }
      );
      
      return {
        messageId,
        transcription: {
          text: result.text,
          confidence: result.confidence,
          transcriptId: result.id,
          isLoading: false,
          error: undefined
        }
      };
    } catch (error) {
      console.error(`Transcription failed for message ${messageId}:`, error);
      return rejectWithValue({
        messageId,
        error: error instanceof Error ? error.message : 'Transcription failed'
      });
    }
  }
);

export const transcribeWithPronunciation = createAsyncThunk(
  'chat/transcribeWithPronunciation',
  async ({ messageId, audioData, contentType }: { 
    messageId: string; 
    audioData: string; 
    contentType?: string; 
  }, { rejectWithValue }) => {
    try {
      console.log(`Starting combined transcription + pronunciation for message ${messageId}`);
      
      const result = await transcriptionApi.transcribeWithPronunciation(
        audioData,
        contentType || 'audio/wav',
        {
          speechModel: 'universal',
          punctuate: true,
          formatText: true
        }
      );
      
      return {
        messageId,
        transcription: {
          text: result.transcription.text,
          confidence: result.transcription.confidence,
          transcriptId: result.transcription.id,
          isLoading: false,
          error: undefined
        },
        pronunciation: {
          ...result.pronunciation,
          isLoading: false
        }
      };
    } catch (error) {
      console.error(`Combined transcription + pronunciation failed for message ${messageId}:`, error);
      return rejectWithValue({
        messageId,
        error: error instanceof Error ? error.message : 'Analysis failed'
      });
    }
  }
);

// Topic practice async thunk
export const startTopicPractice = createAsyncThunk(
  'chat/startTopicPractice',
  async ({ topicName }: { topicName: string }, { rejectWithValue }) => {
    try {
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
      
      const ttsResponse = await fetch(`${API_BASE_URL}/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: firstQuestion.text,
          options: {
            voiceName: 'en-US-Journey-F',
            speakingRate: 1.0
          }
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

      return {
        conversation,
        topicData: {
          currentTopic: selectedTopic,
          currentQuestionIndex: 0,
          questions: selectedTopic.questionsList
        },
        autoPlayMessageId: questionMessage.id // Set this message to autoplay
      };
    } catch (error) {
      console.error('Error in startTopicPractice:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to start topic practice');
    }
  }
);

// Redo current topic question async thunk
export const redoTopicQuestion = createAsyncThunk(
  'chat/redoTopicQuestion',
  async ({}, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { topicPractice, activeConversationId } = state.chat;
      
      if (!topicPractice.currentTopic || !activeConversationId || !topicPractice.questions) {
        throw new Error('No active topic practice session');
      }
      
      // Get the current question
      const currentQuestion = topicPractice.questions[topicPractice.currentQuestionIndex];
      if (!currentQuestion) {
        throw new Error('No current question to redo');
      }
      
      console.log('Redoing question:', currentQuestion.text);
      
      // Generate audio for the current question
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const ttsResponse = await fetch(`${API_BASE_URL}/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentQuestion.text,
          options: {
            voiceName: 'en-US-Journey-F',
            speakingRate: 0.9
          }
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
      
      return {
        conversationId: activeConversationId,
        message: redoMessage,
        autoPlayMessageId: redoMessage.id // Set this message to autoplay
      };
    } catch (error) {
      console.error('Redo action error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to redo question');
    }
  }
);

// Next topic question async thunk
export const getNextTopicQuestion = createAsyncThunk(
  'chat/getNextTopicQuestion',
  async ({}, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { topicPractice, activeConversationId } = state.chat;
      
      const nextIndex = topicPractice.currentQuestionIndex + 1;
      
      if (!topicPractice.questions || nextIndex >= topicPractice.questions.length) {
        // No more questions - send text message
        const endMessage: Message = {
          id: `msg-${Date.now()}`,
          content: 'There are no more questions.',
          sender: 'assistant',
          timestamp: new Date().toISOString(),
        };
        
        return {
          conversationId: activeConversationId,
          message: endMessage,
          isEnd: true
        };
      }
      
      const nextQuestion = topicPractice.questions[nextIndex];
      
      // Generate audio for the next question
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const ttsResponse = await fetch(`${API_BASE_URL}/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: nextQuestion.text,
          options: {
            voiceName: 'en-US-Journey-F',
            speakingRate: 1.0
          }
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

      return {
        conversationId: activeConversationId,
        message: questionMessage,
        questionIndex: nextIndex,
        isEnd: false,
        autoPlayMessageId: questionMessage.id // Set this message to autoplay
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get next question');
    }
  }
);

// Enhanced transcript async thunk
export const enhanceTranscript = createAsyncThunk(
  'chat/enhanceTranscript',
  async ({ conversationId, transcript }: { conversationId: string; transcript: string }, { rejectWithValue }) => {
    try {
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

      return { conversationId, message: enhancedMessage };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to enhance transcript');
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
    audioData: null,
    recordingDuration: 0,
    recordingState: 'idle',
    isPressed: false,
    mimeType: null,
  },
  topicPractice: {
    currentTopic: null,
    currentQuestionIndex: 0,
    questions: [],
  },
  autoPlayMessageId: null,
};

export const chatSlice = createSlice({
  name: 'chat',
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
    stopRecording: (state, action: PayloadAction<{ audioUrl: string; audioData: string; duration: number; mimeType: string }>) => {
      state.voiceRecording.isRecording = false;
      state.voiceRecording.recordingState = 'recorded';
      state.voiceRecording.audioUrl = action.payload.audioUrl;
      state.voiceRecording.audioData = action.payload.audioData;
      state.voiceRecording.recordingDuration = action.payload.duration;
      state.voiceRecording.mimeType = action.payload.mimeType;
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
        audioData: null,
        recordingDuration: 0,
        recordingState: 'idle',
        isPressed: false,
        mimeType: null,
      };
    },
    updateRecordingDuration: (state, action: PayloadAction<number>) => {
      state.voiceRecording.recordingDuration = action.payload;
    },
    // UI state actions
    setIsPressed: (state, action: PayloadAction<boolean>) => {
      state.voiceRecording.isPressed = action.payload;
    },
    // Transcription actions
    startTranscription: (state, action: PayloadAction<{ messageId: string }>) => {
      const conversation = state.conversations.find(c => c.id === state.activeConversationId);
      if (conversation) {
        const message = conversation.messages.find(m => m.id === action.payload.messageId);
        if (message) {
          message.transcription = {
            text: '',
            isLoading: true,
            confidence: 0,
            error: undefined
          };
          // Initialize pronunciation loading state for user messages
          if (message.sender === 'user') {
            message.pronunciation = {
              words: [],
              overallScore: 0,
              accuracy: 0,
              fluency: 0,
              completeness: 0,
              isLoading: true,
              error: undefined
            };
          }
        }
      }
    },
    // Topic practice actions
    nextTopicQuestion: (state) => {
      if (state.topicPractice.currentQuestionIndex < state.topicPractice.questions.length - 1) {
        state.topicPractice.currentQuestionIndex += 1;
      }
    },
    resetTopicPractice: (state) => {
      state.topicPractice = {
        currentTopic: null,
        currentQuestionIndex: 0,
        questions: [],
      };
    },
    clearAutoPlayMessageId: (state) => {
      state.autoPlayMessageId = null;
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
      // Transcription
      .addCase(transcribeAudio.pending, (state) => {
        // Loading state is already set by startTranscription action
        state.error = null;
      })
      .addCase(transcribeAudio.fulfilled, (state, action) => {
        const conversation = state.conversations.find(c => c.id === state.activeConversationId);
        if (conversation) {
          const message = conversation.messages.find(m => m.id === action.payload.messageId);
          if (message) {
            message.transcription = action.payload.transcription;
          }
        }
      })
      .addCase(transcribeAudio.rejected, (state, action) => {
        const payload = action.payload as { messageId: string; error: string };
        const conversation = state.conversations.find(c => c.id === state.activeConversationId);
        if (conversation) {
          const message = conversation.messages.find(m => m.id === payload.messageId);
          if (message && message.transcription) {
            message.transcription = {
              ...message.transcription,
              isLoading: false,
              error: payload.error
            };
          }
        }
      })
      // Combined transcription + pronunciation
      .addCase(transcribeWithPronunciation.pending, (state) => {
        // Loading states are already set by startTranscription action
        state.error = null;
      })
      .addCase(transcribeWithPronunciation.fulfilled, (state, action) => {
        const conversation = state.conversations.find(c => c.id === state.activeConversationId);
        if (conversation) {
          const message = conversation.messages.find(m => m.id === action.payload.messageId);
          if (message) {
            message.transcription = action.payload.transcription;
            message.pronunciation = action.payload.pronunciation;
          }
        }
      })
      .addCase(transcribeWithPronunciation.rejected, (state, action) => {
        const payload = action.payload as { messageId: string; error: string };
        const conversation = state.conversations.find(c => c.id === state.activeConversationId);
        if (conversation) {
          const message = conversation.messages.find(m => m.id === payload.messageId);
          if (message) {
            if (message.transcription) {
              message.transcription = {
                ...message.transcription,
                isLoading: false,
                error: payload.error
              };
            }
            if (message.pronunciation) {
              message.pronunciation = {
                ...message.pronunciation,
                isLoading: false,
                error: payload.error
              };
            }
          }
        }
      })
      // Enhance transcript
      .addCase(enhanceTranscript.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
        state.error = null;
      })
      .addCase(enhanceTranscript.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        
        const { conversationId, message } = action.payload;
        const conversation = state.conversations.find(c => c.id === conversationId);
        
        if (conversation) {
          conversation.messages.push(message);
          conversation.updatedAt = new Date().toISOString();
        }
      })
      .addCase(enhanceTranscript.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.error = action.payload as string;
      })
      // Start topic practice
      .addCase(startTopicPractice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startTopicPractice.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const { conversation, topicData, autoPlayMessageId } = action.payload;
        
        // Add the new conversation
        state.conversations.unshift(conversation);
        state.activeConversationId = conversation.id;
        
        // Set topic practice state
        state.topicPractice = topicData;
        
        // Set message to autoplay
        state.autoPlayMessageId = autoPlayMessageId;
      })
      .addCase(startTopicPractice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Redo topic question
      .addCase(redoTopicQuestion.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
        state.error = null;
      })
      .addCase(redoTopicQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        
        const { conversationId, message, autoPlayMessageId } = action.payload;
        const conversation = state.conversations.find(c => c.id === conversationId);
        
        if (conversation) {
          conversation.messages.push(message);
          conversation.updatedAt = new Date().toISOString();
        }
        
        // Set message to autoplay
        state.autoPlayMessageId = autoPlayMessageId;
      })
      .addCase(redoTopicQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.error = action.payload as string;
      })
      // Get next topic question
      .addCase(getNextTopicQuestion.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
        state.error = null;
      })
      .addCase(getNextTopicQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        
        const { conversationId, message, questionIndex, isEnd, autoPlayMessageId } = action.payload;
        const conversation = state.conversations.find(c => c.id === conversationId);
        
        if (conversation) {
          conversation.messages.push(message);
          conversation.updatedAt = new Date().toISOString();
        }
        
        // Update question index if not end
        if (!isEnd && questionIndex !== undefined) {
          state.topicPractice.currentQuestionIndex = questionIndex;
        }
        
        // Set message to autoplay
        if (autoPlayMessageId) {
          state.autoPlayMessageId = autoPlayMessageId;
        }
      })
      .addCase(getNextTopicQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
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
  clearAutoPlayMessageId,
  setIsPressed,
  startTranscription,
  nextTopicQuestion,
  resetTopicPractice,
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
export const selectAudioData = (state: RootState) => state.chat.voiceRecording.audioData;
export const selectRecordingDuration = (state: RootState) => state.chat.voiceRecording.recordingDuration;
export const selectIsPressed = (state: RootState) => state.chat.voiceRecording.isPressed;
export const selectMimeType = (state: RootState) => state.chat.voiceRecording.mimeType;
export const selectAutoPlayMessageId = (state: RootState) => state.chat.autoPlayMessageId;

export default chatSlice.reducer;