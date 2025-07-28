export interface Word {
  text: string;
  isCorrect?: boolean;
  score?: number;
  phonemes?: Array<{
    phoneme: string;
    score: number;
  }>;
  ipa?: string; // IPA transcription with stress marks from backend
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

// Redux state - complete
export interface PronunciationState {
  isOpen: boolean;
  sentences: Sentence[];
  modalState: ModalState;
  isProcessing: boolean;
  error: string | null;
  audioCache: Record<string | number, string>;
}