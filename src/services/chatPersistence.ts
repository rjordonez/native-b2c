import { supabase } from '../shared/services/supabase';
import { Conversation, Message } from '../features/chat/types';

interface DBConversation {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  current_topic?: any;
  current_question_index?: number;
  topic_questions?: any[];
}

interface DBMessage {
  id: string;
  conversation_id: string;
  client_id: string;
  content: string;
  sender: 'user' | 'assistant';
  created_at: string;
}

export class ChatPersistenceService {
  /**
   * Save or update a conversation with topic practice state
   */
  async saveConversation(conversation: Conversation, userId: string, topicPracticeState?: any): Promise<string> {
    try {
      // Check if conversation exists by client_id
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('client_id', conversation.id)
        .single();

      if (existing) {
        // Update existing conversation
        const updateData: any = {
          title: conversation.title,
          updated_at: new Date().toISOString(),
        };
        
        // Add topic practice state if provided
        if (topicPracticeState) {
          updateData.current_topic = topicPracticeState.currentTopic;
          updateData.current_question_index = topicPracticeState.currentQuestionIndex;
          updateData.topic_questions = topicPracticeState.questions;
        }
        
        const { error } = await supabase
          .from('conversations')
          .update(updateData)
          .eq('id', existing.id);

        if (error) throw error;
        return existing.id;
      } else {
        // Insert new conversation
        const insertData: any = {
          user_id: userId,
          client_id: conversation.id,
          title: conversation.title,
          created_at: conversation.createdAt,
          updated_at: conversation.updatedAt,
        };
        
        // Add topic practice state if provided
        if (topicPracticeState) {
          insertData.current_topic = topicPracticeState.currentTopic;
          insertData.current_question_index = topicPracticeState.currentQuestionIndex;
          insertData.topic_questions = topicPracticeState.questions;
        }
        
        const { data, error } = await supabase
          .from('conversations')
          .insert(insertData)
          .select('id')
          .single();

        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  }

  /**
   * Save a message
   */
  async saveMessage(message: Message, conversationId: string): Promise<string> {
    try {
      // Check if message exists by client_id
      const { data: existing } = await supabase
        .from('messages')
        .select('id')
        .eq('client_id', message.id)
        .single();

      if (existing) {
        // Message already exists, skip
        return existing.id;
      }

      // Insert new message
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          client_id: message.id,
          content: message.content,
          sender: message.sender,
          audio_url: message.audioUrl,
          audio_data: message.audioData,
          is_topic_question: message.isTopicQuestion || false,
          created_at: message.timestamp,
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  /**
   * Load all conversations for a user with topic practice state
   */
  async loadUserConversations(userId: string): Promise<{ conversations: Conversation[], topicPracticeState?: any }> {
    try {
      // Fetch conversations with their messages
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (*)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (!conversations) return { conversations: [] };

      // Transform DB data to Redux format
      const transformedConversations = conversations.map(conv => this.transformConversation(conv));
      
      // Find the active conversation (first one) and extract its topic practice state
      const activeConversation = conversations[0];
      let topicPracticeState = undefined;
      
      if (activeConversation && activeConversation.current_topic) {
        topicPracticeState = {
          currentTopic: activeConversation.current_topic,
          currentQuestionIndex: activeConversation.current_question_index || 0,
          questions: activeConversation.topic_questions || []
        };
      }
      
      return {
        conversations: transformedConversations,
        topicPracticeState
      };
    } catch (error) {
      console.error('Error loading conversations:', error);
      throw error;
    }
  }

  /**
   * Transform DB conversation to Redux format
   */
  private transformConversation(dbConv: any): Conversation {
    const messages: Message[] = (dbConv.messages || [])
      .map((msg: any) => ({
        id: msg.client_id,
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.created_at,
        audioUrl: msg.audio_url,
        audioData: msg.audio_data,
        isTopicQuestion: msg.is_topic_question,
      }))
      .sort((a: Message, b: Message) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    return {
      id: dbConv.client_id,
      title: dbConv.title,
      messages,
      createdAt: dbConv.created_at,
      updatedAt: dbConv.updated_at,
    };
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('client_id', conversationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  /**
   * Update conversation title
   */
  async updateConversationTitle(conversationId: string, title: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          title,
          updated_at: new Date().toISOString() 
        })
        .eq('client_id', conversationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating conversation title:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const chatPersistence = new ChatPersistenceService();