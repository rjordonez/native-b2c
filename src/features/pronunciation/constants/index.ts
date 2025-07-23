// Timer configuration
export const TIMER_DURATION = 5000; // 5 seconds in milliseconds

// Scoring thresholds
export const SCORING_THRESHOLDS = {
  PASSING_SCORE: 80,
  GOOD_SCORE: 80,
  FAIR_SCORE: 60,
  POOR_SCORE: 40,
} as const;

// Phoneme color mapping
export const PHONEME_COLORS = {
  EXCELLENT: 'text-green-600',  // >= 80
  GOOD: 'text-yellow-500',      // 60-79
  FAIR: 'text-orange-500',      // 40-59
  POOR: 'text-red-500',         // < 40
  DEFAULT: 'text-gray-900',
} as const;

// Mock sentences for practice
export const PRACTICE_SENTENCES = [
  'The quick brown fox jumps over the lazy dog',
  'Practice makes perfect when learning English',
  'Speaking clearly helps improve pronunciation'
] as const;