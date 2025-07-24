import React, { useState, useEffect, useRef } from 'react';
import { X, Gear, Play, Pause, CircleNotch } from 'phosphor-react';
import WaveSurfer from 'wavesurfer.js';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectTtsSpeed, selectTtsVoice, setTtsSpeed, setTtsVoice } from '../store/audioPlaybackSlice';

interface TtsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const voiceOptions = [
  { label: 'Journey (Female)', value: 'en-US-Journey-F' },
  { label: 'Journey (Male)', value: 'en-US-Journey-D' },
  { label: 'Neural2 (Female)', value: 'en-US-Neural2-A' },
  { label: 'Neural2 (Male)', value: 'en-US-Neural2-D' },
  { label: 'Standard (Female)', value: 'en-US-Standard-C' },
  { label: 'Standard (Male)', value: 'en-US-Standard-B' },
];

const TtsConfigModal: React.FC<TtsConfigModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const ttsSpeed = useAppSelector(selectTtsSpeed);
  const ttsVoice = useAppSelector(selectTtsVoice);
  
  // Local state for temporary changes
  const [tempSpeed, setTempSpeed] = useState(ttsSpeed);
  const [tempVoice, setTempVoice] = useState(ttsVoice);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  
  const sampleText = "Hello! This is a preview of the selected voice.";
  
  // Format duration for display
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSpeed(ttsSpeed);
      setTempVoice(ttsVoice);
      // Clean up any existing wavesurfer
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
      setPreviewAudioUrl(null);
      setIsPlayingPreview(false);
      setCurrentTime(0);
      setTotalDuration(0);
    }
  }, [isOpen, ttsSpeed, ttsVoice]);

  // Clear preview when settings change
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
    setPreviewAudioUrl(null);
    setIsPlayingPreview(false);
    setCurrentTime(0);
    setTotalDuration(0);
  }, [tempSpeed, tempVoice]);

  const handleApply = () => {
    dispatch(setTtsSpeed(tempSpeed));
    dispatch(setTtsVoice(tempVoice));
    onClose();
  };

  const handleCancel = () => {
    // Clean up wavesurfer
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
    // Reset to original values
    setTempSpeed(ttsSpeed);
    setTempVoice(ttsVoice);
    onClose();
  };

  const generatePreview = async () => {
    setIsGeneratingPreview(true);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sampleText,
          voiceName: tempVoice,
          speakingRate: tempSpeed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const result = await response.json();
      
      if (result.success && result.data.audioUrl && waveformRef.current) {
        setPreviewAudioUrl(result.data.audioUrl);
        
        // Destroy any existing wavesurfer instance
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
        
        // Create new wavesurfer instance
        const wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: '#9ca3af',
          progressColor: '#6b7280',
          height: 24,
          barWidth: 1,
          barGap: 1,
          barRadius: 1,
          normalize: true,
          backend: 'WebAudio',
        });
        
        wavesurferRef.current = wavesurfer;
        
        // Set up event handlers
        wavesurfer.on('ready', () => {
          const duration = wavesurfer.getDuration();
          setTotalDuration(duration);
          wavesurfer.play();
          setIsPlayingPreview(true);
        });
        
        wavesurfer.on('play', () => {
          setIsPlayingPreview(true);
        });
        
        wavesurfer.on('pause', () => {
          setIsPlayingPreview(false);
        });
        
        wavesurfer.on('finish', () => {
          setIsPlayingPreview(false);
          setCurrentTime(0);
        });
        
        wavesurfer.on('timeupdate', (time) => {
          setCurrentTime(time);
        });
        
        wavesurfer.on('error', (error) => {
          setIsPlayingPreview(false);
          console.error('Failed to play preview audio:', error);
        });
        
        // Load the audio
        wavesurfer.load(result.data.audioUrl);
      }
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const togglePreviewPlayback = async () => {
    if (!previewAudioUrl || !wavesurferRef.current) {
      // Generate and play preview
      await generatePreview();
    } else if (wavesurferRef.current) {
      if (isPlayingPreview) {
        wavesurferRef.current.pause();
        setIsPlayingPreview(false);
      } else {
        wavesurferRef.current.play();
        setIsPlayingPreview(true);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="fixed top-20 right-4 bg-white rounded-lg shadow-xl z-50 w-80">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gear size={20} className="text-gray-600" />
              <h3 className="text-lg font-semibold">Voice Configuration</h3>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice
            </label>
            <select
              value={tempVoice}
              onChange={(e) => setTempVoice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {voiceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Speed Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speaking Rate
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={tempSpeed}
                onChange={(e) => setTempSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0.5x</span>
                <span className="font-medium text-gray-700">{tempSpeed.toFixed(2)}x</span>
                <span>1.5x</span>
              </div>
            </div>
          </div>
          
          {/* Preview Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {/* Play/Pause button */}
              <button
                onClick={togglePreviewPlayback}
                disabled={isGeneratingPreview}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {isGeneratingPreview ? (
                  <CircleNotch size={14} className="animate-spin" />
                ) : isPlayingPreview ? (
                  <Pause size={14} weight="fill" />
                ) : (
                  <Play size={14} weight="fill" />
                )}
              </button>
              
              {/* Waveform container */}
              <div 
                ref={waveformRef} 
                className="flex-1"
                style={{ minHeight: '32px' }}
              />
              
              {/* Duration */}
              <span className="text-xs text-gray-500 flex-shrink-0">
                {formatDuration(currentTime)} / {formatDuration(totalDuration)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Footer with Apply button */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default TtsConfigModal;