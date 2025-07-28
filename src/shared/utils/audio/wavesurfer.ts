import WaveSurfer from 'wavesurfer.js';
import { WAVEFORM_CONFIG } from './constants';

export type WaveformType = 'chat_user' | 'chat_assistant' | 'recording' | 'tts_preview';

/**
 * Configuration for WaveSurfer instances
 */
export interface WaveSurferConfig {
  container: HTMLElement;
  type?: WaveformType;
  height?: number;
  waveColor?: string;
  progressColor?: string;
  cursorColor?: string;
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
}

/**
 * Creates a WaveSurfer instance with standardized configuration
 * @param config - WaveSurfer configuration options
 * @returns Configured WaveSurfer instance
 */
export const createWaveSurfer = (config: WaveSurferConfig): WaveSurfer => {
  const { container, type = 'recording', ...customConfig } = config;

  // Get base configuration
  const baseConfig = WAVEFORM_CONFIG.DEFAULT;
  
  // Get type-specific colors
  let typeConfig = {};
  switch (type) {
    case 'chat_user':
      typeConfig = WAVEFORM_CONFIG.CHAT_USER;
      break;
    case 'chat_assistant':
      typeConfig = WAVEFORM_CONFIG.CHAT_ASSISTANT;
      break;
    case 'recording':
      typeConfig = WAVEFORM_CONFIG.RECORDING;
      break;
    case 'tts_preview':
      typeConfig = WAVEFORM_CONFIG.TTS_PREVIEW;
      break;
  }

  // Merge configurations with custom config taking priority
  const finalConfig = {
    container,
    ...baseConfig,
    ...typeConfig,
    ...customConfig,
  };

  return WaveSurfer.create(finalConfig);
};

/**
 * Safely destroys a WaveSurfer instance with proper cleanup
 * @param wavesurfer - WaveSurfer instance to destroy
 * @param isCleaningUpRef - Ref to track cleanup state (optional)
 */
export const cleanupWaveSurfer = (
  wavesurfer: WaveSurfer | null,
  isCleaningUpRef?: React.MutableRefObject<boolean>
): void => {
  if (!wavesurfer) return;

  // Set cleanup flag if provided
  if (isCleaningUpRef) {
    if (isCleaningUpRef.current) return; // Already cleaning up
    isCleaningUpRef.current = true;
  }

  // Use setTimeout to avoid immediate destruction issues
  setTimeout(() => {
    try {
      if (wavesurfer && typeof wavesurfer.destroy === 'function') {
        wavesurfer.destroy();
      }
    } catch (error) {
      // Silent cleanup errors to avoid console spam
      console.warn('WaveSurfer cleanup error:', error);
    } finally {
      if (isCleaningUpRef) {
        isCleaningUpRef.current = false;
      }
    }
  }, 0);
};

/**
 * Sets up common WaveSurfer event handlers
 * @param wavesurfer - WaveSurfer instance
 * @param handlers - Event handler callbacks
 */
export interface WaveSurferEventHandlers {
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onFinish?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

export const setupWaveSurferEvents = (
  wavesurfer: WaveSurfer,
  handlers: WaveSurferEventHandlers
): void => {
  const { onReady, onPlay, onPause, onFinish, onTimeUpdate } = handlers;

  if (onReady) {
    wavesurfer.on('ready', onReady);
  }

  if (onPlay) {
    wavesurfer.on('play', onPlay);
  }

  if (onPause) {
    wavesurfer.on('pause', onPause);
  }

  if (onFinish) {
    wavesurfer.on('finish', onFinish);
  }

  if (onTimeUpdate) {
    wavesurfer.on('timeupdate', (currentTime: number) => {
      onTimeUpdate(currentTime);
    });
  }
};