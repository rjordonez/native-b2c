/**
 * Error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, statusCode?: number) {
    super(message, 'NETWORK_ERROR', statusCode);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

/**
 * User-friendly error messages
 */
export const ErrorMessages = {
  // Network errors
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  
  // Audio errors
  AUDIO_UPLOAD_FAILED: 'Failed to upload audio. Please try again.',
  AUDIO_TOO_LARGE: 'Audio file is too large. Please record a shorter message.',
  AUDIO_INVALID_FORMAT: 'Invalid audio format. Please try again.',
  
  // Transcription errors
  TRANSCRIPTION_FAILED: 'Failed to transcribe audio. Please try again.',
  TRANSCRIPTION_TIMEOUT: 'Transcription is taking longer than expected. Please try again.',
  
  // Pronunciation errors
  PRONUNCIATION_FAILED: 'Failed to analyze pronunciation. Please try again.',
  PRONUNCIATION_SAVE_FAILED: 'Failed to save pronunciation analysis. Please try again.',
  
  // Save errors
  SAVE_FAILED: 'Failed to save. Your changes may not be preserved.',
  CONVERSATION_SAVE_FAILED: 'Failed to save conversation. Please try again.',
  MESSAGE_SAVE_FAILED: 'Failed to save message. Please try again.',
  TRANSCRIPTION_SAVE_FAILED: 'Failed to save transcription. Please try again.',
  
  // Load errors
  LOAD_FAILED: 'Failed to load data. Please refresh the page.',
  CONVERSATIONS_LOAD_FAILED: 'Failed to load conversations. Please refresh the page.',
  
  // Auth errors
  NOT_AUTHENTICATED: 'Please sign in to continue.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  
  // Generic
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return ErrorMessages.NETWORK_ERROR;
    }
    
    if (error.message.includes('timeout')) {
      return ErrorMessages.TIMEOUT;
    }
    
    if (error.message.includes('Failed to save conversation')) {
      return ErrorMessages.CONVERSATION_SAVE_FAILED;
    }
    
    if (error.message.includes('Failed to save message')) {
      return ErrorMessages.MESSAGE_SAVE_FAILED;
    }
    
    if (error.message.includes('Failed to load conversations')) {
      return ErrorMessages.CONVERSATIONS_LOAD_FAILED;
    }
    
    // Return the error message if it seems user-friendly
    if (error.message.length < 100 && !error.message.includes('Error:')) {
      return error.message;
    }
  }
  
  return ErrorMessages.UNKNOWN_ERROR;
}

/**
 * Log error for debugging (only in development)
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]`, error);
  }
}

/**
 * Create error with retry information
 */
export interface RetryableError {
  error: Error;
  canRetry: boolean;
  retryAfter?: number; // milliseconds
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) {
    return true;
  }
  
  if (error instanceof AppError) {
    // Don't retry client errors (4xx)
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      return false;
    }
    return true;
  }
  
  return false;
}