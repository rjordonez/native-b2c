import React from 'react';
import { PlayButton } from './PlayButton';
import { Waveform } from './Waveform';

interface AudioControlsProps {
  sender: 'user' | 'assistant';
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  waveformRef: React.RefObject<HTMLDivElement | null>;
  onPlayPause: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  sender,
  isPlaying,
  currentTime,
  totalDuration,
  waveformRef,
  onPlayPause
}) => {
  return (
    <div
      className={`px-4 py-3 rounded-2xl ${
        sender === 'user'
          ? 'bg-blue-500 text-white rounded-br-sm'
          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <PlayButton 
          isPlaying={isPlaying} 
          sender={sender} 
          onClick={onPlayPause} 
        />
        <Waveform
          waveformRef={waveformRef}
          currentTime={currentTime}
          totalDuration={totalDuration}
          sender={sender}
        />
      </div>
    </div>
  );
};