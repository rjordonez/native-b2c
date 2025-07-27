import React from 'react';
import { Play, Pause } from 'phosphor-react';

interface PlayButtonProps {
  isPlaying: boolean;
  sender: 'user' | 'assistant';
  onClick: () => void;
}

export const PlayButton: React.FC<PlayButtonProps> = ({ isPlaying, sender, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
        sender === 'user'
          ? 'bg-blue-400 hover:bg-blue-300 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      }`}
    >
      {isPlaying ? (
        <Pause size={14} weight="fill" />
      ) : (
        <Play size={14} weight="fill" />
      )}
    </button>
  );
};