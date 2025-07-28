import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { TIMEOUTS } from '../../../constants/timing';
import { API_ENDPOINTS } from '../../../constants/api';
import { AppError, ErrorMessages, logError } from '../../../utils/error';
import { 
  ITranscriptionApiService,
  TranscriptionResult,
  PronunciationResult,
  CombinedResult,
  TranscriptionOptions
} from './types';

// Re-export types for backward compatibility
export type { TranscriptionResult, PronunciationResult, CombinedResult, TranscriptionOptions };

class TranscriptionApiService implements ITranscriptionApiService {
  /**
   * Transcribe audio from base64 data
   */
  async transcribeBase64Audio(
    audioData: string,
    contentType: string = 'audio/wav',
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    try {

      const response = await axios.post(`${API_BASE_URL}/transcription/transcribe-base64`, {
        audioData,
        contentType,
        ...options
      }, {
        timeout: 60000, // 60 second timeout for transcription
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Transcription failed');
      }
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Transcription timeout - please try again');
        }
        
        if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        }
        
        if (error.response?.status === 503) {
          throw new Error('Transcription service temporarily unavailable');
        }
        
        if (error.response?.status >= 500) {
          throw new Error('Server error - please try again later');
        }
        
        throw new Error(`Network error: ${error.message}`);
      }
      
      throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transcribe audio file (multipart upload)
   */
  async transcribeAudioFile(
    audioFile: File,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    try {

      const formData = new FormData();
      formData.append('audio', audioFile);
      
      // Add options as form fields
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await axios.post(`${API_BASE_URL}/transcription/transcribe`, formData, {
        timeout: 60000, // 60 second timeout for transcription
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Transcription failed');
      }
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Transcription timeout - please try again');
        }
        
        if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        }
        
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      throw new Error(`File transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get transcription status by ID
   */
  async getTranscriptionStatus(transcriptId: string): Promise<TranscriptionResult> {
    try {
      const response = await axios.get(`${API_BASE_URL}/transcription/status/${transcriptId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to get transcription status');
      }
    } catch (error) {
      
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      throw new Error(`Failed to get transcription status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transcribe audio with pronunciation analysis (base64 data)
   */
  async transcribeWithPronunciation(
    audioData: string,
    contentType: string = 'audio/wav',
    options: TranscriptionOptions = {}
  ): Promise<CombinedResult> {
    try {

      // Convert base64 to Blob for multipart upload
      const base64Data = audioData.includes(',') ? audioData.split(',')[1] : audioData;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: contentType });
      const audioFile = new File([audioBlob], 'audio.wav', { type: contentType });

      const formData = new FormData();
      formData.append('audio', audioFile);
      
      // Add options as form fields
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await axios.post(`${API_BASE_URL}/transcription/transcribe-with-pronunciation`, formData, {
        timeout: 120000, // 2 minute timeout for combined processing
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Combined analysis failed');
      }
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Analysis timeout - please try again');
        }
        
        if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        }
        
        if (error.response?.status === 503) {
          throw new Error('Analysis service temporarily unavailable');
        }
        
        if (error.response?.status >= 500) {
          throw new Error('Server error - please try again later');
        }
        
        throw new Error(`Network error: ${error.message}`);
      }
      
      throw new Error(`Combined analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check transcription service health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/transcription/health`, {
        timeout: 5000
      });
      
      return response.data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const transcriptionApi = new TranscriptionApiService();
export default transcriptionApi;