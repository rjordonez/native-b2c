export interface Word {
  text: string;
  isCorrect?: boolean;
  score?: number;
  phonemes?: Array<{
    phoneme: string;
    score: number;
  }>;
  audioTimestamp?: {
    start: number;
    end: number;
  };
}

export interface Sentence {
  id: string;
  text: string;
  words: Word[];
}

// Modal state machine
export type ModalState =
  | { type: 'sentence'; index: number; timerActive: boolean; showResults: boolean; isReady: boolean }
  | { type: 'word'; sentenceIndex: number; wordIndex: number; incorrectWords: Word[]; timerActive: boolean; showResults: boolean; currentScore?: number; isReady: boolean }
  | { type: 'complete' };

// Redux state - minimal
export interface PronunciationState {
  isOpen: boolean;
  sentences: Sentence[];
}