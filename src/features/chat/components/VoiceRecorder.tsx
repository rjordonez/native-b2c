import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowRight, Play, Pause } from 'phosphor-react';
import WaveSurfer from 'wavesurfer.js';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectRecordingState,
  selectAudioUrl,
  selectAudioData,
  selectRecordingDuration,
  selectActiveConversationId,
  startRecording,
  stopRecording,
  playRecording,
  pauseRecording,
  clearRecording,
  updateRecordingDuration,
  addUserMessage,
  sendMessage
} from '../chatSlice';

const VoiceRecorder: React.FC = () => {
  const dispatch = useAppDispatch();
  const recordingState = useAppSelector(selectRecordingState);
  const audioUrl = useAppSelector(selectAudioUrl);
  const audioData = useAppSelector(selectAudioData);
  const recordingDuration = useAppSelector(selectRecordingDuration);
  const activeConversationId = useAppSelector(selectActiveConversationId);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isWaveformPlaying, setIsWaveformPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize media recorder
  const initializeRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Convert blob to base64 for persistent storage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          
          dispatch(stopRecording({
            audioUrl,
            audioData: base64Data, // Store base64 data for persistence
            duration: recordingDuration
          }));
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      return false;
    }
  };

  // Start recording when space is pressed
  const handleMouseDown = async () => {
    if (recordingState !== 'idle') return;
    
    setIsPressed(true);
    const success = await initializeRecorder();
    
    if (success && mediaRecorderRef.current) {
      dispatch(startRecording());
      mediaRecorderRef.current.start();
      
      // Start timer
      let duration = 0;
      recordingTimerRef.current = setInterval(() => {
        duration += 1;
        dispatch(updateRecordingDuration(duration));
      }, 1000);
    }
  };

  // Stop recording when space is released
  const handleMouseUp = () => {
    if (recordingState !== 'recording') return;
    
    setIsPressed(false);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat && recordingState === 'idle') {
        event.preventDefault();
        handleMouseDown();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space' && recordingState === 'recording') {
        event.preventDefault();
        handleMouseUp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [recordingState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Initialize Wavesurfer when audioUrl is available
  useEffect(() => {
    if (audioUrl && waveformRef.current && !wavesurferRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#d1d5db',
        progressColor: '#4F46E5',
        height: 32,
        barWidth: 1,
        barGap: 1,
        barRadius: 1,
      });

      wavesurfer.load(audioUrl);
      wavesurferRef.current = wavesurfer;

      // Handle play/pause events
      wavesurfer.on('play', () => {
        setIsWaveformPlaying(true);
        dispatch(playRecording());
      });

      wavesurfer.on('pause', () => {
        setIsWaveformPlaying(false);
        dispatch(pauseRecording());
      });

      wavesurfer.on('finish', () => {
        setIsWaveformPlaying(false);
        dispatch(pauseRecording());
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
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
    setIsWaveformPlaying(false);
    setCurrentTime(0);
    setTotalDuration(0);
    dispatch(clearRecording());
  };

  // Send voice message
  const handleSend = () => {
    if (!activeConversationId || !audioData) {
      return;
    }


    // Add voice message to chat (only use audioData for persistence)
    dispatch(addUserMessage({
      conversationId: activeConversationId,
      content: 'Voice message',
      audioData: audioData || undefined
    }));

    // Send to AI (simulate)
    dispatch(sendMessage({
      conversationId: activeConversationId,
      content: 'Voice message',
      audioData: audioData || undefined
    }));

    // Clear recording without revoking URL (needed for chat message)
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
    setIsWaveformPlaying(false);
    setCurrentTime(0);
    setTotalDuration(0);
    dispatch(clearRecording());
  };

  // Update play button state based on Wavesurfer or Redux state
  const isPlaying = isWaveformPlaying || recordingState === 'playing';

  // Render different states
  if (recordingState === 'idle') {
    return (
      <div className="flex items-center justify-center w-full max-w-md px-6 py-2 bg-white border border-gray-300 rounded-full shadow-sm">
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // Stop recording if mouse leaves
          className={`flex items-center justify-center w-full transition-colors ${
            isPressed ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
        >
          <span className="inline-block px-2 py-1 mr-2 text-xs font-semibold uppercase bg-gray-100 border border-gray-400 rounded">
            SPACE
          </span>
          <span className="text-sm text-gray-600">Press and hold to talk</span>
        </button>
      </div>
    );
  }

  if (recordingState === 'recording') {
    return (
      <div className="flex items-center justify-center w-full max-w-md px-6 py-2 bg-red-50 border border-red-300 rounded-full shadow-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-600 font-medium">
            Release to finish • {formatDuration(recordingDuration)}
          </span>
        </div>
      </div>
    );
  }

  if (recordingState === 'recorded' || recordingState === 'playing') {
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
  }

  return null;
};

export default VoiceRecorder;