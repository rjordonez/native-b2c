import React from 'react';
import { Word } from '../types';
import { AudioPlaybackButton } from './AudioPlaybackButton';
import { PronunciationText } from '../../../shared/components/layout/ui/PronunciationText';
import { RecordingButton } from './RecordingButton';

interface WordPracticeViewProps {
  word: Word;
  currentIndex: number;
  totalWords: number;
  showResults: boolean;
  currentScore?: number;
  isRecording: boolean;
  isReady?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  audioUrl?: string;
}

export const WordPracticeView: React.FC<WordPracticeViewProps> = ({ 
  word, 
  currentIndex, 
  totalWords,
  showResults,
  currentScore,
  isRecording,
  isReady,
  onStart,
  onStop,
  audioUrl
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl text-gray-700 font-medium">
        {showResults && currentScore !== undefined && currentScore < 80 
          ? 'Try again:' 
          : 'Practice this word:'}
      </h2>
      <div className="relative">
        <PronunciationText 
          words={[{
            text: word.text,
            score: word.score,
            phonemes: word.phonemes
          }]}
          showScoring={showResults}
          className="text-center"
          wordClassName="text-4xl font-bold"
        />
      </div>
      {!showResults && onStart && onStop && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <RecordingButton
            isRecording={isRecording}
            onStart={onStart}
            onStop={onStop}
            disabled={false}
          />
          {audioUrl && (
            <AudioPlaybackButton
              audioUrl={audioUrl}
              startTime={word.audioTimestamp?.start}
              endTime={word.audioTimestamp?.end}
              label="You"
            />
          )}
        </div>
      )}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalWords }).map((_, index) => (
          <div
            key={index}
            className={`h-2 transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-blue-500' 
                : index < currentIndex 
                  ? 'w-2 bg-green-500' 
                  : 'w-2 bg-gray-600'
            } rounded-full`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Word {currentIndex + 1} of {totalWords}
      </p>
    </div>
  );
};