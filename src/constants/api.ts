/**
 * API configuration constants
 */

// Base API URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Helper function to build full API URLs
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// API endpoints
export const API_ENDPOINTS = {
  // Transcription endpoints
  TRANSCRIPTION: {
    BASE: '/transcription',
    TRANSCRIBE_BASE64: '/transcription/transcribe-base64',
    TRANSCRIBE_FILE: '/transcription/transcribe',
    TRANSCRIBE_URL: '/transcription/transcribe-url',
    TRANSCRIBE_WITH_PRONUNCIATION: '/transcription/transcribe-with-pronunciation',
    STATUS: '/transcription/status',
    HEALTH: '/transcription/health',
  },
  
  // Pronunciation endpoints
  PRONUNCIATION: {
    BASE: '/pronunciation',
    ASSESS: '/pronunciation/assess',
    ASSESS_BASE64: '/pronunciation/assess-base64',
    HEALTH: '/pronunciation/health',
  },
  
  // TTS (Text-to-Speech) endpoints
  TTS: {
    BASE: '/tts',
    SYNTHESIZE: '/tts/synthesize',
  },
  
  // Enhancement endpoints
  ENHANCEMENT: {
    BASE: '/enhancement',
    ENHANCE: '/enhancement/enhance',
  },
  
  // Health check
  HEALTH: '/health',
} as const;

// API request headers
export const API_HEADERS = {
  CONTENT_TYPE_JSON: 'application/json',
  CONTENT_TYPE_MULTIPART: 'multipart/form-data',
} as const;

// API response status codes
export const API_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  
  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
  TIMEOUT: 408,
  TOO_LARGE: 413,
  TOO_MANY_REQUESTS: 429,
  
  // Server errors
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// API retry configuration
export const API_RETRY = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
  BACKOFF_FACTOR: 2,
  
  // Retryable status codes
  RETRYABLE_STATUSES: [
    API_STATUS.TOO_MANY_REQUESTS,
    API_STATUS.SERVER_ERROR,
    API_STATUS.BAD_GATEWAY,
    API_STATUS.SERVICE_UNAVAILABLE,
    API_STATUS.GATEWAY_TIMEOUT,
  ],
} as const;