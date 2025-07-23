import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

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
    transcriptionOptions?: any;
  };
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

class TranscriptionApiService {
  /**
   * Transcribe audio from base64 data
   */
  async transcribeBase64Audio(
    audioData: string,
    contentType: string = 'audio/wav',
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    try {
      console.log('🎤 Sending transcription request to backend...');
      console.log('Request details:', {
        audioDataLength: audioData.length,
        contentType,
        options
      });

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
        console.log('✅ Transcription completed successfully:', {
          text: response.data.data.text.substring(0, 100) + '...',
          confidence: response.data.data.confidence,
          processingTime: response.data.data.metadata.processingTimeMs
        });
        
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Transcription failed');
      }
    } catch (error) {
      console.error('❌ Transcription API error:', error);
      
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
      console.log('🎤 Uploading audio file for transcription...');
      console.log('File details:', {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type,
        options
      });

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
        console.log('✅ File transcription completed successfully:', {
          text: response.data.data.text.substring(0, 100) + '...',
          confidence: response.data.data.confidence,
          processingTime: response.data.data.metadata.processingTimeMs
        });
        
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Transcription failed');
      }
    } catch (error) {
      console.error('❌ File transcription API error:', error);
      
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
      console.error('❌ Get transcription status error:', error);
      
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      throw new Error(`Failed to get transcription status: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      console.warn('Transcription service health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const transcriptionApi = new TranscriptionApiService();
export default transcriptionApi;