import React from 'react';
import { Word } from '../types';
import { cn } from '../../../utils/cn';
import { PhonemeWord } from './PhonemeWord';
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
      <h2 className="text-xl text-gray-700 font-medium">
        {isRecording ? 'Recording... Speak now!' : 'Read this sentence:'}
      </h2>
      <div className="flex flex-wrap justify-center gap-3">
        {words.map((word, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <PhonemeWord 
              word={word}
              showResults={showResults}
              className="text-3xl font-medium"
            />
          </div>
        ))}
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