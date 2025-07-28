import React from 'react';
import { PronunciationText } from '../../../../shared/components/layout/ui/PronunciationText';

interface TranscriptionSectionProps {
  sender: 'user' | 'assistant';
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

export const TranscriptionSection: React.FC<TranscriptionSectionProps> = ({
  sender,
  transcription,
  pronunciation,
  onEnhanceTranscript
}) => {
  if (!transcription) return null;

  return (
    <div className={`mt-2 max-w-xs lg:max-w-md ${sender === 'user' ? 'text-right' : 'text-left'}`}>
      {transcription.isLoading || (pronunciation && pronunciation.isLoading) ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-gray-500">
            {transcription.isLoading ? 'Generating feedback...' : 'Analyzing pronunciation...'}
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
              className="text-xs bg-secondary text-white px-2 py-1 rounded hover:bg-secondary/90 font-medium transition-colors"
            >
              Enhanced
            </button>
          </div>
        </div>
      )}
    </div>
  );
};