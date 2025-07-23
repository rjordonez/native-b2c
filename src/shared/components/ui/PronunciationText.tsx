import React from 'react';
import { cn } from '../../../utils/cn';
import { 
  SCORING_THRESHOLDS, 
  PHONEME_COLORS, 
  type PronunciationWord 
} from '../../constants/pronunciation';

interface PronunciationTextProps {
  words: PronunciationWord[];
  showScoring?: boolean;
  className?: string;
  wordClassName?: string;
}

// Helper function to get color based on phoneme score
const getPhonemeColor = (score: number): string => {
  if (score >= SCORING_THRESHOLDS.GOOD_SCORE) return PHONEME_COLORS.EXCELLENT;
  if (score >= SCORING_THRESHOLDS.FAIR_SCORE) return PHONEME_COLORS.GOOD;
  if (score >= SCORING_THRESHOLDS.POOR_SCORE) return PHONEME_COLORS.FAIR;
  return PHONEME_COLORS.POOR;
};

// Helper function to estimate character positions for phonemes
const estimatePhonemePositions = (word: string, phonemes: Array<{ phoneme: string; score: number }>) => {
  const wordLength = word.length;
  const phonemeCount = phonemes.length;
  
  if (phonemeCount === 0) {
    // Fallback if no phonemes available
    return word.split('').map((char) => ({
      char,
      phoneme: { phoneme: '', score: 0 },
      color: 'text-gray-900'
    }));
  }
  
  return word.split('').map((char, charIndex) => {
    // Estimate which phoneme this character belongs to
    const phonemeIndex = Math.min(
      Math.floor((charIndex / wordLength) * phonemeCount),
      phonemeCount - 1
    );
    const phoneme = phonemes[phonemeIndex];
    
    return {
      char,
      phoneme,
      color: getPhonemeColor(phoneme?.score || 0)
    };
  });
};

const PronunciationWord: React.FC<{
  word: PronunciationWord;
  showScoring: boolean;
  className?: string;
}> = ({ word, showScoring, className = '' }) => {
  // If scoring is disabled, show normal text
  if (!showScoring) {
    return (
      <span className={cn('transition-all duration-500 text-gray-900', className)}>
        {word.text}
      </span>
    );
  }

  // If no score data available at all, show gray (initial state)
  if (word.score === undefined || word.score === null) {
    return (
      <span className={cn('transition-all duration-500 text-gray-900', className)}>
        {word.text}
      </span>
    );
  }

  // If score is 0, show red
  if (word.score === 0) {
    return (
      <span className={cn('transition-all duration-500 text-red-500', className)}>
        {word.text}
      </span>
    );
  }

  // If score >= passing threshold, show green (no phoneme breakdown)
  if (word.score >= SCORING_THRESHOLDS.PASSING_SCORE) {
    return (
      <span className={cn(`transition-all duration-500 ${PHONEME_COLORS.EXCELLENT}`, className)}>
        {word.text}
      </span>
    );
  }

  // Score < 80: Show phoneme-level coloring to highlight mistakes
  if (!word.phonemes || word.phonemes.length === 0) {
    // Fallback if no phonemes but score < 80
    return (
      <span className={cn('transition-all duration-500 text-red-500', className)}>
        {word.text}
      </span>
    );
  }

  // Debug log for low-scoring words
  if (word.score < SCORING_THRESHOLDS.PASSING_SCORE) {
    console.log(`Rendering phoneme-level coloring for "${word.text}" (score: ${word.score})`, word.phonemes);
  }

  const characterPhonemes = estimatePhonemePositions(word.text, word.phonemes);

  return (
    <span className={cn('transition-all duration-500', className)}>
      {characterPhonemes.map((item, index) => (
        <span
          key={index}
          className={item.color}
          title={item.phoneme ? `${item.phoneme.phoneme}: ${item.phoneme.score}%` : item.char}
        >
          {item.char}
        </span>
      ))}
    </span>
  );
};

export const PronunciationText: React.FC<PronunciationTextProps> = ({
  words,
  showScoring = true,
  className = '',
  wordClassName = ''
}) => {
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {words.map((word, index) => (
        <PronunciationWord
          key={index}
          word={word}
          showScoring={showScoring}
          className={wordClassName}
        />
      ))}
    </div>
  );
};