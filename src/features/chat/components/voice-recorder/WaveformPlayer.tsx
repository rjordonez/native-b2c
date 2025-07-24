import React, { useRef, useEffect, useState } from 'react';
import { X, ArrowRight, Play, Pause } from 'phosphor-react';
import WaveSurfer from 'wavesurfer.js';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  selectAudioUrl,
  selectAudioData,
  selectMimeType,
  startTranscription,
  transcribeAudio,
  transcribeWithPronunciation
} from '../../store/voiceRecordingSlice';
import {
  selectActiveConversationId,
  addUserMessage,
  sendMessage
} from '../../store/conversationSlice';
import { formatDuration, createWaveSurfer, cleanupWaveSurfer, setupWaveSurferEvents } from '@/shared/utils/audio';

interface WaveformPlayerProps {
  onClear: () => void;
}

const WaveformPlayer: React.FC<WaveformPlayerProps> = ({ onClear }) => {
  const dispatch = useAppDispatch();
  const audioUrl = useAppSelector(selectAudioUrl);
  const audioData = useAppSelector(selectAudioData);
  const mimeType = useAppSelector(selectMimeType);
  const activeConversationId = useAppSelector(selectActiveConversationId);
  
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const isCleaningUpRef = useRef(false);
  
  // Local state for UI-only values from WaveSurfer
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [, forceUpdate] = useState({});


  // Initialize Wavesurfer when audioUrl is available
  useEffect(() => {
    if (audioUrl && waveformRef.current && !wavesurferRef.current) {
      const wavesurfer = createWaveSurfer({
        container: waveformRef.current,
        type: 'recording',
        height: 32,
      });

      wavesurfer.load(audioUrl);
      wavesurferRef.current = wavesurfer;

      // Setup common WaveSurfer events
      setupWaveSurferEvents(wavesurfer, {
        onPlay: () => forceUpdate({}),
        onPause: () => forceUpdate({}),
        onFinish: () => {
          setCurrentTime(0);
          forceUpdate({});
        },
        onTimeUpdate: (time: number) => setCurrentTime(time),
        onReady: () => setTotalDuration(wavesurfer.getDuration()),
      });
    }

    return () => {
      cleanupWaveSurfer(wavesurferRef.current, isCleaningUpRef);
      wavesurferRef.current = null;
    };
  }, [audioUrl, dispatch]);

  // Play/pause audio with Wavesurfer
  const handlePlayPause = () => {
    if (!wavesurferRef.current) return;
    
    wavesurferRef.current.playPause();
  };


  // Clear recording and reset
  const handleClear = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (wavesurferRef.current && !isCleaningUpRef.current) {
      isCleaningUpRef.current = true;
      const instance = wavesurferRef.current;
      wavesurferRef.current = null;
      
      // Cleanup asynchronously
      setTimeout(() => {
        try {
          if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
          }
        } catch (error) {
          // Silently ignore cleanup errors
        } finally {
          isCleaningUpRef.current = false;
        }
      }, 0);
    }
    onClear();
  };

  // Send voice message
  const handleSend = () => {
    if (!activeConversationId || !audioData) {
      return;
    }

    // Generate unique message ID for tracking transcription
    const messageId = `msg-${Date.now()}-user`;

    // Add voice message to chat with the generated ID
    dispatch(addUserMessage({
      conversationId: activeConversationId,
      content: 'Voice message',
      audioData: audioData || undefined,
      messageId
    }));

    // Start transcription + pronunciation analysis process immediately
    dispatch(startTranscription({ messageId }));
    dispatch(transcribeWithPronunciation({
      messageId,
      audioData: audioData,
      contentType: mimeType || 'audio/webm' // Use actual MIME type from recording
    }));

    // Send to AI (simulate)
    dispatch(sendMessage({
      conversationId: activeConversationId,
      content: 'Voice message',
      audioData: audioData || undefined
    }));

    // Clear recording without revoking URL (needed for chat message)
    if (wavesurferRef.current && !isCleaningUpRef.current) {
      isCleaningUpRef.current = true;
      const instance = wavesurferRef.current;
      wavesurferRef.current = null;
      
      // Cleanup asynchronously
      setTimeout(() => {
        try {
          if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
          }
        } catch (error) {
          // Silently ignore cleanup errors
        } finally {
          isCleaningUpRef.current = false;
        }
      }, 0);
    }
    onClear();
  };

  // Get play state directly from WaveSurfer
  const isPlaying = wavesurferRef.current?.isPlaying() || false;

  return (
    <div className="flex items-center justify-between w-full max-w-md px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm">
      {/* Play/Pause button */}
      <button
        onClick={handlePlayPause}
        className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 transition-colors"
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

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {/* Clear button */}
        <button
          onClick={handleClear}
          className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 transition-colors"
          title="Clear recording"
        >
          <X size={16} />
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
          title="Send voice message"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default WaveformPlayer;