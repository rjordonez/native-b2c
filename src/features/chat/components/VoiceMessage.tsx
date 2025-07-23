import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'phosphor-react';
import WaveSurfer from 'wavesurfer.js';

interface VoiceMessageProps {
  audioUrl: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  formatTimestamp: (timestamp: string) => string;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({
  audioUrl,
  sender,
  timestamp,
  formatTimestamp
}) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize Wavesurfer when component mounts
  useEffect(() => {
    if (audioUrl && waveformRef.current && !wavesurferRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: sender === 'user' ? '#d1d5db' : '#e5e7eb',
        progressColor: sender === 'user' ? '#4F46E5' : '#6B7280',
        height: 24,
        barWidth: 1,
        barGap: 1,
        barRadius: 1,
      });

      wavesurfer.load(audioUrl);
      wavesurferRef.current = wavesurfer;

      // Handle play/pause events
      wavesurfer.on('play', () => {
        setIsPlaying(true);
      });

      wavesurfer.on('pause', () => {
        setIsPlaying(false);
      });

      wavesurfer.on('finish', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      // Track current time during playback
      wavesurfer.on('timeupdate', (time) => {
        setCurrentTime(time);
      });

      // Get total duration when ready
      wavesurfer.on('ready', () => {
        setTotalDuration(wavesurfer.getDuration());
      });
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [audioUrl, sender]);

  // Play/pause audio with Wavesurfer
  const handlePlayPause = () => {
    if (!wavesurferRef.current) return;
    
    wavesurferRef.current.playPause();
  };

  return (
    <div className={`flex items-start gap-3 ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-xs lg:max-w-md ${sender === 'user' ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            sender === 'user'
              ? 'bg-blue-500 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Play/Pause button */}
            <button
              onClick={handlePlayPause}
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
          </div>
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-gray-500 mt-1 px-1">
          {formatTimestamp(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default VoiceMessage;