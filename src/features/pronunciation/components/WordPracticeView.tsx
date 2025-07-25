import React, { useState } from 'react';
import { Word } from '../types';
import { AudioPlaybackButton } from './AudioPlaybackButton';
import { PronunciationText } from '../../../shared/components/layout/ui/PronunciationText';
import { RecordingButton } from './RecordingButton';
import { Button } from '../../../shared/components/layout/ui/button';
import { SpeakerHigh, Play, Pause } from 'phosphor-react';
import { arpaToIpa, arpaArrayToIpa } from '../utils/arpaToIpa';
import { SCORING_THRESHOLDS } from '../../../shared/constants/pronunciation';
import { API_BASE_URL } from '../../../config/api';

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
  onSkip?: () => void;
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
  onSkip,
  audioUrl
}) => {
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);

  const handlePlayTTS = async () => {
    try {
      setIsPlayingTTS(true);
      setTtsError(null);

      const response = await fetch(`${API_BASE_URL}/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: word.text,
          voiceName: 'en-US-Journey-F',
          speakingRate: 1.0 // Normal speed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate audio');
      }

      const result = await response.json();
      
      if (result.success && result.data?.audioUrl) {
        // Create audio element and play
        const audio = new Audio(result.data.audioUrl);
        audio.onended = () => setIsPlayingTTS(false);
        audio.onerror = () => {
          setTtsError('Failed to play audio');
          setIsPlayingTTS(false);
        };
        await audio.play();
      } else {
        throw new Error('No audio URL in response');
      }
    } catch (error) {
      console.error('TTS error:', error);
      setTtsError(error instanceof Error ? error.message : 'Failed to play audio');
      setIsPlayingTTS(false);
    }
  };

  return (
    <div className="relative space-y-6">
      <h2 className="text-xl text-gray-700 font-medium">
        {showResults && currentScore !== undefined && currentScore < 80 
          ? 'Try again:' 
          : 'Pronounce this word:'}
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
        
        {/* Show IPA phonemes underneath the word */}
        {word.phonemes && word.phonemes.length > 0 && (
          <div className="mt-4 text-center">
            {/* Full word IPA transcription */}
            <div className="mb-3">
              <span className="text-2xl font-mono text-secondary">
                /{arpaArrayToIpa(word.phonemes)}/
              </span>
            </div>
            {/* Individual phonemes with scoring - only show if word needs improvement */}
            {showResults && word.score !== undefined && word.score < SCORING_THRESHOLDS.PASSING_SCORE && (
              <div className="flex justify-center items-center gap-1 flex-wrap">
                {word.phonemes.map((phoneme, index) => {
                  const ipaPhoneme = arpaToIpa(phoneme.phoneme);
                  
                  return (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-sm font-mono ${
                        phoneme.score !== undefined
                          ? phoneme.score >= 80
                            ? 'bg-green-100 text-green-800'
                            : phoneme.score >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      title={phoneme.score !== undefined ? `${ipaPhoneme}: Score ${phoneme.score}` : undefined}
                    >
                      {ipaPhoneme}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TTS Button and Audio Playback - show on same level with matching styles */}
      {!showResults && !isRecording && (
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={handlePlayTTS}
            disabled={isPlayingTTS}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
            title="Listen to pronunciation"
          >
            <SpeakerHigh size={16} />
            {isPlayingTTS ? 'Playing...' : 'Sample'}
          </Button>
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

      {/* Error message */}
      {ttsError && (
        <p className="text-center text-sm text-red-600">{ttsError}</p>
      )}

      {!showResults && onStart && onStop && (
        <div className="flex justify-center mt-8">
          <RecordingButton
            isRecording={isRecording}
            onStart={onStart}
            onStop={onStop}
            disabled={isPlayingTTS}
          />
        </div>
      )}
      
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalWords }).map((_, index) => (
          <div
            key={index}
            className={`h-2 transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-secondary' 
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