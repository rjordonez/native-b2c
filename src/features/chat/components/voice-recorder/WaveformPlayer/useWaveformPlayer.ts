import { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useAppDispatch } from '../../../../../store/hooks';
import { createWaveSurfer, cleanupWaveSurfer, setupWaveSurferEvents } from '@/shared/utils/audio';

export const useWaveformPlayer = (audioUrl: string | null) => {
  const dispatch = useAppDispatch();
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const isCleaningUpRef = useRef(false);
  
  // Local state for UI-only values from WaveSurfer
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [, forceUpdate] = useState({});

  // Initialize Wavesurfer when audioUrl is available
  useEffect(() => {
    if (audioUrl && waveformRef.current && !wavesurferRef.current) {
      const wavesurfer = createWaveSurfer({
        container: waveformRef.current,
        type: 'recording',
        height: 32,
      });

      wavesurfer.load(audioUrl);
      wavesurferRef.current = wavesurfer;

      // Setup common WaveSurfer events
      setupWaveSurferEvents(wavesurfer, {
        onPlay: () => forceUpdate({}),
        onPause: () => forceUpdate({}),
        onFinish: () => {
          setCurrentTime(0);
          forceUpdate({});
        },
        onTimeUpdate: (time: number) => setCurrentTime(time),
        onReady: () => setTotalDuration(wavesurfer.getDuration()),
      });
    }

    return () => {
      cleanupWaveSurfer(wavesurferRef.current, isCleaningUpRef);
      wavesurferRef.current = null;
    };
  }, [audioUrl, dispatch]);

  // Play/pause audio with Wavesurfer
  const handlePlayPause = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
  };

  // Get play state directly from WaveSurfer
  const isPlaying = wavesurferRef.current?.isPlaying() || false;

  // Cleanup function
  const cleanupWaveform = () => {
    if (wavesurferRef.current && !isCleaningUpRef.current) {
      isCleaningUpRef.current = true;
      const instance = wavesurferRef.current;
      wavesurferRef.current = null;
      
      // Cleanup asynchronously
      setTimeout(() => {
        try {
          if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
          }
        } catch (error) {
          // Silently ignore cleanup errors
        } finally {
          isCleaningUpRef.current = false;
        }
      }, 0);
    }
  };

  return {
    waveformRef,
    currentTime,
    totalDuration,
    isPlaying,
    handlePlayPause,
    cleanupWaveform
  };
};