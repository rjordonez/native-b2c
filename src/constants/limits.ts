/**
 * Application limits and constraints
 */

// Message limits
export const MESSAGE_LIMITS = {
  MAX_LENGTH: 5000,
  MIN_LENGTH: 1,
  MAX_MESSAGES_PER_CONVERSATION: 1000,
} as const;

// Conversation limits
export const CONVERSATION_LIMITS = {
  MAX_TITLE_LENGTH: 100,
  MIN_TITLE_LENGTH: 1,
  MAX_CONVERSATIONS_PER_USER: 100,
  DEFAULT_PAGE_SIZE: 20,
} as const;

// File upload limits
export const FILE_LIMITS = {
  // Audio files
  AUDIO: {
    MAX_SIZE_MB: 50,
    MAX_SIZE_BYTES: 50 * 1024 * 1024,
    ALLOWED_TYPES: ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg'],
  },
  
  // Image files (for future use)
  IMAGE: {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
} as const;

// Storage limits
export const STORAGE_LIMITS = {
  // Per user limits
  MAX_STORAGE_PER_USER_GB: 5,
  MAX_STORAGE_PER_USER_BYTES: 5 * 1024 * 1024 * 1024,
  
  // Retention periods (in days)
  AUDIO_RETENTION_DAYS: 30,
  MESSAGE_RETENTION_DAYS: 365,
  CONVERSATION_RETENTION_DAYS: 365,
} as const;

// Rate limits
export const RATE_LIMITS = {
  // API rate limits
  REQUESTS_PER_MINUTE: 60,
  REQUESTS_PER_HOUR: 1000,
  
  // Feature-specific limits
  TRANSCRIPTIONS_PER_HOUR: 100,
  TTS_REQUESTS_PER_HOUR: 200,
  ENHANCEMENT_REQUESTS_PER_HOUR: 50,
} as const;

// UI limits
export const UI_LIMITS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Search
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
  MAX_SEARCH_RESULTS: 50,
  
  // Display
  MAX_VISIBLE_MESSAGES: 100,
  MESSAGE_BATCH_SIZE: 20,
} as const;