import { supabase } from '../shared/services/supabase';
import { Conversation, Message } from '../features/chat/types';
import { audioStorageService } from './audioStorageService';

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
        .select('*')
        .eq('client_id', conversation.id)
        .maybeSingle();

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
          .select('*')
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
   * Save a message with audio upload
   */
  async saveMessage(message: Message, conversationId: string, userId: string): Promise<string> {
    try {
      // Check if message exists by client_id
      const { data: existing, error: checkError } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', message.id)
        .maybeSingle(); // Use maybeSingle to avoid error when no rows found

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

      let audioStorageUrl = null;
      let audioDuration = null;
      
      // Upload audio to storage if present
      if (message.audioData || message.audioUrl) {
        try {
          const audioSource = message.audioData || message.audioUrl;
          if (audioSource) {
            // Generate unique filename
            const fileName = audioStorageService.generateAudioFileName(
              userId,
              message.id,
              'webm'
            );
            
            // Get audio duration
            audioDuration = await audioStorageService.getAudioDuration(audioSource);
            
            // Upload audio
            const { url } = await audioStorageService.uploadAudio(
              audioSource,
              fileName,
              'audio/webm'
            );
            
            audioStorageUrl = url;
          }
        } catch (uploadError) {
          console.error('Failed to upload audio, falling back to base64:', uploadError);
          // Continue saving message without storage URL, will use base64
        }
      }

      // Insert new message
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          client_id: message.id,
          content: message.content,
          sender: message.sender,
          audio_url: message.audioUrl, // Keep temporary URL
          audio_data: message.audioData, // Keep base64 as fallback
          audio_storage_url: audioStorageUrl,
          audio_duration: audioDuration,
          audio_mime_type: audioStorageUrl ? 'audio/webm' : null,
          is_topic_question: message.isTopicQuestion || false,
          created_at: message.timestamp,
        })
        .select('*')
        .single();

      if (error) throw error;
      
      // Save transcription if available
      if (message.transcription && !message.transcription.isLoading) {
        await this.saveTranscription(data.id, message.transcription);
      }
      
      // Save pronunciation if available
      if (message.pronunciation && !message.pronunciation.isLoading) {
        await this.savePronunciation(data.id, message.pronunciation);
      }
      
      return data.id;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  /**
   * Save transcription data
   */
  async saveTranscription(messageId: string, transcription: Message['transcription']): Promise<void> {
    if (!transcription) return;
    
    try {
      const { error } = await supabase
        .from('transcriptions')
        .upsert({
          message_id: messageId,
          text: transcription.text,
          confidence: transcription.confidence,
          transcript_id: transcription.transcriptId,
        }, {
          onConflict: 'message_id'
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving transcription:', error);
      // Don't throw - transcription is optional
    }
  }
  
  /**
   * Save pronunciation scores
   */
  async savePronunciation(messageId: string, pronunciation: Message['pronunciation']): Promise<void> {
    if (!pronunciation) return;
    
    try {
      const { error } = await supabase
        .from('pronunciation_scores')
        .upsert({
          message_id: messageId,
          overall_score: pronunciation.overallScore,
          accuracy_score: pronunciation.accuracy,
          fluency_score: pronunciation.fluency,
          completeness_score: pronunciation.completeness,
          word_scores: pronunciation.words,
          phoneme_scores: pronunciation.words.flatMap(w => w.phonemes || []),
        }, {
          onConflict: 'message_id'
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving pronunciation scores:', error);
      // Don't throw - pronunciation is optional
    }
  }
  
  /**
   * Save enhanced transcript
   */
  async saveEnhancedTranscript(messageId: string, enhancedText: string, originalText: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('enhanced_transcripts')
        .insert({
          message_id: messageId,
          enhanced_text: enhancedText,
          original_text: originalText,
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving enhanced transcript:', error);
      // Don't throw - enhancement is optional
    }
  }

  /**
   * Load all conversations for a user with topic practice state
   */
  async loadUserConversations(userId: string): Promise<{ conversations: Conversation[], topicPracticeState?: any }> {
    try {
      // Fetch conversations with their messages and related data
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (
            *,
            transcriptions (*),
            pronunciation_scores (*)
          )
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (!conversations) return { conversations: [] };

      console.log('Loaded conversations from DB:', conversations);

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
      .map((msg: any) => {
        const message: Message = {
          id: msg.client_id,
          content: msg.content,
          sender: msg.sender,
          timestamp: msg.created_at,
          // Fall back to audio_data if storage URL fails
          audioUrl: msg.audio_storage_url || msg.audio_url || msg.audio_data,
          audioData: msg.audio_data, // Keep for fallback
          isTopicQuestion: msg.is_topic_question,
        };
        
        // Add transcription if available
        if (msg.transcriptions) {
          // Handle both array and object formats
          const trans = Array.isArray(msg.transcriptions)
            ? msg.transcriptions[0]
            : msg.transcriptions;
          
          if (trans && trans.text) {
            message.transcription = {
              text: trans.text,
              isLoading: false,
              confidence: trans.confidence,
              transcriptId: trans.transcript_id,
            };
          }
        }
        
        // Add pronunciation if available
        if (msg.pronunciation_scores) {
          // Handle both array and object formats
          const pron = Array.isArray(msg.pronunciation_scores) 
            ? msg.pronunciation_scores[0] 
            : msg.pronunciation_scores;
          
          if (pron && pron.overall_score !== undefined) {
            console.log('Loading pronunciation for message:', msg.client_id, pron);
            message.pronunciation = {
              words: pron.word_scores || [],
              overallScore: pron.overall_score,
              accuracy: pron.accuracy_score,
              fluency: pron.fluency_score,
              completeness: pron.completeness_score,
              isLoading: false,
            };
          }
        }
        
        return message;
      })
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