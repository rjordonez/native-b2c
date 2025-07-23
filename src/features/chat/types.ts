export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string; // ISO string for Redux serialization
  isTyping?: boolean;
  audioUrl?: string; // For voice messages (temporary URL)
  audioData?: string; // For voice messages (base64 data for persistence)
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
  audioUrl: string | null; // Temporary URL for playback during recording
  audioData: string | null; // Base64 data for persistence
  recordingDuration: number;
  recordingState: 'idle' | 'recording' | 'recorded' | 'playing';
  isPressed: boolean;
  isWaveformPlaying: boolean;
  currentTime: number;
  totalDuration: number;
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
  audioData?: string;
}

export interface CreateConversationPayload {
  title: string;
}

export interface UpdateConversationPayload {
  conversationId: string;
  title?: string;
}