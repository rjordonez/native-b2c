import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store/types';
import type { AppDispatch } from '../../../../store/types';
import { Conversation } from '../../types';
import { fetchTopics } from '../../../../lib/supabase/topics';
import { addConversation, addMessage, setLoading } from '../conversationSlice';
import { setAutoPlayMessageId } from '../audioPlaybackSlice';
import { generateTTS } from './ttsService';
import type { StartTopicPracticeResult, TopicPractice } from './types';

// Topic practice async thunk
export const startTopicPractice = createAsyncThunk<
  StartTopicPracticeResult,
  { topicName: string },
  { dispatch: AppDispatch; state: RootState }
>(
  'topicPractice/startTopicPractice',
  async ({ topicName }, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      // Fetch all topics from Supabase
      const topics = await fetchTopics();
      const selectedTopic = topics.find(topic => 
        topic.title.toLowerCase() === topicName.toLowerCase()
      );
      
      if (!selectedTopic || !selectedTopic.questionsList || selectedTopic.questionsList.length === 0) {
        throw new Error(`No questions found for topic: ${topicName}`);
      }

      // Create new conversation with topic practice metadata
      const conversation: Conversation = {
        id: `conv-${Date.now()}`,
        title: topicName,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topicPracticeMetadata: {
          topicId: selectedTopic.id,
          topicTitle: selectedTopic.title,
          currentQuestionIndex: 0,
          totalQuestions: selectedTopic.questionsList.length,
        },
      };

      // Get first question
      const firstQuestion = selectedTopic.questionsList[0];
      
      // Get current TTS settings from state
      const state = getState();
      const ttsSpeed = state.audioPlayback.ttsSpeed;
      const ttsVoice = state.audioPlayback.ttsVoice;
      
      // Generate audio for the first question
      const ttsResult = await generateTTS({
        text: firstQuestion.text,
        voiceName: ttsVoice,
        speakingRate: ttsSpeed
      });
      
      if (!ttsResult.success) {
        throw new Error(ttsResult.message || 'TTS generation failed');
      }

      // Create initial message with first question
      const firstMessage = {
        id: `msg-${Date.now()}-topic`,
        content: firstQuestion.text,
        sender: 'assistant' as const,
        timestamp: new Date().toISOString(),
        isTopicQuestion: true,
        audioUrl: ttsResult.data?.audioUrl,
      };

      // Add conversation and message
      dispatch(addConversation(conversation));
      dispatch(addMessage({ conversationId: conversation.id, message: firstMessage }));
      
      // Set topic practice state
      const topicData: TopicPractice = {
        currentTopic: selectedTopic,
        currentQuestionIndex: 0,
        questions: selectedTopic.questionsList,
      };
      
      dispatch(setLoading(false));
      
      // Set auto-play for the first message if audio was generated
      if (ttsResult.data?.audioUrl) {
        dispatch(setAutoPlayMessageId(firstMessage.id));
      }
      
      return { conversation, topicData, autoPlayMessageId: firstMessage.id };
    } catch (error) {
      dispatch(setLoading(false));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to start topic practice');
    }
  }
);