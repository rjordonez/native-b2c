/**
 * User-facing message constants
 */

// Success messages
export const SUCCESS_MESSAGES = {
  // Save messages
  SAVED: 'Saved',
  CONVERSATION_CREATED: 'Conversation created',
  MESSAGE_SENT: 'Message sent',
  
  // Audio messages
  RECORDING_COMPLETE: 'Recording complete',
  AUDIO_UPLOADED: 'Audio uploaded',
  
  // Transcription messages
  TRANSCRIPTION_COMPLETE: 'Transcription complete',
  PRONUNCIATION_ANALYZED: 'Pronunciation analyzed',
  
  // Profile messages
  PROFILE_UPDATED: 'Profile updated',
  SETTINGS_SAVED: 'Settings saved',
} as const;

// Info messages
export const INFO_MESSAGES = {
  // Status messages
  LOADING: 'Loading...',
  PROCESSING: 'Processing...',
  SAVING: 'Saving...',
  UPLOADING: 'Uploading...',
  
  // Transcription messages
  TRANSCRIBING: 'Transcribing audio...',
  ANALYZING_PRONUNCIATION: 'Analyzing pronunciation...',
  ENHANCING_TRANSCRIPT: 'Enhancing transcript...',
  
  // Recording messages
  RECORDING: 'Recording...',
  PRESS_TO_RECORD: 'Press and hold to record',
  RELEASE_TO_SEND: 'Release to send',
} as const;

// Placeholder messages
export const PLACEHOLDER_MESSAGES = {
  // Input placeholders
  TYPE_MESSAGE: 'Type a message...',
  CONVERSATION_TITLE: 'Enter conversation title',
  SEARCH: 'Search...',
  
  // Empty states
  NO_CONVERSATIONS: 'No conversations yet',
  NO_MESSAGES: 'No messages yet',
  NO_RESULTS: 'No results found',
} as const;

// Confirmation messages
export const CONFIRMATION_MESSAGES = {
  DELETE_CONVERSATION: 'Are you sure you want to delete this conversation?',
  DELETE_MESSAGE: 'Are you sure you want to delete this message?',
  UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
} as const;

// Button labels
export const BUTTON_LABELS = {
  // Actions
  SEND: 'Send',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  EDIT: 'Edit',
  CONFIRM: 'Confirm',
  
  // Audio controls
  PLAY: 'Play',
  PAUSE: 'Pause',
  STOP: 'Stop',
  RECORD: 'Record',
  
  // Navigation
  NEXT: 'Next',
  PREVIOUS: 'Previous',
  BACK: 'Back',
  CONTINUE: 'Continue',
  
  // Features
  ENHANCE: 'Enhanced',
  SHADOW_SENTENCE: 'Shadow sentence',
  TRY_AGAIN: 'Try again',
  SKIP: 'Skip',
} as const;

// Titles and headings
export const TITLES = {
  // Page titles
  CHAT: 'Chat',
  DASHBOARD: 'Dashboard',
  LIBRARY: 'Library',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  
  // Section titles
  RECENT_CONVERSATIONS: 'Recent Conversations',
  TOPIC_PRACTICE: 'Topic Practice',
  PRONUNCIATION_SCORE: 'Pronunciation Score',
  TRANSCRIPTION: 'Transcription',
} as const;