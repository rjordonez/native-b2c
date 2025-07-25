import React from 'react';
import { Word } from '../types';
import { cn } from '../../../utils/cn';
import { PronunciationText } from '../../../shared/components/layout/ui/PronunciationText';
import { RecordingButton } from './RecordingButton';

interface SentenceViewProps {
  words: Word[];
  showResults: boolean;
  isRecording?: boolean;
  isReady?: boolean;
  onStart?: () => void;
  onStop?: () => void;
}

export const SentenceView: React.FC<SentenceViewProps> = ({ 
  words, 
  showResults, 
  isRecording,
  isReady,
  onStart,
  onStop
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-xl text-gray-700 font-medium text-center">
        {isRecording ? 'Recording... Speak now!' : 'Read this sentence:'}
      </h2>
      <div className="flex justify-center">
        <PronunciationText 
          words={words.map(word => ({
            text: word.text,
            score: word.score,
            phonemes: word.phonemes
          }))}
          showScoring={showResults}
          className="text-center justify-center"
          wordClassName="text-3xl font-medium text-center"
        />
      </div>
      {!showResults && onStart && onStop && (
        <div className="flex justify-center mt-8">
          <RecordingButton
            isRecording={isRecording || false}
            onStart={onStart}
            onStop={onStop}
            disabled={false}
          />
        </div>
      )}
    </div>
  );
};