export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string; // ISO string for Redux serialization
  isTyping?: boolean;
  audioUrl?: string; // For voice messages
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string; // ISO string for Redux serialization
  updatedAt: string; // ISO string for Redux serialization
}

export interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  audioUrl: string | null; // Store URL instead of Blob for Redux serialization
  recordingDuration: number;
  recordingState: 'idle' | 'recording' | 'recorded' | 'playing';
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  voiceRecording: VoiceRecordingState;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  audioUrl?: string;
}

export interface CreateConversationPayload {
  title: string;
}

export interface UpdateConversationPayload {
  conversationId: string;
  title?: string;
}