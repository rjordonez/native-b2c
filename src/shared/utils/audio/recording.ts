import { RECORDING_CONSTRAINTS, MIME_TYPES } from './constants';

/**
 * Get standardized audio recording constraints
 * @param customConstraints - Optional custom constraints to override defaults
 * @returns MediaStreamConstraints for audio recording
 */
export const getAudioConstraints = (customConstraints?: MediaTrackConstraints): MediaStreamConstraints => {
  return {
    audio: {
      ...RECORDING_CONSTRAINTS.audio,
      ...customConstraints,
    }
  };
};

/**
 * Initialize MediaRecorder with standardized configuration
 * @param stream - MediaStream to record
 * @param mimeType - Optional MIME type (defaults to webm)
 * @returns Configured MediaRecorder instance
 */
export const initializeMediaRecorder = (
  stream: MediaStream, 
  mimeType: string = MIME_TYPES.WEBM
): MediaRecorder => {
  return new MediaRecorder(stream, { mimeType });
};

/**
 * Start audio recording with standardized setup
 * @param constraints - Optional custom audio constraints
 * @returns Promise<{ stream: MediaStream, mediaRecorder: MediaRecorder }>
 */
export const startAudioRecording = async (
  constraints?: MediaTrackConstraints
): Promise<{ stream: MediaStream, mediaRecorder: MediaRecorder }> => {
  const stream = await navigator.mediaDevices.getUserMedia(
    getAudioConstraints(constraints)
  );
  
  const mediaRecorder = initializeMediaRecorder(stream);
  
  return { stream, mediaRecorder };
};

/**
 * Stop all tracks in a MediaStream
 * @param stream - MediaStream to stop
 */
export const stopMediaStream = (stream: MediaStream): void => {
  stream.getTracks().forEach(track => track.stop());
};

/**
 * Common MediaRecorder event handlers setup
 * @param mediaRecorder - MediaRecorder instance
 * @param handlers - Event handler callbacks
 */
export interface MediaRecorderEventHandlers {
  onDataAvailable?: (event: BlobEvent) => void;
  onStop?: () => void;
  onStart?: () => void;
  onError?: (event: Event) => void;
}

export const setupMediaRecorderEvents = (
  mediaRecorder: MediaRecorder,
  handlers: MediaRecorderEventHandlers
): void => {
  const { onDataAvailable, onStop, onStart, onError } = handlers;

  if (onDataAvailable) {
    mediaRecorder.ondataavailable = onDataAvailable;
  }

  if (onStop) {
    mediaRecorder.onstop = onStop;
  }

  if (onStart) {
    mediaRecorder.onstart = onStart;
  }

  if (onError) {
    mediaRecorder.onerror = onError;
  }
};