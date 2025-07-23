import { useEffect, useState, useRef, useCallback } from 'react';

interface UseCountdownTimerProps {
  duration: number;
  onComplete: () => void;
  enabled: boolean;
  onStart?: () => void;
}

export const useCountdownTimer = ({ duration, onComplete, enabled, onStart }: UseCountdownTimerProps) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | undefined>(undefined);
  const onStartCalledRef = useRef(false);

  const reset = useCallback(() => {
    setProgress(100);
    setIsVisible(true);
    startTimeRef.current = undefined;
    onStartCalledRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      reset();
      return;
    }

    // Call onStart when timer begins
    if (onStart && !onStartCalledRef.current) {
      onStart();
      onStartCalledRef.current = true;
    }

    startTimeRef.current = Date.now();
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current!;
      const newProgress = Math.max(0, 100 - (elapsed / duration) * 100);
      
      setProgress(newProgress);
      
      if (newProgress === 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsVisible(false); // Hide the progress bar
        onComplete();
      }
    }, 50); // Update every 50ms for smooth animation

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, duration, onComplete, onStart]);

  return { progress, reset, isVisible };
};