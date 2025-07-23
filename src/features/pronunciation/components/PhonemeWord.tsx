import React from 'react';
import { Word } from '../types';
import { cn } from '../../../utils/cn';

interface PhonemeWordProps {
  word: Word;
  showResults: boolean;
  className?: string;
}

// Helper function to get color based on phoneme score
const getPhonemeColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
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

export const PhonemeWord: React.FC<PhonemeWordProps> = ({ 
  word, 
  showResults, 
  className = 'text-3xl font-medium' 
}) => {

  // If no score data available at all, show gray (initial state)
  if (word.score === undefined || word.score === null) {
    return (
      <span className={cn(className, 'transition-all duration-500 text-gray-900')}>
        {word.text}
      </span>
    );
  }

  // If score is 0, show red
  if (word.score === 0) {
    return (
      <span className={cn(className, 'transition-all duration-500 text-red-500')}>
        {word.text}
      </span>
    );
  }

  // If score >= 80, show green (no phoneme breakdown)
  if (word.score >= 80) {
    return (
      <span className={cn(className, 'transition-all duration-500 text-green-600')}>
        {word.text}
      </span>
    );
  }

  // Score < 80: Show phoneme-level coloring to highlight mistakes
  if (!word.phonemes || word.phonemes.length === 0) {
    // Fallback if no phonemes but score < 80
    return (
      <span className={cn(className, 'transition-all duration-500 text-red-500')}>
        {word.text}
      </span>
    );
  }

  const characterPhonemes = estimatePhonemePositions(word.text, word.phonemes);

  return (
    <span className={cn(className, 'transition-all duration-500')}>
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