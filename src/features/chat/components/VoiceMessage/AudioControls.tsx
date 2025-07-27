import React, { useState } from 'react';
import { PlayButton } from './PlayButton';
import { Waveform } from './Waveform';

interface AudioControlsProps {
  sender: 'user' | 'assistant';
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  waveformRef: React.RefObject<HTMLDivElement | null>;
  onPlayPause: () => void;
  content?: string;
  isTopicQuestion?: boolean;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  sender,
  isPlaying,
  currentTime,
  totalDuration,
  waveformRef,
  onPlayPause,
  content,
  isTopicQuestion
}) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const isAI = sender === 'assistant';

  return (
    <div
      className={`rounded-2xl overflow-hidden ${
        sender === 'user'
          ? 'bg-blue-500 text-white rounded-br-sm'
          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
      }`}
      style={{ width: 'fit-content', minWidth: '280px', maxWidth: '320px' }}
    >
      <div className="px-4 py-3">
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
          {/* Transcript icon for AI messages */}
          {isAI && content && (
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Show transcript"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none"
                className={`transition-colors ${showTranscript ? 'text-gray-500' : 'text-gray-400'}`}
              >
                <rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor" />
                <rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor" />
                <rect x="2" y="11" width="8" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Transcript section with animation */}
      {isAI && content && (
        <div 
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            showTranscript ? 'grid-rows-1' : 'grid-rows-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-3 text-sm text-gray-600">
              <p className="break-words overflow-y-auto max-h-32">{content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};