import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  closeModal, 
  updateWordResults, 
  setModalState, 
  setProcessing, 
  setError, 
  cacheAudio,
  nextQuestion,
  updateWordScore,
  showResults
} from '../pronunciationSlice';
import { pronunciationService } from '../services/pronunciationService';
import { SCORING_THRESHOLDS } from '../../../shared/constants/pronunciation';

export const usePronunciationModal = () => {
  const dispatch = useAppDispatch();
  
  // Use memoized selectors for better performance
  const isOpen = useAppSelector(state => state.pronunciation.isOpen);
  const sentences = useAppSelector(state => state.pronunciation.sentences);
  const modalState = useAppSelector(state => state.pronunciation.modalState);
  const isProcessing = useAppSelector(state => state.pronunciation.isProcessing);
  const error = useAppSelector(state => state.pronunciation.error);
  const audioCache = useAppSelector(state => state.pronunciation.audioCache);

  // Handle audio recording completion - memoized with specific dependencies
  const handleRecordingComplete = useCallback(async (audioBlob: Blob, audioUrl: string) => {
    dispatch(setProcessing(true));
    dispatch(setError(null));

    try {
      if (modalState.type === 'sentence') {
        const currentSentence = sentences[modalState.index];
        const words = await pronunciationService.assessPronunciation(
          audioBlob, 
          currentSentence.text
        );

        // Cache audio for this sentence using Redux action
        dispatch(cacheAudio({ key: modalState.index, url: audioUrl }));

        // Update Redux state with scores
        dispatch(updateWordResults({ 
          sentenceIndex: modalState.index, 
          words 
        }));

        // Update modal state to show results using Redux action
        dispatch(showResults());
        
      } else if (modalState.type === 'word') {
        // For word practice, assess just the single word
        const word = modalState.incorrectWords[modalState.wordIndex];
        const result = await pronunciationService.assessPronunciation(
          audioBlob, 
          word.text
        );

        // Cache audio for this word using a composite key
        const wordKey = `${modalState.sentenceIndex}-word-${modalState.wordIndex}`;
        dispatch(cacheAudio({ key: wordKey, url: audioUrl }));

        // Get the score and phonemes for the word
        const assessedWord = result[0];
        const wordScore = assessedWord?.score || 0;

        // Update word score using Redux action
        dispatch(updateWordScore({
          sentenceIndex: modalState.sentenceIndex,
          wordIndex: modalState.wordIndex,
          score: wordScore,
          phonemes: assessedWord?.phonemes || []
        }));

        // Show results
        dispatch(showResults());
      }
    } catch (err) {
      dispatch(setError('Failed to process pronunciation. Please try again.'));
      console.error('Pronunciation error:', err);
    } finally {
      dispatch(setProcessing(false));
    }
  }, [modalState.type, modalState.index, modalState.sentenceIndex, modalState.wordIndex, sentences, dispatch]);

  // Handle start button click - only dispatch, no local state
  const handleStart = useCallback(() => {
    dispatch(setModalState({
      ...modalState,
      isReady: true
    }));
  }, [modalState, dispatch]);

  // Handle next button click - use Redux nextQuestion action
  const handleNext = useCallback(() => {
    dispatch(nextQuestion());
  }, [dispatch]);

  // Close modal handler
  const closeModalHandler = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  // No Map conversion needed - use Redux object directly

  // Cleanup audio URLs when component unmounts
  useEffect(() => {
    return () => {
      if (!isOpen) {
        Object.values(audioCache).forEach(url => {
          try {
            URL.revokeObjectURL(url);
          } catch (error) {
            // Ignore cleanup errors
          }
        });
      }
    };
  }, [isOpen, audioCache]);

  // Memoized action creators
  const setErrorHandler = useCallback((error: string | null) => {
    dispatch(setError(error));
  }, [dispatch]);

  return {
    // Redux state (no local state duplication)
    isOpen,
    sentences,
    modalState,
    isProcessing,
    error,
    audioCache, // Use Redux object directly
    
    // Memoized actions that dispatch to Redux
    handleRecordingComplete,
    handleStart,
    handleNext,
    closeModal: closeModalHandler,
    setError: setErrorHandler,
  };
};