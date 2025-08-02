import React, { useCallback } from 'react';
import { X, ArrowRight, Warning } from 'phosphor-react';
import { usePronunciationModal } from '../hooks/usePronunciationModal';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { SentenceView } from './SentenceView';
import { WordPracticeView } from './WordPracticeView';
import { CompleteView } from './CompleteView';
import { Button } from '../../../shared/components/layout/ui/button';
import { TIMER_DURATION } from '../../../shared/constants/pronunciation';

export const PronunciationModal: React.FC = () => {
  const {
    isOpen,
    sentences,
    modalState,
    isProcessing,
    error,
    audioCache,
    handleRecordingComplete,
    handleStart,
    handleNext,
    handleSkip,
    closeModal: closeModalHandler,
    setError,
  } = usePronunciationModal();

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

  // Handle stop button click
  const handleStop = useCallback(() => {
    if (isRecording) {
      stopRecording();
    }
  }, [isRecording, stopRecording]);

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
        const wordAudio = audioCache[wordKey];
        const sentenceAudio = audioCache[modalState.sentenceIndex];
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
            onSkip={handleSkip}
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl md:w-[35vw] md:h-[35vw] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Progress bar for sentences and words */}
        {(modalState.type === 'sentence' || modalState.type === 'word') && isVisible && (
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-secondary transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-4">
            {/* Empty div for layout consistency */}
          </div>
          <button
            onClick={closeModalHandler}
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
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-secondary"></div>
              <p className="text-lg font-medium text-gray-700">Processing...</p>
            </div>
          ) : (
            <>
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
                    Next
                    <ArrowRight size={18} />
                  </Button>
                </div>
              )}
              
              {/* Skip button - positioned at bottom right for word practice */}
              {modalState.type === 'word' && !modalState.showResults && (
                <div className="absolute right-6 bottom-6">
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
                    title="Skip this word"
                  >
                    Skip
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};