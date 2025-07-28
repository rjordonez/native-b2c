/**
 * Database types for Supabase tables
 */

export interface DBConversation {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  current_topic?: DBTopic;
  current_question_index?: number;
  topic_questions?: DBTopicQuestion[];
}

export interface DBMessage {
  id: string;
  conversation_id: string;
  client_id: string;
  content: string;
  sender: 'user' | 'assistant';
  created_at: string;
  audio_url?: string;
  audio_data?: string;
  audio_storage_url?: string;
  audio_duration?: number;
  audio_mime_type?: string;
  is_topic_question?: boolean;
}

export interface DBTranscription {
  id: string;
  message_id: string;
  text: string;
  confidence?: number;
  transcript_id?: string;
  created_at: string;
}

export interface DBPronunciationScore {
  id: string;
  message_id: string;
  overall_score: number;
  accuracy_score: number;
  fluency_score: number;
  completeness_score: number;
  word_scores?: DBWordScore[];
  phoneme_scores?: DBPhonemeScore[];
  created_at: string;
}

export interface DBEnhancedTranscript {
  id: string;
  message_id: string;
  enhanced_text: string;
  original_text: string;
  created_at: string;
}

export interface DBWordScore {
  text: string;
  score: number;
  phonemes?: DBPhonemeScore[];
}

export interface DBPhonemeScore {
  phoneme: string;
  score: number;
}

export interface DBTopic {
  id: string;
  title: string;
  description?: string;
}

export interface DBTopicQuestion {
  id: string;
  text: string;
  order: number;
}

// Composite types (with relations)
export interface DBMessageWithRelations extends DBMessage {
  transcriptions?: DBTranscription | DBTranscription[];
  pronunciation_scores?: DBPronunciationScore | DBPronunciationScore[];
  enhanced_transcripts?: DBEnhancedTranscript | DBEnhancedTranscript[];
}

export interface DBConversationWithRelations extends DBConversation {
  messages: DBMessageWithRelations[];
}

export interface DBDailyChecklistProgress {
  id: string;
  user_id: string;
  task_id: number; // 1 for Part 1, 2 for Part 2, 3 for Part 3
  task_name: string;
  completed: boolean;
  completed_at?: string;
  date: string; // YYYY-MM-DD format
  created_at: string;
  updated_at: string;
}

export interface DBChecklistSummary {
  total_tasks: number;
  completed_tasks: number;
  progress_percentage: number;
}