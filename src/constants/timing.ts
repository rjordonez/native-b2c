/**
 * Timing constants used throughout the application
 */

// Delays
export const DELAYS = {
  // API simulation delays (to be removed when real APIs are connected)
  SIMULATED_API_RESPONSE: 1500,
  SIMULATED_CONVERSATION_CREATE: 500,
  
  // Debounce delays
  AUTOSAVE_DEBOUNCE: 1000,
  SEARCH_DEBOUNCE: 300,
  
  // UI feedback delays
  SAVE_STATUS_HIDE: 3000,
  ERROR_TOAST_DURATION: 5000,
  SUCCESS_TOAST_DURATION: 3000,
  
  // Animation delays
  TYPING_INDICATOR_DELAY: 500,
  MESSAGE_APPEAR_DELAY: 100,
} as const;

// Timeouts
export const TIMEOUTS = {
  // API request timeouts
  TRANSCRIPTION_REQUEST: 60000, // 60 seconds
  PRONUNCIATION_REQUEST: 60000, // 60 seconds
  COMBINED_ANALYSIS_REQUEST: 120000, // 2 minutes
  HEALTH_CHECK: 5000, // 5 seconds
  
  // UI timeouts
  WAVESURFER_LOAD: 10000, // 10 seconds
  AUDIO_LOAD: 10000, // 10 seconds
} as const;

// Intervals
export const INTERVALS = {
  // Polling intervals
  TRANSCRIPTION_STATUS_POLL: 1000, // 1 second
  HEALTH_CHECK_POLL: 30000, // 30 seconds
  
  // Progress update intervals
  RECORDING_TIMER_UPDATE: 100, // 100ms for smooth timer
} as const;

// Animation durations (for CSS animations)
export const ANIMATION_DURATIONS = {
  FADE_IN: 200,
  SLIDE_IN: 300,
  BOUNCE: 600,
  PULSE: 1000,
} as const;