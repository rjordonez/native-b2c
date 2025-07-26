import { PersistenceBase } from './PersistenceBase';
import { Message } from '../../types';
import { DBTranscription, DBPronunciationScore, DBEnhancedTranscript } from '../../../../types/database';

export class TranscriptionPersistence extends PersistenceBase {
  /**
   * Save transcription data
   */
  async saveTranscription(messageId: string, transcription: Message['transcription']): Promise<void> {
    if (!transcription) return;
    
    return this.executeDbOperation(async () => {
      const { error } = await this.supabase
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
    }, 'saveTranscription');
  }
  
  /**
   * Save pronunciation scores
   */
  async savePronunciation(messageId: string, pronunciation: Message['pronunciation']): Promise<void> {
    if (!pronunciation) return;
    
    return this.executeDbOperation(async () => {
      const { error } = await this.supabase
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
    }, 'savePronunciation');
  }
  
  /**
   * Save enhanced transcript
   */
  async saveEnhancedTranscript(messageId: string, enhancedText: string, originalText: string): Promise<void> {
    return this.executeDbOperation(async () => {
      const { error } = await this.supabase
        .from('enhanced_transcripts')
        .insert({
          message_id: messageId,
          enhanced_text: enhancedText,
          original_text: originalText,
        });
      
      if (error) throw error;
    }, 'saveEnhancedTranscript');
  }

  /**
   * Get transcription by message ID
   */
  async getByMessageId(messageId: string): Promise<DBTranscription | null> {
    const { data } = await this.supabase
      .from('transcriptions')
      .select('*')
      .eq('message_id', messageId)
      .maybeSingle();
    
    return data;
  }

  /**
   * Get pronunciation scores by message ID
   */
  async getPronunciationByMessageId(messageId: string): Promise<DBPronunciationScore | null> {
    const { data } = await this.supabase
      .from('pronunciation_scores')
      .select('*')
      .eq('message_id', messageId)
      .maybeSingle();
    
    return data;
  }

  /**
   * Get enhanced transcripts by message ID
   */
  async getEnhancedTranscriptsByMessageId(messageId: string): Promise<DBEnhancedTranscript[]> {
    const { data } = await this.supabase
      .from('enhanced_transcripts')
      .select('*')
      .eq('message_id', messageId)
      .order('created_at', { ascending: true });
    
    return data || [];
  }

  /**
   * Delete transcription by message ID
   */
  async deleteTranscription(messageId: string): Promise<void> {
    return this.executeDbOperation(async () => {
      const { error } = await this.supabase
        .from('transcriptions')
        .delete()
        .eq('message_id', messageId);
      
      if (error) throw error;
    }, 'deleteTranscription');
  }

  /**
   * Delete pronunciation scores by message ID
   */
  async deletePronunciation(messageId: string): Promise<void> {
    return this.executeDbOperation(async () => {
      const { error } = await this.supabase
        .from('pronunciation_scores')
        .delete()
        .eq('message_id', messageId);
      
      if (error) throw error;
    }, 'deletePronunciation');
  }
}