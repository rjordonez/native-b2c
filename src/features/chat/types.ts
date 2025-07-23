export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string; // ISO string for Redux serialization
  isTyping?: boolean;
  isEnhanced?: boolean; // For enhanced transcript messages
  isTopicQuestion?: boolean; // For topic practice audio questions
  audioUrl?: string; // For voice messages (temporary URL)
  audioData?: string; // For voice messages (base64 data for persistence)
  transcription?: {
    text: string;
    isLoading: boolean;
    confidence?: number;
    error?: string;
    transcriptId?: string;
  };
  pronunciation?: {
    words: Array<{
      text: string;
      score?: number;
      phonemes?: Array<{
        phoneme: string;
        score: number;
      }>;
    }>;
    overallScore: number;
    accuracy: number;
    fluency: number;
    completeness: number;
    isLoading: boolean;
    error?: string;
  };
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
  mimeType: string | null; // MIME type used for recording
}

export interface TopicPracticeState {
  currentTopic: any | null; // Topic from supabase service
  currentQuestionIndex: number;
  questions: any[]; // Question[] from supabase service
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  voiceRecording: VoiceRecordingState;
  topicPractice: TopicPracticeState;
  autoPlayMessageId: string | null; // Message ID that should autoplay once
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