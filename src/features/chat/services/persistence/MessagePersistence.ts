import { PersistenceBase } from './PersistenceBase';
import { Message } from '../../types';
import { DBMessage } from '../../../../types/database';
import { audioStorageService } from '../audioStorageService';

export class MessagePersistence extends PersistenceBase {
  /**
   * Save a message with audio upload
   */
  async save(message: Message, conversationId: string, userId: string): Promise<string> {
    return this.executeDbOperation(async () => {
      // Check if message exists by client_id
      const { data: existing } = await this.supabase
        .from('messages')
        .select('*')
        .eq('client_id', message.id)
        .maybeSingle();

      if (existing) {
        // Message already exists, return its ID
        // Transcription and pronunciation will be saved separately
        return existing.id;
      }

      // Handle audio upload
      const audioData = await this.handleAudioUpload(message, userId);
      

      // Insert new message
      const { data, error } = await this.supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          client_id: message.id,
          content: message.content,
          sender: message.sender,
          audio_url: message.audioUrl, // Keep temporary URL
          audio_data: message.audioData, // Keep base64 as fallback
          audio_storage_url: audioData.storageUrl,
          audio_duration: audioData.duration,
          audio_mime_type: audioData.storageUrl ? 'audio/webm' : null,
          is_topic_question: message.isTopicQuestion || false,
          question_index: message.questionIndex ?? null, // Add question_index
          created_at: message.timestamp,
        })
        .select('*')
        .single();

      if (error || !data) {
        console.error('[MessagePersistence] Save error:', error);
        throw error || new Error('Failed to save message');
      }
      
      
      return data.id;
    }, 'saveMessage');
  }

  /**
   * Handle audio upload to storage
   */
  private async handleAudioUpload(message: Message, userId: string): Promise<{
    storageUrl: string | null;
    duration: number | null;
  }> {
    if (!message.audioData && !message.audioUrl) {
      return { storageUrl: null, duration: null };
    }

    try {
      const audioSource = message.audioData || message.audioUrl;
      if (!audioSource) {
        return { storageUrl: null, duration: null };
      }

      // Generate unique filename
      const fileName = audioStorageService.generateAudioFileName(
        userId,
        message.id,
        'webm'
      );
      
      // Get audio duration
      const duration = await audioStorageService.getAudioDuration(audioSource);
      
      // Upload audio
      const { url } = await audioStorageService.uploadAudio(
        audioSource,
        fileName,
        'audio/webm'
      );
      
      return { storageUrl: url, duration };
    } catch (uploadError) {
      // Continue saving message without storage URL, will use base64
      // This is a graceful fallback, not an error condition
      return { storageUrl: null, duration: null };
    }
  }

  /**
   * Get message by client ID
   */
  async getByClientId(clientId: string): Promise<DBMessage | null> {
    const { data } = await this.supabase
      .from('messages')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle();
    
    return data;
  }

  /**
   * Delete a message
   */
  async delete(messageId: string): Promise<void> {
    return this.executeDbOperation(async () => {
      const { error } = await this.supabase
        .from('messages')
        .delete()
        .eq('client_id', messageId);
      
      if (error) throw error;
    }, 'deleteMessage');
  }

  /**
   * Check if message exists
   */
  async exists(clientId: string): Promise<boolean> {
    return this.recordExists('messages', 'client_id', clientId);
  }
}