import React, { RefObject } from 'react';
import { formatDuration } from '@/shared/utils/audio';

interface WaveformProps {
  waveformRef: RefObject<HTMLDivElement>;
  currentTime: number;
  totalDuration: number;
  sender: 'user' | 'assistant';
}

export const Waveform: React.FC<WaveformProps> = ({ 
  waveformRef, 
  currentTime, 
  totalDuration, 
  sender 
}) => {
  return (
    <>
      {/* Waveform */}
      <div className="flex items-center">
        <div 
          ref={waveformRef}
          className="w-32 h-6"
          style={{ minWidth: '128px' }}
        />
      </div>

      {/* Duration */}
      <span className={`text-xs ${sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
        {formatDuration(currentTime)} / {formatDuration(totalDuration)}
      </span>
    </>
  );
};