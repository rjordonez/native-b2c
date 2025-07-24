import React, { useState, useEffect, useRef } from 'react';
import { X, Gear, Play, Pause, CircleNotch } from 'phosphor-react';
import WaveSurfer from 'wavesurfer.js';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { 
  selectTtsSpeed, 
  selectTtsVoice, 
  selectPreviewSpeed,
  selectPreviewVoice,
  selectIsGeneratingPreview,
  selectPreviewAudioUrl,
  setPreviewSpeed,
  setPreviewVoice,
  initializePreviewSettings,
  applyPreviewSettings,
  clearPreview,
  generateTtsPreview
} from '../store/audioPlaybackSlice';

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
  
  // Redux state for preview settings
  const previewSpeed = useAppSelector(selectPreviewSpeed);
  const previewVoice = useAppSelector(selectPreviewVoice);
  const isGeneratingPreview = useAppSelector(selectIsGeneratingPreview);
  const previewAudioUrl = useAppSelector(selectPreviewAudioUrl);
  
  // Local state for WaveSurfer UI only
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
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
  
  // Initialize preview settings when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(initializePreviewSettings());
      // Clean up any existing wavesurfer
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
      dispatch(clearPreview());
      setIsPlayingPreview(false);
      setCurrentTime(0);
      setTotalDuration(0);
    }
  }, [isOpen, dispatch]);

  // Clear preview when settings change
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
    dispatch(clearPreview());
    setIsPlayingPreview(false);
    setCurrentTime(0);
    setTotalDuration(0);
  }, [previewSpeed, previewVoice, dispatch]);

  const handleApply = () => {
    dispatch(applyPreviewSettings());
    onClose();
  };

  const handleCancel = () => {
    // Clean up wavesurfer
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
    // Reset to original values
    dispatch(initializePreviewSettings());
    dispatch(clearPreview());
    onClose();
  };

  const generatePreview = async () => {
    const result = await dispatch(generateTtsPreview({ text: sampleText }));
      
    if (generateTtsPreview.fulfilled.match(result) && result.payload && 'audioUrl' in result.payload && waveformRef.current) {
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
      wavesurfer.load(result.payload.audioUrl);
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={previewVoice}
              onChange={(e) => dispatch(setPreviewVoice(e.target.value))}
            >
              {voiceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Speed Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speed
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0.25"
                max="2.0"
                step="0.05"
                value={previewSpeed}
                onChange={(e) => dispatch(setPreviewSpeed(parseFloat(e.target.value)))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">0.25x</span>
                <span className="font-medium text-gray-700">{previewSpeed.toFixed(2)}x</span>
                <span className="text-xs text-gray-500">2.0x</span>
              </div>
            </div>
          </div>
          
          {/* Preview Section */}
          <div className="border-t pt-4">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">Preview</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              {/* Play/Pause Button */}
              <button
                onClick={togglePreviewPlayback}
                disabled={isGeneratingPreview}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPreview ? (
                  <CircleNotch size={14} weight="fill" className="animate-spin" />
                ) : isPlayingPreview ? (
                  <Pause size={14} weight="fill" />
                ) : (
                  <Play size={14} weight="fill" />
                )}
              </button>

              {/* Waveform */}
              <div className="flex items-center flex-1">
                {previewAudioUrl ? (
                  <div 
                    ref={waveformRef}
                    className="w-full h-6"
                  />
                ) : (
                  <div className="w-full h-6 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400">
                      {isGeneratingPreview ? 'Generating...' : 'Click play to preview'}
                    </span>
                  </div>
                )}
              </div>

              {/* Duration */}
              <span className="text-xs text-gray-500 flex-shrink-0">
                {formatDuration(currentTime)} / {formatDuration(totalDuration)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
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