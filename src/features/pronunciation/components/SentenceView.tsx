import React, { useState } from 'react';
import { Word } from '../types';
import { cn } from '../../../utils/cn';
import { PronunciationText } from '../../../shared/components/layout/ui/PronunciationText';
import { RecordingButton } from './RecordingButton';
import { SpeakerHigh } from 'phosphor-react';
import { API_BASE_URL } from '../../../config/api';

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
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);

  // Generate sentence text from words
  const sentenceText = words.map(word => word.text).join(' ');

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
          text: sentenceText,
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
    <div className="space-y-8">
      <h2 className="text-xl text-gray-700 font-medium text-center">
        {showResults ? 'Pronunciation Feedback:' : isRecording ? 'Recording... Speak now!' : 'Read aloud:'}
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
      
      {/* TTS Button - show before recording starts */}
      {!showResults && !isRecording && (
        <div className="flex justify-center">
          <button
            onClick={handlePlayTTS}
            disabled={isPlayingTTS}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
            title="Listen to pronunciation"
          >
            <SpeakerHigh size={20} />
            <span className="text-sm font-medium">
              {isPlayingTTS ? 'Playing...' : 'Sample'}
            </span>
          </button>
        </div>
      )}

      {/* Error message */}
      {ttsError && (
        <p className="text-center text-sm text-red-600">{ttsError}</p>
      )}

      {!showResults && onStart && onStop && (
        <div className="flex justify-center mt-8">
          <RecordingButton
            isRecording={isRecording || false}
            onStart={onStart}
            onStop={onStop}
            disabled={isPlayingTTS}
          />
        </div>
      )}
    </div>
  );
};