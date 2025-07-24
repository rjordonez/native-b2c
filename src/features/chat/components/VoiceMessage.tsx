import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'phosphor-react';
import WaveSurfer from 'wavesurfer.js';
import { PronunciationText } from '../../../shared/components/ui/PronunciationText';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectAutoPlayMessageId, clearAutoPlayMessageId, selectCurrentlyPlayingMessageId, setCurrentlyPlayingMessageId } from '../store/audioPlaybackSlice';
import { formatDuration, createWaveSurfer, cleanupWaveSurfer, setupWaveSurferEvents } from '@/shared/utils/audio';

interface VoiceMessageProps {
  messageId: string;
  audioUrl?: string;
  audioData?: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  formatTimestamp: (timestamp: string) => string;
  isTopicQuestion?: boolean; // For auto-playing topic questions
  transcription?: {
    text: string;
    isLoading: boolean;
    confidence?: number;
  };
  pronunciation?: {
    words: Array<{
      text: string;
      score?: number;
      phonemes?: Array<{
        phoneme: string;
        score: number;
      }>;
    }>;
    overallScore: number;
    accuracy: number;
    fluency: number;
    completeness: number;
    isLoading: boolean;
    error?: string;
  };
  onEnhanceTranscript?: (transcript: string) => void;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({
  messageId,
  audioUrl,
  audioData,
  sender,
  timestamp,
  formatTimestamp,
  isTopicQuestion = false,
  transcription,
  pronunciation,
  onEnhanceTranscript
}) => {
  const dispatch = useAppDispatch();
  const autoPlayMessageId = useAppSelector(selectAutoPlayMessageId);
  const currentlyPlayingMessageId = useAppSelector(selectCurrentlyPlayingMessageId);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);


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
      
      const wavesurfer = createWaveSurfer({
        container: waveformRef.current,
        type: sender === 'user' ? 'chat_user' : 'chat_assistant',
        height: 24,
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
        dispatch(setCurrentlyPlayingMessageId(messageId));
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
        dispatch(setCurrentlyPlayingMessageId(null));
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
        
        // Auto-play only if this message is marked for autoplay
        if (autoPlayMessageId === messageId) {
          console.log('Auto-playing topic question audio for message:', messageId);
          setTimeout(() => {
            wavesurfer.play();
            // Clear the autoplay flag after playing
            dispatch(clearAutoPlayMessageId());
          }, 500); // Small delay to ensure audio is fully loaded
        }
      });

    }

    return () => {
      // Cleanup function - will run when component unmounts or dependencies change
      cleanupWaveSurfer(wavesurferRef.current);
      wavesurferRef.current = null;
    };
  }, [audioData, audioUrl, sender]);

  // Watch for autoplay changes
  useEffect(() => {
    if (autoPlayMessageId === messageId && wavesurferRef.current && wavesurferRef.current.isReady) {
      console.log('Auto-playing topic question audio for message (from effect):', messageId);
      setTimeout(() => {
        if (wavesurferRef.current) {
          wavesurferRef.current.play();
          // Clear the autoplay flag after playing
          dispatch(clearAutoPlayMessageId());
        }
      }, 500); // Small delay to ensure smooth playback
    }
  }, [autoPlayMessageId, messageId, dispatch]);

  // Pause this message if another message starts playing
  useEffect(() => {
    if (currentlyPlayingMessageId && currentlyPlayingMessageId !== messageId && isPlaying && wavesurferRef.current) {
      console.log(`Pausing message ${messageId} because message ${currentlyPlayingMessageId} started playing`);
      wavesurferRef.current.pause();
    }
  }, [currentlyPlayingMessageId, messageId, isPlaying]);

  // Play/pause audio with Wavesurfer
  const handlePlayPause = () => {
    if (!wavesurferRef.current) return;
    
    // If currently playing and user pauses, clear the global playing state
    if (isPlaying && currentlyPlayingMessageId === messageId) {
      dispatch(setCurrentlyPlayingMessageId(null));
    }
    
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
            {transcription.isLoading || (pronunciation && pronunciation.isLoading) ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
                <span className="text-sm text-gray-500">
                  {transcription.isLoading ? 'Transcribing audio...' : 'Analyzing pronunciation...'}
                </span>
              </div>
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                {/* Show pronunciation-colored text if available, otherwise plain text */}
                {pronunciation && pronunciation.words.length > 0 && !pronunciation.error && !pronunciation.isLoading ? (
                  <div className="text-sm leading-relaxed">
                    <PronunciationText 
                      words={pronunciation.words}
                      showScoring={sender === 'user'} // Only show scoring for user messages
                      className=""
                      wordClassName="text-sm"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {transcription.text}
                  </p>
                )}
                
                {/* Enhanced transcript button */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => onEnhanceTranscript?.(transcription.text)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Enhanced
                  </button>
                </div>
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