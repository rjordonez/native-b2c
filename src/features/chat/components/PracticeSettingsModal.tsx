import React, { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { 
  selectPreviewSpeed,
  selectPreviewVoice,
  selectIsGeneratingPreview,
  selectPreviewAudioUrl,
  selectShowProgressDots,
  setPreviewSpeed,
  setPreviewVoice,
  setShowProgressDots,
  initializePreviewSettings,
  applyPreviewSettings,
  clearPreview,
  generateTtsPreview
} from '../store/audioPlaybackSlice';
import { createWaveSurfer, setupWaveSurferEvents } from '@/shared/utils/audio';
import {
  ModalHeader,
  VoiceSelector,
  SpeedControl,
  ProgressToggle,
  PreviewSection,
  ModalFooter,
  SAMPLE_TEXT
} from './PracticeSettingsModal/index';

interface PracticeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PracticeSettingsModal: React.FC<PracticeSettingsModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  
  // Redux state for preview settings
  const previewSpeed = useAppSelector(selectPreviewSpeed);
  const previewVoice = useAppSelector(selectPreviewVoice);
  const isGeneratingPreview = useAppSelector(selectIsGeneratingPreview);
  const previewAudioUrl = useAppSelector(selectPreviewAudioUrl);
  const showProgressDots = useAppSelector(selectShowProgressDots);
  
  // Local state for WaveSurfer UI only
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  
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
    const result = await dispatch(generateTtsPreview({ text: SAMPLE_TEXT }));
      
    if (generateTtsPreview.fulfilled.match(result) && result.payload && 'audioUrl' in result.payload && waveformRef.current) {
      // Destroy any existing wavesurfer instance
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
      
      // Create new wavesurfer instance
      const wavesurfer = createWaveSurfer({
        container: waveformRef.current,
        type: 'tts_preview',
        height: 24,
      });
      
      wavesurferRef.current = wavesurfer;
      
      // Setup common WaveSurfer events
      setupWaveSurferEvents(wavesurfer, {
        onReady: () => {
          const duration = wavesurfer.getDuration();
          setTotalDuration(duration);
          wavesurfer.play();
          setIsPlayingPreview(true);
        },
        onPlay: () => setIsPlayingPreview(true),
        onPause: () => setIsPlayingPreview(false),
        onFinish: () => {
          setIsPlayingPreview(false);
          setCurrentTime(0);
        },
        onTimeUpdate: (time: number) => setCurrentTime(time),
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
        <ModalHeader onClose={handleCancel} />
        
        <div className="p-4 space-y-4">
          <VoiceSelector 
            value={previewVoice}
            onChange={(value) => dispatch(setPreviewVoice(value))}
          />
          
          <SpeedControl
            value={previewSpeed}
            onChange={(value) => dispatch(setPreviewSpeed(value))}
          />
          
          <ProgressToggle
            showProgressDots={showProgressDots}
            onChange={(value) => dispatch(setShowProgressDots(value))}
          />
          
          <PreviewSection
            isGeneratingPreview={isGeneratingPreview}
            isPlayingPreview={isPlayingPreview}
            previewAudioUrl={previewAudioUrl}
            currentTime={currentTime}
            totalDuration={totalDuration}
            waveformRef={waveformRef}
            onTogglePlayback={togglePreviewPlayback}
          />
        </div>
        
        <ModalFooter
          onCancel={handleCancel}
          onApply={handleApply}
        />
      </div>
    </>
  );
};

export default PracticeSettingsModal;