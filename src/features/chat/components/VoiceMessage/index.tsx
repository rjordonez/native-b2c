import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { 
  selectAutoPlayMessageId, 
  clearAutoPlayMessageId, 
  selectCurrentlyPlayingMessageId, 
  setCurrentlyPlayingMessageId 
} from '../../store/audioPlaybackSlice';
import { createWaveSurfer, cleanupWaveSurfer } from '@/shared/utils/audio';
import { MessageContainer } from './MessageContainer';
import { AudioControls } from './AudioControls';
import { TranscriptionSection } from './TranscriptionSection';

interface VoiceMessageProps {
  messageId: string;
  audioUrl?: string;
  audioData?: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  formatTimestamp: (timestamp: string) => string;
  isTopicQuestion?: boolean; // For auto-playing topic questions
  content?: string; // For AI transcript display
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
  content,
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
      wavesurfer.on('error', () => {
        // Silently handle wavesurfer errors
        // Clean up on error
        if (wavesurferRef.current === wavesurfer) {
          wavesurferRef.current = null;
        }
      });

      try {
        wavesurfer.load(audioSource);
        wavesurferRef.current = wavesurfer;
      } catch (error) {
        // Failed to load audio - user will see waveform UI disabled
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
  }, [audioData, audioUrl, sender, messageId, autoPlayMessageId, dispatch]);

  // Watch for autoplay changes
  useEffect(() => {
    if (autoPlayMessageId === messageId && wavesurferRef.current) {
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
    <MessageContainer sender={sender}>
      <AudioControls
        sender={sender}
        isPlaying={isPlaying}
        currentTime={currentTime}
        totalDuration={totalDuration}
        waveformRef={waveformRef}
        onPlayPause={handlePlayPause}
        content={content}
        isTopicQuestion={isTopicQuestion}
      />

      <TranscriptionSection
        sender={sender}
        transcription={transcription}
        pronunciation={pronunciation}
        onEnhanceTranscript={onEnhanceTranscript}
      />
      
      {/* Timestamp */}
      <span className="text-xs text-gray-500 mt-1 px-1">
        {formatTimestamp(timestamp)}
      </span>
    </MessageContainer>
  );
};

export default VoiceMessage;