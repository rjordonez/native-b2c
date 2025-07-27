import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store/types';
import type { AppDispatch } from '../../../../store/types';
import { Conversation } from '../../types';
import { fetchTopics } from '../../../../lib/supabase/topics';
import { addConversation, addMessage, setLoading, setTyping } from '../conversationSlice';
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

      // Create new conversation immediately
      const conversation: Conversation = {
        id: `conv-${Date.now()}`,
        title: topicName,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add conversation immediately to show UI
      dispatch(addConversation(conversation));
      dispatch(setLoading(false));
      
      // Show typing indicator
      dispatch(setTyping(true));

      // Get first question
      const firstQuestion = selectedTopic.questionsList[0];
      const messageId = `msg-${Date.now()}-topic`;
      
      // Set topic practice state
      const topicData: TopicPractice = {
        currentTopic: selectedTopic,
        currentQuestionIndex: 0,
        questions: selectedTopic.questionsList,
      };
      
      // Generate audio first
      const state = getState();
      const ttsSpeed = state.audioPlayback.ttsSpeed;
      const ttsVoice = state.audioPlayback.ttsVoice;
      
      try {
        const ttsResult = await generateTTS({
          text: firstQuestion.text,
          voiceName: ttsVoice,
          speakingRate: ttsSpeed
        });
        
        
        // Hide typing indicator
        dispatch(setTyping(false));
        
        // Create message with audio
        const firstMessage = {
          id: messageId,
          content: firstQuestion.text,
          sender: 'assistant' as const,
          timestamp: new Date().toISOString(),
          isTopicQuestion: true,
          audioUrl: ttsResult.success ? ttsResult.data?.audioUrl : undefined,
          audioData: ttsResult.success ? ttsResult.data?.audioData : undefined,
        };
        
        // Add message
        dispatch(addMessage({ conversationId: conversation.id, message: firstMessage }));
        
        // Set auto-play if audio was generated
        if (ttsResult.success && ttsResult.data?.audioUrl) {
          dispatch(setAutoPlayMessageId(messageId));
        }
      } catch (error) {
        console.error('TTS generation failed:', error);
        // Hide typing indicator
        dispatch(setTyping(false));
        
        // Still show the message without audio
        const firstMessage = {
          id: messageId,
          content: firstQuestion.text,
          sender: 'assistant' as const,
          timestamp: new Date().toISOString(),
          isTopicQuestion: true,
          audioUrl: undefined,
          audioData: undefined,
        };
        
        dispatch(addMessage({ conversationId: conversation.id, message: firstMessage }));
      }
      
      return { conversation, topicData, autoPlayMessageId: messageId };
    } catch (error) {
      dispatch(setLoading(false));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to start topic practice');
    }
  }
);