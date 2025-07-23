import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PronunciationState, Sentence, Word, ModalState } from './types';
import { PRACTICE_SENTENCES, SCORING_THRESHOLDS } from './constants';

// Mock data generator
const generateMockSentences = (): Sentence[] => {
  return PRACTICE_SENTENCES.map((text, index) => ({
    id: `sentence-${index}`,
    text,
    words: text.split(' ').map(word => ({ text: word }))
  }));
};

const initialState: PronunciationState = {
  isOpen: false,
  sentences: [],
  modalState: { 
    type: 'sentence', 
    index: 0, 
    timerActive: true, 
    showResults: false,
    isReady: false
  },
  isProcessing: false,
  error: null,
  audioCache: {}
};

const pronunciationSlice = createSlice({
  name: 'pronunciation',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
      state.sentences = generateMockSentences();
      state.modalState = { 
        type: 'sentence', 
        index: 0, 
        timerActive: true, 
        showResults: false,
        isReady: false
      };
      state.isProcessing = false;
      state.error = null;
      state.audioCache = {};
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.sentences = [];
      // Cleanup audio URLs
      Object.values(state.audioCache).forEach(url => URL.revokeObjectURL(url));
      state.audioCache = {};
    },
    updateWordResults: (state, action: PayloadAction<{ sentenceIndex: number; words: Word[] }>) => {
      const sentence = state.sentences[action.payload.sentenceIndex];
      if (sentence) {
        sentence.words = action.payload.words;
      }
    },
    setModalState: (state, action: PayloadAction<ModalState>) => {
      state.modalState = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    cacheAudio: (state, action: PayloadAction<{ key: string | number; url: string }>) => {
      state.audioCache[action.payload.key] = action.payload.url;
    },
    startRecording: (state) => {
      state.modalState = { ...state.modalState, isReady: true } as ModalState;
    },
    showResults: (state) => {
      state.modalState = { 
        ...state.modalState, 
        timerActive: false, 
        showResults: true 
      } as ModalState;
    },
    nextQuestion: (state) => {
      state.error = null;
      
      if (state.modalState.type === 'sentence') {
        const currentSentence = state.sentences[state.modalState.index];
        const incorrectWords = currentSentence.words.filter(w => 
          w.score !== undefined && w.score < SCORING_THRESHOLDS.PASSING_SCORE
        );

        if (incorrectWords.length > 0) {
          // Move to word practice
          state.modalState = {
            type: 'word',
            sentenceIndex: state.modalState.index,
            wordIndex: 0,
            incorrectWords,
            timerActive: true,
            showResults: false,
            isReady: false
          };
        } else {
          // Move to next sentence or complete
          const nextIndex = state.modalState.index + 1;
          if (nextIndex < state.sentences.length) {
            state.modalState = {
              type: 'sentence',
              index: nextIndex,
              timerActive: true,
              showResults: false,
              isReady: false
            };
          } else {
            state.modalState = { type: 'complete' };
          }
        }
      } else if (state.modalState.type === 'word') {
        // Check if the word needs to be retried
        if (state.modalState.showResults && 
            state.modalState.currentScore !== undefined && 
            state.modalState.currentScore < SCORING_THRESHOLDS.PASSING_SCORE) {
          // Retry the same word
          state.modalState = {
            ...state.modalState,
            timerActive: true,
            showResults: false,
            currentScore: undefined,
            isReady: false
          };
        } else {
          // Word was correct - move to next word or sentence
          const nextWordIndex = state.modalState.wordIndex + 1;
          if (nextWordIndex < state.modalState.incorrectWords.length) {
            // Next word
            state.modalState = {
              ...state.modalState,
              wordIndex: nextWordIndex,
              timerActive: true,
              showResults: false,
              currentScore: undefined,
              isReady: false
            };
          } else {
            // Done with words, move to next sentence or complete
            const nextSentenceIndex = state.modalState.sentenceIndex + 1;
            if (nextSentenceIndex < state.sentences.length) {
              state.modalState = {
                type: 'sentence',
                index: nextSentenceIndex,
                timerActive: true,
                showResults: false,
                isReady: false
              };
            } else {
              state.modalState = { type: 'complete' };
            }
          }
        }
      }
    },
    updateWordScore: (state, action: PayloadAction<{ 
      sentenceIndex: number; 
      wordIndex: number; 
      score: number; 
      phonemes: any[] 
    }>) => {
      if (state.modalState.type === 'word') {
        const { score, phonemes } = action.payload;
        const updatedWords = [...state.modalState.incorrectWords];
        updatedWords[state.modalState.wordIndex] = {
          ...updatedWords[state.modalState.wordIndex],
          score,
          phonemes,
          isCorrect: score >= SCORING_THRESHOLDS.PASSING_SCORE
        };
        
        state.modalState = {
          ...state.modalState,
          incorrectWords: updatedWords,
          currentScore: score,
          timerActive: false,
          showResults: true,
          isReady: false
        };
      }
    }
  }
});

export const { 
  openModal, 
  closeModal, 
  updateWordResults, 
  setModalState,
  setProcessing,
  setError,
  cacheAudio,
  startRecording,
  showResults,
  nextQuestion,
  updateWordScore
} = pronunciationSlice.actions;
export default pronunciationSlice.reducer;