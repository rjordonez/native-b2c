/**
 * Formats duration in seconds to MM:SS format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "1:30", "0:05")
 */
export const formatDuration = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Creates a standardized HTML audio element with common configuration
 * @param src - Audio source URL
 * @param playbackRate - Playback speed (default: 1.0)
 * @returns Configured HTMLAudioElement
 */
export const createAudioElement = (src: string, playbackRate: number = 1.0): HTMLAudioElement => {
  const audio = new Audio(src);
  audio.playbackRate = playbackRate;
  audio.preload = 'metadata';
  return audio;
};

/**
 * Creates an object URL from a blob and tracks it for cleanup
 * @param blob - Audio blob
 * @returns Object URL string
 */
export const createAudioUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

/**
 * Safely cleans up an audio object URL
 * @param url - Object URL to revoke
 */
export const cleanupAudioUrl = (url: string): void => {
  try {
    URL.revokeObjectURL(url);
  } catch (error) {
    // Silently handle cleanup errors
    console.warn('Failed to cleanup audio URL:', error);
  }
};

/**
 * Safely cleans up multiple audio URLs
 * @param urls - Array of object URLs to revoke
 */
export const cleanupAudioUrls = (urls: string[]): void => {
  urls.forEach(cleanupAudioUrl);
};