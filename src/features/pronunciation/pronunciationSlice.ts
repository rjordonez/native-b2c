import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PronunciationState, Sentence, Word } from './types';

// Mock data generator
const generateMockSentences = (): Sentence[] => {
  const sentences = [
    'The quick brown fox jumps over the lazy dog',
    'Practice makes perfect when learning English',
    'Speaking clearly helps improve pronunciation'
  ];

  return sentences.map((text, index) => ({
    id: `sentence-${index}`,
    text,
    words: text.split(' ').map(word => ({ text: word }))
  }));
};

const initialState: PronunciationState = {
  isOpen: false,
  sentences: []
};

const pronunciationSlice = createSlice({
  name: 'pronunciation',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
      state.sentences = generateMockSentences();
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.sentences = [];
    },
    updateWordResults: (state, action: PayloadAction<{ sentenceIndex: number; words: Word[] }>) => {
      const sentence = state.sentences[action.payload.sentenceIndex];
      if (sentence) {
        sentence.words = action.payload.words;
      }
    }
  }
});

export const { openModal, closeModal, updateWordResults } = pronunciationSlice.actions;
export default pronunciationSlice.reducer;