import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import {
  selectAudioUrl,
  selectAudioData,
  selectMimeType,
  selectRecordingDuration,
  startTranscription,
  transcribeAudio,
  transcribeWithPronunciation
} from '../../../store/voiceRecordingSlice';
import {
  selectActiveConversationId,
  addUserMessage,
  sendMessage,
  updateMessage
} from '../../../store/conversationSlice';
import { selectTopicPractice } from '../../../store/topicPracticeSlice';
import { PlayControls } from './PlayControls';
import { ActionButtons } from './ActionButtons';
import { DurationWarning } from './DurationWarning';
import { useWaveformPlayer } from './useWaveformPlayer';

interface WaveformPlayerProps {
  onClear: () => void;
}

const WaveformPlayer: React.FC<WaveformPlayerProps> = ({ onClear }) => {
  const dispatch = useAppDispatch();
  const audioUrl = useAppSelector(selectAudioUrl);
  const audioData = useAppSelector(selectAudioData);
  const mimeType = useAppSelector(selectMimeType);
  const recordingDuration = useAppSelector(selectRecordingDuration);
  const activeConversationId = useAppSelector(selectActiveConversationId);
  const topicPractice = useAppSelector(selectTopicPractice);
  
  const {
    waveformRef,
    currentTime,
    totalDuration,
    isPlaying,
    handlePlayPause,
    cleanupWaveform
  } = useWaveformPlayer(audioUrl);

  // Clear recording and reset
  const handleClear = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    cleanupWaveform();
    onClear();
  };

  // Send voice message
  const handleSend = () => {
    if (!activeConversationId || !audioData) {
      return;
    }

    // Generate unique message ID for tracking transcription
    const messageId = `msg-${Date.now()}-user`;

    // Add voice message to chat with the generated ID and question index
    dispatch(addUserMessage({
      conversationId: activeConversationId,
      content: 'Voice message',
      audioData: audioData || undefined,
      messageId,
      questionIndex: topicPractice.currentQuestionIndex
    }));

    // Update message with initial loading states for transcription and pronunciation
    dispatch(updateMessage({
      conversationId: activeConversationId,
      messageId,
      updates: {
        transcription: {
          text: '',
          isLoading: true,
          error: undefined
        },
        pronunciation: {
          words: [],
          overallScore: 0,
          accuracy: 0,
          fluency: 0,
          completeness: 0,
          isLoading: true,
          error: undefined
        }
      }
    }));

    // Get current question text for pronunciation reference
    let referenceText = undefined;
    if (topicPractice.currentTopic && topicPractice.questions && topicPractice.currentQuestionIndex >= 0) {
      const currentQuestion = topicPractice.questions[topicPractice.currentQuestionIndex];
      if (currentQuestion) {
        referenceText = currentQuestion.text;
      }
    }

    // Start transcription + pronunciation analysis process
    dispatch(transcribeWithPronunciation({
      messageId,
      audioData: audioData,
      contentType: mimeType || 'audio/webm', // Use actual MIME type from recording
      referenceText: referenceText
    }));

    // Send to AI (simulate)
    dispatch(sendMessage({
      conversationId: activeConversationId,
      content: 'Voice message',
      audioData: audioData || undefined
    }));

    // Clear recording without revoking URL (needed for chat message)
    cleanupWaveform();
    onClear();
  };
  
  // Check if recording meets minimum duration
  const minimumDuration = 10; // 10 seconds
  const canSend = totalDuration >= minimumDuration;

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-md">
      {!canSend && (
        <DurationWarning 
          totalDuration={totalDuration}
          minimumDuration={minimumDuration}
        />
      )}
      <div className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm">
        <PlayControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          totalDuration={totalDuration}
          waveformRef={waveformRef}
          onPlayPause={handlePlayPause}
        />

        <ActionButtons
          canSend={canSend}
          totalDuration={totalDuration}
          minimumDuration={minimumDuration}
          onClear={handleClear}
          onSend={handleSend}
        />
      </div>
    </div>
  );
};

export default WaveformPlayer;