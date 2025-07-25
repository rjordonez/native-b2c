/**
 * Service interface definitions for chat feature
 */

import { Conversation, Message } from '../types';
import { 
  DBTopic,
  DBTopicQuestion
} from '../../../types/database';

// Audio Storage Service Interface
export interface IAudioStorageService {
  uploadAudio(
    audioData: string | Blob, 
    fileName: string,
    mimeType?: string
  ): Promise<{ url: string; path: string }>;
  
  deleteAudio(filePath: string): Promise<void>;
  
  generateAudioFileName(
    userId: string, 
    messageId: string, 
    extension?: string
  ): string;
  
  getAudioDuration(audioData: string): Promise<number>;
  
  compressAudio(
    audioBlob: Blob, 
    targetBitrate?: number
  ): Promise<Blob>;
}

// Chat Persistence Service Interface
export interface IChatPersistenceService {
  saveConversation(
    conversation: Conversation, 
    userId: string, 
    topicPracticeState?: {
      currentTopic: DBTopic;
      currentQuestionIndex: number;
      questions: DBTopicQuestion[];
    }
  ): Promise<string>;
  
  saveMessage(
    message: Message, 
    conversationId: string, 
    userId: string
  ): Promise<string>;
  
  saveTranscription(
    messageId: string,
    transcription: {
      text: string;
      confidence?: number;
      transcriptId?: string;
    }
  ): Promise<void>;
  
  savePronunciation(
    messageId: string,
    pronunciation: {
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
    }
  ): Promise<void>;
  
  saveEnhancedTranscript(
    messageId: string,
    enhancedText: string,
    originalText: string
  ): Promise<void>;
  
  loadUserConversations(userId: string): Promise<{
    conversations: Conversation[];
    activeConversationId: string | null;
  }>;
  
  deleteConversation(conversationId: string): Promise<void>;
  
  updateConversationTitle(
    conversationId: string, 
    title: string
  ): Promise<void>;
}

// Transcription API Service Interface
export interface ITranscriptionApiService {
  transcribeBase64Audio(
    audioData: string,
    contentType?: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult>;
  
  transcribeAudioFile(
    file: File,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult>;
  
  getTranscriptionStatus(
    transcriptionId: string
  ): Promise<TranscriptionResult>;
  
  transcribeAndAnalyze(
    audioData: string,
    referenceText: string,
    contentType?: string,
    options?: TranscriptionOptions
  ): Promise<CombinedResult>;
  
  formatAudioData(audioData: string): string;
}

// Type definitions used by services
export interface TranscriptionResult {
  id: string;
  text: string;
  confidence: number;
  status: string;
  audioUrl: string;
  languageDetected?: string;
  words?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
    speaker?: string;
  }>;
  metadata: {
    requestId: string;
    processingTimeMs: number;
    audioInfo: {
      size: number;
      type: string;
      filename?: string;
      encoding?: string;
    };
    transcriptionOptions?: TranscriptionOptions;
  };
}

export interface PronunciationResult {
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
}

export interface CombinedResult {
  transcription: TranscriptionResult;
  pronunciation: PronunciationResult;
}

export interface TranscriptionOptions {
  speechModel?: string;
  autoDetectLanguage?: boolean;
  speakerLabels?: boolean;
  sentimentAnalysis?: boolean;
  entityDetection?: boolean;
  autoChapters?: boolean;
  punctuate?: boolean;
  formatText?: boolean;
  dualChannel?: boolean;
}