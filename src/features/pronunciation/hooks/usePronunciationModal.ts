import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeModal, updateWordResults } from '../pronunciationSlice';
import { ModalState } from '../types';
import { pronunciationService } from '../services/pronunciationService';
import { SCORING_THRESHOLDS } from '../../../shared/constants/pronunciation';

export const usePronunciationModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, sentences } = useAppSelector(state => state.pronunciation);
  
  // Local state machine
  const [modalState, setModalState] = useState<ModalState>({ 
    type: 'sentence', 
    index: 0, 
    timerActive: true, 
    showResults: false,
    isReady: false
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioCache, setAudioCache] = useState<Map<string | number, string>>(new Map());

  // Handle audio recording completion
  const handleRecordingComplete = useCallback(async (audioBlob: Blob, audioUrl: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      if (modalState.type === 'sentence') {
        const currentSentence = sentences[modalState.index];
        const words = await pronunciationService.assessPronunciation(
          audioBlob, 
          currentSentence.text
        );

        // Cache audio for this sentence
        setAudioCache(prev => new Map(prev).set(modalState.index, audioUrl));

        // Update Redux state with scores
        dispatch(updateWordResults({ 
          sentenceIndex: modalState.index, 
          words 
        }));

        // Update local state to show results
        setModalState(prev => ({
          ...prev,
          timerActive: false,
          showResults: true
        } as ModalState));
      } else if (modalState.type === 'word') {
        // For word practice, assess just the single word
        const word = modalState.incorrectWords[modalState.wordIndex];
        const result = await pronunciationService.assessPronunciation(
          audioBlob, 
          word.text
        );

        // Cache audio for this word using a composite key
        const wordKey = `${modalState.sentenceIndex}-word-${modalState.wordIndex}`;
        setAudioCache(prev => new Map(prev).set(wordKey, audioUrl));

        // Get the score and phonemes for the word
        const assessedWord = result[0];
        const wordScore = assessedWord?.score || 0;

        // Update the word in the incorrectWords array with new assessment data
        const updatedIncorrectWords = [...modalState.incorrectWords];
        updatedIncorrectWords[modalState.wordIndex] = {
          ...word,
          score: wordScore,
          phonemes: assessedWord?.phonemes || [],
          isCorrect: wordScore >= SCORING_THRESHOLDS.PASSING_SCORE
        };

        // Update local state with the score and updated word data
        setModalState(prev => (prev.type === 'word' ? {
          ...prev,
          timerActive: false,
          showResults: true,
          currentScore: wordScore,
          isReady: false,
          incorrectWords: updatedIncorrectWords
        } : prev));
      }
    } catch (err) {
      setError('Failed to process pronunciation. Please try again.');
      console.error('Pronunciation error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [modalState, sentences, dispatch]);

  // Handle start button click
  const handleStart = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isReady: true
    } as ModalState));
  }, []);

  // Handle next button click
  const handleNext = useCallback(() => {
    setError(null);
    
    if (modalState.type === 'sentence') {
      const currentSentence = sentences[modalState.index];
      const incorrectWords = currentSentence.words.filter(w => 
        w.score !== undefined && w.score < SCORING_THRESHOLDS.PASSING_SCORE
      );

      if (incorrectWords.length > 0) {
        // Move to word practice
        setModalState({
          type: 'word',
          sentenceIndex: modalState.index,
          wordIndex: 0,
          incorrectWords,
          timerActive: true,
          showResults: false,
          isReady: false
        });
      } else {
        // Move to next sentence or complete
        const nextIndex = modalState.index + 1;
        if (nextIndex < sentences.length) {
          setModalState({
            type: 'sentence',
            index: nextIndex,
            timerActive: true,
            showResults: false,
            isReady: false
          });
        } else {
          setModalState({ type: 'complete' });
        }
      }
    } else if (modalState.type === 'word') {
      // Check if the word needs to be retried (score < 80)
      if (modalState.showResults && modalState.currentScore !== undefined && 
          modalState.currentScore < SCORING_THRESHOLDS.PASSING_SCORE) {
        // Retry the same word
        setModalState({
          ...modalState,
          timerActive: true,
          showResults: false,
          currentScore: undefined,
          isReady: false
        });
      } else {
        // Word was correct or hasn't been practiced yet
        const nextWordIndex = modalState.wordIndex + 1;
        if (nextWordIndex < modalState.incorrectWords.length) {
          // Next word
          setModalState({
            ...modalState,
            wordIndex: nextWordIndex,
            timerActive: true,
            showResults: false,
            currentScore: undefined,
            isReady: false
          });
        } else {
          // Done with words, move to next sentence or complete
          const nextSentenceIndex = modalState.sentenceIndex + 1;
          if (nextSentenceIndex < sentences.length) {
            setModalState({
              type: 'sentence',
              index: nextSentenceIndex,
              timerActive: true,
              showResults: false,
              isReady: false
            });
          } else {
            setModalState({ type: 'complete' });
          }
        }
      }
    }
  }, [modalState, sentences]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setModalState({ 
        type: 'sentence', 
        index: 0, 
        timerActive: true, 
        showResults: false,
        isReady: false
      });
      setError(null);
    }
    
    // Cleanup function for when modal closes
    return () => {
      if (!isOpen) {
        audioCache.forEach(url => URL.revokeObjectURL(url));
        setAudioCache(new Map());
      }
    };
  }, [isOpen]);

  const closeModalHandler = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return {
    // State
    isOpen,
    sentences,
    modalState,
    isProcessing,
    error,
    audioCache,
    
    // Actions
    handleRecordingComplete,
    handleStart,
    handleNext,
    closeModal: closeModalHandler,
    setError,
  };
};