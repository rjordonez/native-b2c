import { Conversation, Message } from '../types';
import { 
  DBTopic,
  DBTopicQuestion
} from '../../../types/database';
import { IChatPersistenceService } from './types';
import { ConversationPersistence } from './persistence/ConversationPersistence';
import { MessagePersistence } from './persistence/MessagePersistence';
import { TranscriptionPersistence } from './persistence/TranscriptionPersistence';
import { TopicPersistence } from './persistence/TopicPersistence';

export class ChatPersistenceService implements IChatPersistenceService {
  private conversationPersistence = new ConversationPersistence();
  private messagePersistence = new MessagePersistence();
  private transcriptionPersistence = new TranscriptionPersistence();
  private topicPersistence = new TopicPersistence();

  /**
   * Save or update a conversation with topic practice state
   */
  async saveConversation(
    conversation: Conversation, 
    userId: string, 
    topicPracticeState?: {
      currentTopic: DBTopic;
      currentQuestionIndex: number;
      questions: DBTopicQuestion[];
    }
  ): Promise<string> {
    return this.conversationPersistence.save(conversation, userId, topicPracticeState);
  }

  /**
   * Save a message with audio upload
   */
  async saveMessage(message: Message, conversationId: string, userId: string): Promise<string> {
    // Check if message already exists
    const existing = await this.messagePersistence.getByClientId(message.id);
    
    if (existing) {
      // Message already exists, save transcription/pronunciation if available
      if (message.transcription && !message.transcription.isLoading) {
        await this.saveTranscription(existing.id, message.transcription);
      }
      if (message.pronunciation && !message.pronunciation.isLoading) {
        await this.savePronunciation(existing.id, message.pronunciation);
      }
      return existing.id;
    }

    // Save new message
    const messageId = await this.messagePersistence.save(message, conversationId, userId);
    
    // Save transcription if available
    if (message.transcription && !message.transcription.isLoading) {
      await this.saveTranscription(messageId, message.transcription);
    }
    
    // Save pronunciation if available
    if (message.pronunciation && !message.pronunciation.isLoading) {
      await this.savePronunciation(messageId, message.pronunciation);
    }
    
    return messageId;
  }

  /**
   * Save transcription data
   */
  async saveTranscription(messageId: string, transcription: Message['transcription']): Promise<void> {
    if (!transcription) return;
    
    // Delegate to transcription persistence service
    // It handles errors gracefully, no need to catch here
    await this.transcriptionPersistence.saveTranscription(messageId, transcription);
  }
  
  /**
   * Save pronunciation scores
   */
  async savePronunciation(messageId: string, pronunciation: Message['pronunciation']): Promise<void> {
    if (!pronunciation) return;
    
    // Delegate to transcription persistence service
    // It handles errors gracefully, no need to catch here
    await this.transcriptionPersistence.savePronunciation(messageId, pronunciation);
  }
  
  /**
   * Save enhanced transcript
   */
  async saveEnhancedTranscript(messageId: string, enhancedText: string, originalText: string): Promise<void> {
    // Delegate to transcription persistence service
    // It handles errors gracefully, no need to catch here
    await this.transcriptionPersistence.saveEnhancedTranscript(messageId, enhancedText, originalText);
  }

  /**
   * Load a single conversation with all its messages
   */
  async loadConversationWithMessages(conversationId: string): Promise<Conversation | null> {
    return this.conversationPersistence.loadWithMessages(conversationId);
  }

  /**
   * Load all conversations for a user with topic practice state
   */
  async loadUserConversations(userId: string): Promise<{ 
    conversations: Conversation[], 
    topicPracticeState?: {
      currentTopic: DBTopic;
      currentQuestionIndex: number;
      questions: DBTopicQuestion[];
    }
  }> {
    return this.topicPersistence.loadUserConversations(userId);
  }


  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    return this.conversationPersistence.delete(conversationId);
  }

  /**
   * Update conversation title
   */
  async updateConversationTitle(conversationId: string, title: string): Promise<void> {
    return this.conversationPersistence.updateTitle(conversationId, title);
  }
}

// Export singleton instance
export const chatPersistence = new ChatPersistenceService();