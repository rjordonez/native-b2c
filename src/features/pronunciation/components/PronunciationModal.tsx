import React, { useState, useCallback, useEffect } from 'react';
import { X, ArrowRight, Microphone, Warning } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeModal, updateWordResults } from '../pronunciationSlice';
import { ModalState, Word } from '../types';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { pronunciationService } from '../services/pronunciationService';
import { SentenceView } from './SentenceView';
import { WordPracticeView } from './WordPracticeView';
import { CompleteView } from './CompleteView';
import { Button } from '../../../shared/components/layout/ui/button';

const TIMER_DURATION = 5000; // 5 seconds

export const PronunciationModal: React.FC = () => {
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
  const [audioCache, setAudioCache] = useState<Map<number, string>>(new Map());

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
          isCorrect: wordScore >= 80
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

  // Audio recording hook
  const { 
    isRecording, 
    startRecording, 
    stopRecording,
    error: recordingError 
  } = useAudioRecording({
    onRecordingComplete: handleRecordingComplete
  });

  // Handle timer start (begin recording)
  const handleTimerStart = useCallback(() => {
    if (modalState.type === 'sentence' || modalState.type === 'word') {
      startRecording();
    }
  }, [modalState.type, startRecording]);

  // Handle timer completion (stop recording)
  const handleTimerComplete = useCallback(() => {
    if ((modalState.type === 'sentence' || modalState.type === 'word') && isRecording) {
      stopRecording();
    }
  }, [modalState.type, isRecording, stopRecording]);

  // Timer hook
  const { progress, isVisible } = useCountdownTimer({
    duration: TIMER_DURATION,
    onStart: handleTimerStart,
    onComplete: handleTimerComplete,
    enabled: ((modalState.type === 'sentence' || modalState.type === 'word') && modalState.timerActive && modalState.isReady && isOpen)
  });

  // Handle start button click
  const handleStart = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isReady: true
    } as ModalState));
  }, []);

  // Handle stop button click
  const handleStop = useCallback(() => {
    if (isRecording) {
      stopRecording();
    }
  }, [isRecording, stopRecording]);

  // Handle next button click
  const handleNext = useCallback(() => {
    setError(null);
    
    if (modalState.type === 'sentence') {
      const currentSentence = sentences[modalState.index];
      const incorrectWords = currentSentence.words.filter(w => w.score !== undefined && w.score < 80);

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
      if (modalState.showResults && modalState.currentScore !== undefined && modalState.currentScore < 80) {
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
  }, [isOpen]); // Remove audioCache from dependencies

  if (!isOpen) return null;

  const renderContent = () => {
    switch (modalState.type) {
      case 'sentence':
        return (
          <SentenceView 
            words={sentences[modalState.index].words}
            showResults={modalState.showResults}
            isRecording={isRecording}
            isReady={modalState.isReady}
            onStart={handleStart}
            onStop={handleStop}
          />
        );
      
      case 'word':
        // Get the word-specific audio recording, fallback to sentence audio
        const wordKey = `${modalState.sentenceIndex}-word-${modalState.wordIndex}`;
        const wordAudio = audioCache.get(wordKey);
        const sentenceAudio = audioCache.get(modalState.sentenceIndex);
        const availableAudio = wordAudio || sentenceAudio;
        
        return (
          <WordPracticeView
            word={modalState.incorrectWords[modalState.wordIndex]}
            currentIndex={modalState.wordIndex}
            totalWords={modalState.incorrectWords.length}
            showResults={modalState.showResults}
            currentScore={modalState.currentScore}
            isRecording={isRecording}
            isReady={modalState.isReady}
            onStart={handleStart}
            onStop={handleStop}
            audioUrl={availableAudio}
          />
        );
      
      case 'complete':
        return <CompleteView />;
    }
  };

  const isNextDisabled = (modalState.type === 'sentence' || modalState.type === 'word') && (!modalState.showResults || isProcessing);
  const displayError = error || recordingError;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl md:w-[30vw] md:h-[30vw] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Progress bar for sentences and words */}
        {(modalState.type === 'sentence' || modalState.type === 'word') && isVisible && (
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-blue-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-4">
            {isProcessing && (
              <span className="text-sm text-gray-600">Processing...</span>
            )}
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Error display */}
        {displayError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <Warning size={18} className="text-red-500" />
            <p className="text-sm text-red-700">{displayError}</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto relative">
          <div className="text-center w-full">
            {renderContent()}
          </div>
          
          {/* Next button - positioned on the right side */}
          {modalState.type !== 'complete' && modalState.showResults && (
            <div className="absolute right-6 bottom-6">
              <Button 
                onClick={handleNext}
                size="lg"
                className="flex items-center gap-2"
                disabled={isNextDisabled}
              >
                {isProcessing ? 'Processing...' : 'Next'}
                <ArrowRight size={18} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};