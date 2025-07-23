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
  EXCELLENT: '!text-green-600',  // >= 80
  GOOD: '!text-yellow-500',      // 60-79
  FAIR: '!text-orange-500',      // 40-59
  POOR: '!text-red-500',         // < 40
  DEFAULT: '!text-gray-900',
} as const;

// Pronunciation types for shared usage
export interface Phoneme {
  phoneme: string;
  score: number;
}

export interface PronunciationWord {
  text: string;
  score?: number;
  phonemes?: Phoneme[];
}

export interface PronunciationAssessment {
  words: PronunciationWord[];
  overallScore: number;
  accuracy: number;
  fluency: number;
  completeness: number;
}