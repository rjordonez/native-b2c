import React from 'react';
import { Play, Pause } from 'phosphor-react';
import { formatDuration } from '@/shared/utils/audio';

interface PlayControlsProps {
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  waveformRef: React.RefObject<HTMLDivElement>;
  onPlayPause: () => void;
}

export const PlayControls: React.FC<PlayControlsProps> = ({
  isPlaying,
  currentTime,
  totalDuration,
  waveformRef,
  onPlayPause
}) => {
  return (
    <>
      {/* Play/Pause button */}
      <button
        onClick={onPlayPause}
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
        style={{ aspectRatio: '1 / 1' }}
      >
        {isPlaying ? (
          <Pause size={16} weight="fill" />
        ) : (
          <Play size={16} weight="fill" />
        )}
      </button>

      {/* Wavesurfer Waveform */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          ref={waveformRef}
          className="w-40 h-8"
          style={{ minWidth: '160px' }}
        />
      </div>

      {/* Duration */}
      <span className="text-xs text-gray-500 mx-2">
        {formatDuration(currentTime)} / {formatDuration(totalDuration)}
      </span>
    </>
  );
};