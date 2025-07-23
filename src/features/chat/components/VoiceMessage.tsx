import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'phosphor-react';
import WaveSurfer from 'wavesurfer.js';

interface VoiceMessageProps {
  audioUrl?: string;
  audioData?: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  formatTimestamp: (timestamp: string) => string;
  transcription?: {
    text: string;
    isLoading: boolean;
    confidence?: number;
  };
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({
  audioUrl,
  audioData,
  sender,
  timestamp,
  formatTimestamp,
  transcription
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
    // Cleanup any existing wavesurfer first
    if (wavesurferRef.current) {
      try {
        wavesurferRef.current.destroy();
      } catch (error) {
        // Ignore cleanup errors
      }
      wavesurferRef.current = null;
    }

    // For chat messages, prioritize audioData (base64) over audioUrl (temporary blob)
    const audioSource = audioData || audioUrl;
    
    if (audioSource && waveformRef.current) {
      
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: sender === 'user' ? '#ffffff' : '#e5e7eb',
        progressColor: sender === 'user' ? '#d1d5db' : '#6B7280',
        height: 24,
        barWidth: 1,
        barGap: 1,
        barRadius: 1,
      });

      // Add error handling
      wavesurfer.on('error', (error) => {
        console.warn('Wavesurfer error:', error);
        // Clean up on error
        if (wavesurferRef.current === wavesurfer) {
          wavesurferRef.current = null;
        }
      });

      try {
        wavesurfer.load(audioSource);
        wavesurferRef.current = wavesurfer;
      } catch (error) {
        console.warn('Failed to load audio:', error);
        wavesurfer.destroy();
        return;
      }

      // Handle play/pause events
      wavesurfer.on('play', () => {
        setIsPlaying(true);
        // Update progress color when playing for user messages
        if (sender === 'user') {
          wavesurfer.setOptions({ progressColor: '#ffffff' });
        }
      });

      wavesurfer.on('pause', () => {
        setIsPlaying(false);
      });

      wavesurfer.on('finish', () => {
        setIsPlaying(false);
        setCurrentTime(0);
        // Reset progress color when finished for user messages
        if (sender === 'user') {
          wavesurfer.setOptions({ progressColor: '#d1d5db' });
        }
      });

      // Track current time during playback
      wavesurfer.on('timeupdate', (time) => {
        setCurrentTime(time);
      });

      // Get total duration when ready
      wavesurfer.on('ready', () => {
        const duration = wavesurfer.getDuration();
        setTotalDuration(duration);
      });

    }

    return () => {
      // Cleanup function - will run when component unmounts or dependencies change
      if (wavesurferRef.current) {
        const instance = wavesurferRef.current;
        wavesurferRef.current = null; // Clear reference first
        
        // Cleanup asynchronously to avoid blocking
        setTimeout(() => {
          try {
            instance.destroy();
          } catch (error) {
            // Ignore AbortError and other cleanup errors
          }
        }, 0);
      }
    };
  }, [audioData, audioUrl, sender]);

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

        {/* Transcription Section */}
        {transcription && (
          <div className={`mt-2 max-w-xs lg:max-w-md ${sender === 'user' ? 'text-right' : 'text-left'}`}>
            {transcription.isLoading ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
                <span className="text-sm text-gray-500">Transcribing audio...</span>
              </div>
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {transcription.text}
                </p>
                {transcription.confidence && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">Transcription</span>
                    <span className="text-xs text-gray-400">
                      {Math.round(transcription.confidence * 100)}% confidence
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Timestamp */}
        <span className="text-xs text-gray-500 mt-1 px-1">
          {formatTimestamp(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default VoiceMessage;