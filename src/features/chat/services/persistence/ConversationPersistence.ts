import { PersistenceBase } from './PersistenceBase';
import { Conversation } from '../../types';
import { DBConversation, DBTopic, DBTopicQuestion } from '../../../../types/database';
import { AppError, ErrorMessages } from '../../../../utils/error';

export class ConversationPersistence extends PersistenceBase {
  /**
   * Save or update a conversation
   */
  async save(
    conversation: Conversation, 
    userId: string,
    topicPracticeState?: {
      currentTopic: DBTopic;
      currentQuestionIndex: number;
      questions: DBTopicQuestion[];
    }
  ): Promise<string> {
    return this.executeDbOperation(async () => {
      // Check if conversation exists by client_id
      const { data: existing } = await this.supabase
        .from('conversations')
        .select('*')
        .eq('client_id', conversation.id)
        .maybeSingle();

      if (existing) {
        // Update existing conversation
        const updateData: Partial<DBConversation> = {
          title: conversation.title,
          updated_at: new Date().toISOString(),
        };
        
        // Add topic practice state if provided
        if (topicPracticeState) {
          updateData.current_topic = topicPracticeState.currentTopic;
          updateData.current_question_index = topicPracticeState.currentQuestionIndex;
          updateData.topic_questions = topicPracticeState.questions;
        }
        
        const { error } = await this.supabase
          .from('conversations')
          .update(updateData)
          .eq('id', existing.id);
        
        if (error) throw error;
        return existing.id;
      } else {
        // Create new conversation
        const conversationData: Omit<DBConversation, 'id' | 'created_at' | 'updated_at'> = {
          user_id: userId,
          client_id: conversation.id,
          title: conversation.title,
        };
        
        // Add topic practice state if provided
        if (topicPracticeState) {
          conversationData.current_topic = topicPracticeState.currentTopic;
          conversationData.current_question_index = topicPracticeState.currentQuestionIndex;
          conversationData.topic_questions = topicPracticeState.questions;
        }
        
        const { data, error } = await this.supabase
          .from('conversations')
          .insert(conversationData)
          .select()
          .single();
        
        if (error || !data) {
          throw error || new Error('Failed to create conversation');
        }
        
        return data.id;
      }
    }, 'saveConversation');
  }

  /**
   * Update conversation title
   */
  async updateTitle(conversationId: string, title: string): Promise<void> {
    return this.executeDbOperation(async () => {
      const { error } = await this.supabase
        .from('conversations')
        .update({ 
          title,
          updated_at: new Date().toISOString()
        })
        .eq('client_id', conversationId);
      
      if (error) throw error;
    }, 'updateConversationTitle');
  }

  /**
   * Delete a conversation
   */
  async delete(conversationId: string): Promise<void> {
    return this.executeDbOperation(async () => {
      const { error } = await this.supabase
        .from('conversations')
        .delete()
        .eq('client_id', conversationId);
      
      if (error) throw error;
    }, 'deleteConversation');
  }

  /**
   * Get conversation by client ID
   */
  async getByClientId(clientId: string): Promise<DBConversation | null> {
    const { data } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle();
    
    return data;
  }

  /**
   * Check if conversation exists
   */
  async exists(clientId: string): Promise<boolean> {
    return this.recordExists('conversations', 'client_id', clientId);
  }
}