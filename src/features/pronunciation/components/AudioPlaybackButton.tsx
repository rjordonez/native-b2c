import React, { useState, useRef } from 'react';
import { Play, Pause } from 'phosphor-react';
import { Button } from '../../../shared/components/layout/ui/button';

interface AudioPlaybackButtonProps {
  audioUrl: string;
  startTime?: number;
  endTime?: number;
  label?: string;
}

export const AudioPlaybackButton: React.FC<AudioPlaybackButtonProps> = ({
  audioUrl,
  startTime,
  endTime,
  label = 'You'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.playbackRate = 0.75; // Slow down playback to 0.75x
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        if (endTime && audioRef.current && audioRef.current.currentTime >= endTime) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (startTime !== undefined) {
        audioRef.current.currentTime = startTime;
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <Button
      onClick={handlePlayPause}
      size="sm"
      variant="outline"
      className="flex items-center gap-2"
    >
      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      {label}
    </Button>
  );
};