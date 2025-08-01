export interface UserAnalytics {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  growthRate: number;
}

export interface DatabaseMetrics {
  totalTopics: number;
  totalProgress: number;
  avgCompletionRate: number;
  mostPopularTopic?: string;
}

export interface SystemStats {
  uptime: string;
  responseTime: number;
  errorRate: number;
  lastUpdated: string;
}

export interface TrafficSource {
  source: string;
  medium: string;
  campaign: string;
  signups: number;
}

export type TimePeriod = 'all' | '30d' | '7d' | '1d';

export interface TrafficData {
  totalSignups: number;
  sources: TrafficSource[];
  dailyTraffic: DailyTraffic[];
  timePeriod: TimePeriod;
}

export interface DailyTraffic {
  date: string;
  signups: number;
  sources: { [key: string]: number }; // UTM source breakdown for this day
}

export interface DevDashState {
  userAnalytics: UserAnalytics | null;
  databaseMetrics: DatabaseMetrics | null;
  systemStats: SystemStats | null;
  userDetails: UserDetail[] | null;
  userGrowthData: UserGrowthData[] | null;
  practiceSessionData: PracticeSessionData[] | null;
  topicData: TopicData[] | null;
  trafficData: TrafficData | null;
  userDetailModal: UserDetailModalState;
  loading: {
    userAnalytics: boolean;
    databaseMetrics: boolean;
    systemStats: boolean;
    userDetails: boolean;
    userGrowthData: boolean;
    practiceSessionData: boolean;
    topicData: boolean;
    completeUserData: boolean;
    trafficData: boolean
  };
  error: {
    userAnalytics: string | null;
    databaseMetrics: string | null;
    systemStats: string | null;
    userDetails: string | null;
    userGrowthData: string | null;
    practiceSessionData: string | null;
    topicData: string | null;
    completeUserData: string | null;
    trafficData: string | null;
  };
}

export interface UserGrowthData {
  date: string;
  count: number;
  cumulative: number;
}

export interface UserDetail {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  created_at: string;
  country: string | null;
  target_band_score: number | null;
  current_level: string | null;
  conversationCount?: number;
}

export interface PracticeSessionData {
  date: string;
  sessions: number;
  completions: number;
}

export interface TopicData {
  topic: string;
  sessions: number;
  color: string;
}

// User Detail Data Types (matching actual Supabase schema)
export interface Transcription {
  id: string;
  message_id: string;
  text: string;
  confidence?: number;
  transcript_id?: string;
  created_at: string;
}

export interface PronunciationScore {
  id: string;
  message_id: string;
  overall_score: number;
  accuracy_score: number;
  fluency_score: number;
  completeness_score: number;
  word_scores?: any;
  phoneme_scores?: any;
  created_at: string;
}

export interface EnhancedTranscript {
  id: string;
  message_id: string;
  enhanced_text: string;
  original_text: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  client_id?: string;
  content: string;
  sender: 'user' | 'assistant';
  audio_url?: string;
  audio_data?: string;
  audio_storage_url?: string;
  audio_duration?: number;
  audio_mime_type?: string;
  is_topic_question?: boolean;
  created_at: string;
  transcriptions?: Transcription[];
  pronunciation_scores?: PronunciationScore[];
  enhanced_transcripts?: EnhancedTranscript[];
}

export interface Conversation {
  id: string;
  user_id: string;
  client_id?: string;
  title: string;
  conversation_type?: string;
  current_topic?: any;
  current_question_index?: number;
  topic_questions?: any;
  created_at: string;
  updated_at: string;
  messageCount?: number;
}

export interface CompleteUserData {
  profile: UserDetail | null;
  conversations: Conversation[];
  errors: {
    profile: any;
    conversations: any;
  };
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

export interface UserDetailModalState {
  selectedUser: UserDetail | null;
  completeUserData: CompleteUserData | null;
  selectedConversation: ConversationWithMessages | null;
  loading: boolean;
  messagesLoading: boolean;
  error: string | null;
  messagesError: string | null;
  isOpen: boolean;
  view: 'conversations' | 'messages';
}

