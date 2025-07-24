// Audio recording configuration constants
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 16000,
  CHANNEL_COUNT: 1,
  ECHO_CANCELLATION: true,
  NOISE_SUPPRESSION: true,
  SAMPLE_SIZE: 16,
} as const;

// Audio MIME types
export const MIME_TYPES = {
  WAV: 'audio/wav',
  WEBM: 'audio/webm',
  MP3: 'audio/mp3',
} as const;

// WaveSurfer default configurations
export const WAVEFORM_CONFIG = {
  DEFAULT: {
    height: 24,
    barWidth: 1,
    barGap: 1,
    barRadius: 1,
  },
  CHAT_USER: {
    waveColor: '#ffffff',
    progressColor: '#d1d5db',
  },
  CHAT_ASSISTANT: {
    waveColor: '#e5e7eb',
    progressColor: '#6B7280',
  },
  RECORDING: {
    waveColor: '#d1d5db',
    progressColor: '#4F46E5',
  },
  TTS_PREVIEW: {
    waveColor: '#e5e7eb',
    progressColor: '#4F46E5',
  }
} as const;

// Audio playback configuration
export const PLAYBACK_CONFIG = {
  DEFAULT_SPEED: 1.0,
  MIN_SPEED: 0.25,
  MAX_SPEED: 2.0,
  STEP_SIZE: 0.05,
  SLOW_PLAYBACK_RATE: 0.75, // For pronunciation practice
} as const;

// Audio recording constraints
export const RECORDING_CONSTRAINTS = {
  audio: {
    channelCount: AUDIO_CONFIG.CHANNEL_COUNT,
    sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
    echoCancellation: AUDIO_CONFIG.ECHO_CANCELLATION,
    noiseSuppression: AUDIO_CONFIG.NOISE_SUPPRESSION,
  }
} as const;