import { Topic } from '../../../../lib/supabase/topics';
import { Conversation, Message } from '../../types';

// Topic practice data interface
export interface TopicPractice {
  currentTopic: Topic;
  currentQuestionIndex: number;
  questions: Topic['questionsList'];
}

// Return types for thunks
export interface StartTopicPracticeResult {
  conversation: Conversation;
  topicData: TopicPractice;
  autoPlayMessageId: string;
}

export interface TopicQuestionResult {
  conversationId: string;
  message: Message;
  autoPlayMessageId: string;
}

export interface NextQuestionResult {
  conversationId: string;
  message: Message;
  questionIndex?: number;
  isEnd: boolean;
  autoPlayMessageId?: string;
}

export interface EnhanceTranscriptResult {
  conversationId: string;
  message: Message;
}