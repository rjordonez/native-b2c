/**
 * Audio-related constants
 */

// Audio formats and MIME types
export const AUDIO_FORMATS = {
  // Recording formats
  WEBM: 'audio/webm',
  WAV: 'audio/wav',
  MP3: 'audio/mp3',
  OGG: 'audio/ogg',
  
  // Default format for recording
  DEFAULT_RECORDING: 'audio/webm',
  DEFAULT_MIME_TYPE: 'audio/webm',
} as const;

// Audio constraints for recording
export const AUDIO_CONSTRAINTS = {
  // MediaRecorder constraints
  SAMPLE_RATE: 16000,
  CHANNELS: 1,
  ECHO_CANCELLATION: true,
  NOISE_SUPPRESSION: true,
  AUTO_GAIN_CONTROL: true,
} as const;

// Audio limits
export const AUDIO_LIMITS = {
  // File size limits
  MAX_FILE_SIZE_MB: 50,
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024, // 50MB
  
  // Duration limits
  MAX_RECORDING_DURATION_MS: 300000, // 5 minutes
  MIN_RECORDING_DURATION_MS: 500, // 0.5 seconds
  
  // Waveform settings
  WAVEFORM_HEIGHT: 64,
  WAVEFORM_BAR_WIDTH: 2,
  WAVEFORM_BAR_GAP: 1,
  WAVEFORM_BAR_RADIUS: 2,
} as const;

// TTS (Text-to-Speech) settings
export const TTS_SETTINGS = {
  // Voice options
  VOICES: {
    EMMA: 'emma',
    BRIAN: 'brian',
    DEFAULT: 'emma',
  },
  
  // Speed options
  SPEEDS: {
    SLOW: 0.75,
    NORMAL: 1.0,
    FAST: 1.25,
    DEFAULT: 1.0,
  },
  
  // Quality settings
  DEFAULT_QUALITY: 'high',
  DEFAULT_FORMAT: 'mp3',
} as const;

// Audio storage paths
export const AUDIO_STORAGE = {
  BUCKET_NAME: 'chat-audio',
  FILE_PREFIX: 'audio',
  FILE_EXTENSION: '.webm',
} as const;

// WaveSurfer settings
export const WAVESURFER_CONFIG = {
  // Visual settings
  WAVE_COLOR: 'rgb(59, 130, 246)',
  PROGRESS_COLOR: 'rgb(37, 99, 235)',
  CURSOR_COLOR: 'rgb(99, 102, 241)',
  BAR_WIDTH: 2,
  BAR_RADIUS: 2,
  BAR_GAP: 1,
  HEIGHT: 24,
  
  // Behavior settings
  NORMALIZE: true,
  INTERACT: true,
  DRAG_TO_SEEK: true,
} as const;