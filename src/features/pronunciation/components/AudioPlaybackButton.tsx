import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'phosphor-react';
import { Button } from '../../../shared/components/layout/ui/button';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { setCurrentlyPlayingMessageId, selectCurrentlyPlayingMessageId } from '../../chat/store/audioPlaybackSlice';

interface AudioPlaybackButtonProps {
  audioUrl: string;
  startTime?: number;
  endTime?: number;
  label?: string;
  playbackRate?: number;
}

export const AudioPlaybackButton: React.FC<AudioPlaybackButtonProps> = ({
  audioUrl,
  startTime,
  endTime,
  label = 'You',
  playbackRate = 0.75
}) => {
  const dispatch = useAppDispatch();
  const currentlyPlayingMessageId = useAppSelector(selectCurrentlyPlayingMessageId);
  
  // Create unique ID for this audio instance
  const audioId = `pronunciation-${audioUrl}-${startTime || 0}-${endTime || 0}`;
  const isPlaying = currentlyPlayingMessageId === audioId;
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-pause when another audio starts playing globally
  useEffect(() => {
    if (currentlyPlayingMessageId && currentlyPlayingMessageId !== audioId && audioRef.current) {
      console.log(`Pausing pronunciation audio ${audioId} because ${currentlyPlayingMessageId} started playing`);
      audioRef.current.pause();
    }
  }, [currentlyPlayingMessageId, audioId]);

  const handlePlayPause = () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.playbackRate = playbackRate; // Use configurable playback rate
      
      audioRef.current.addEventListener('ended', () => {
        dispatch(setCurrentlyPlayingMessageId(null));
      });

      audioRef.current.addEventListener('timeupdate', () => {
        if (endTime && audioRef.current && audioRef.current.currentTime >= endTime) {
          audioRef.current.pause();
          dispatch(setCurrentlyPlayingMessageId(null));
        }
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      dispatch(setCurrentlyPlayingMessageId(null));
    } else {
      if (startTime !== undefined) {
        audioRef.current.currentTime = startTime;
      }
      audioRef.current.play();
      dispatch(setCurrentlyPlayingMessageId(audioId));
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