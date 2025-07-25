import { supabase } from '../../../shared/services/supabase';
import { AUDIO_STORAGE, AUDIO_FORMATS } from '../../../constants/audio';

export class AudioStorageService {
  /**
   * Upload audio to Supabase Storage
   * @param audioData Base64 audio data or Blob
   * @param fileName Unique filename for the audio
   * @returns Public URL of the uploaded audio
   */
  async uploadAudio(
    audioData: string | Blob, 
    fileName: string,
    mimeType: string = 'audio/webm'
  ): Promise<{ url: string; path: string }> {
    try {
      let blob: Blob;
      
      // Convert base64 to blob if needed
      if (typeof audioData === 'string') {
        // Remove data URL prefix if present
        const base64 = audioData.replace(/^data:audio\/\w+;base64,/, '');
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        blob = new Blob([bytes], { type: mimeType });
      } else {
        blob = audioData;
      }
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(AUDIO_STORAGE.BUCKET_NAME)
        .upload(fileName, blob, {
          contentType: mimeType,
          upsert: true
        });
      
      if (error) {
        console.error('Audio upload error:', error);
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(AUDIO_STORAGE.BUCKET_NAME)
        .getPublicUrl(data.path);
      
      return {
        url: publicUrl,
        path: data.path
      };
    } catch (error) {
      console.error('Failed to upload audio:', error);
      throw error;
    }
  }
  
  /**
   * Delete audio from Supabase Storage
   * @param filePath Path to the file in storage
   */
  async deleteAudio(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(AUDIO_STORAGE.BUCKET_NAME)
        .remove([filePath]);
      
      if (error) {
        console.error('Audio deletion error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to delete audio:', error);
      throw error;
    }
  }
  
  /**
   * Generate a unique filename for audio storage
   * @param userId User ID
   * @param messageId Message ID
   * @param extension File extension
   */
  generateAudioFileName(
    userId: string, 
    messageId: string, 
    extension: string = 'webm'
  ): string {
    const timestamp = Date.now();
    return `${userId}/${messageId}-${timestamp}.${extension}`;
  }
  
  /**
   * Get audio duration from base64 data
   * @param audioData Base64 audio data
   * @returns Duration in seconds
   */
  async getAudioDuration(audioData: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioData);
      
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.ceil(audio.duration));
      });
      
      audio.addEventListener('error', (error) => {
        console.error('Failed to get audio duration:', error);
        resolve(0); // Default to 0 if we can't get duration
      });
    });
  }
  
  /**
   * Compress audio before upload (optional optimization)
   * @param audioBlob Original audio blob
   * @param targetBitrate Target bitrate in kbps
   * @returns Compressed audio blob
   */
  async compressAudio(
    audioBlob: Blob, 
    targetBitrate: number = 64
  ): Promise<Blob> {
    // For now, return original blob
    // TODO: Implement audio compression using Web Audio API or library
    return audioBlob;
  }
}

// Export singleton instance
export const audioStorageService = new AudioStorageService();