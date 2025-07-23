export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  audioUrl?: string; // For voice messages
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
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