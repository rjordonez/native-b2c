import React, { RefObject } from 'react';
import { Play, Pause, CircleNotch } from 'phosphor-react';
import { formatDuration } from '@/shared/utils/audio';

interface PreviewSectionProps {
  isGeneratingPreview: boolean;
  isPlayingPreview: boolean;
  previewAudioUrl: string | null;
  currentTime: number;
  totalDuration: number;
  waveformRef: RefObject<HTMLDivElement | null>;
  onTogglePlayback: () => void;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  isGeneratingPreview,
  isPlayingPreview,
  previewAudioUrl,
  currentTime,
  totalDuration,
  waveformRef,
  onTogglePlayback
}) => {
  return (
    <div className="border-t pt-4">
      <div className="mb-2">
        <span className="text-sm font-medium text-gray-700">Preview</span>
      </div>
      
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlayback}
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
  );
};