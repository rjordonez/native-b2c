import { Middleware, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { chatPersistence } from '../../services/chatPersistence';
import { startSaving, completeSaving, failSaving } from '../slices/saveStatusSlice';
import { supabase } from '../../shared/services/supabase';
import { getUserFriendlyError, logError } from '../../utils/error';

// Actions that trigger saves
const SAVE_ACTIONS = [
  'chat/addUserMessage',
  'chat/addMessage',
  'chat/createConversation/fulfilled',
  'chat/updateConversationTitle',
  'chat/deleteConversation',
  // Legacy action names (for backward compatibility)
  'conversation/addUserMessage',
  'conversation/addMessage',
  'conversation/createConversation/fulfilled',
  'conversation/updateConversationTitle',
  'conversation/deleteConversation',
  // Topic practice actions
  'chat/startTopicPractice/fulfilled',
  'chat/redoTopicQuestion/fulfilled',
  'chat/getNextTopicQuestion/fulfilled',
  'topicPractice/startTopicPractice/fulfilled',
  'topicPractice/redoTopicQuestion/fulfilled',
  'topicPractice/getNextTopicQuestion/fulfilled',
  // Transcription and pronunciation actions
  'conversation/updateMessage',
  'chat/updateMessage',
  'voiceRecording/processTranscription/fulfilled',
  'voiceRecording/analyzePronunciation/fulfilled',
  // Enhanced transcript action
  'topicPractice/enhanceTranscript/fulfilled',
];

// Debounce timer for saves
let saveTimer: NodeJS.Timeout | null = null;
const SAVE_DELAY = 1000; // 1 second debounce

export const autoSaveMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: AnyAction) => {
  // Execute the action first
  const result = next(action);
  
  // Check if this action should trigger a save
  if (SAVE_ACTIONS.includes(action.type)) {
    const state = store.getState();
    const userId = state.auth.user?.id;
    
    // Only save if user is authenticated
    if (userId) {
      // Clear existing timer
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      
      // Set loading state immediately for user feedback
      store.dispatch(startSaving());
      
      // Debounce the actual save
      saveTimer = setTimeout(async () => {
        try {
          await handleSave(action, state, userId);
          store.dispatch(completeSaving());
        } catch (error) {
          logError(error, 'AutoSave');
          const userMessage = getUserFriendlyError(error);
          store.dispatch(failSaving(userMessage));
        }
      }, SAVE_DELAY);
    }
  }
  
  return result;
};

/**
 * Handle the save operation based on action type
 */
async function handleSave(action: AnyAction, state: RootState, userId: string) {
  // Get the chat state - check both possible locations
  const chatState = state.chat || state.conversation;
  
  interface ConversationState {
    conversations: Array<{
      id: string;
      messages: Array<{
        id: string;
        transcription?: { text: string };
      }>;
    }>;
  }
  
  switch (action.type) {
    case 'chat/createConversation/fulfilled':
    case 'conversation/createConversation/fulfilled': {
      const conversation = action.payload;
      await chatPersistence.saveConversation(conversation, userId);
      break;
    }
    
    case 'chat/addUserMessage':
    case 'conversation/addUserMessage': {
      const { conversationId, messageId } = action.payload;
      const conversation = chatState.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        // Get topic practice state if active
        const topicPracticeState = state.topicPractice;
        
        // Save conversation first to ensure it exists
        const dbConvId = await chatPersistence.saveConversation(conversation, userId, topicPracticeState);
        
        // Find and save the message
        const message = conversation.messages.find(m => m.id === (messageId || `msg-${Date.now()}-user`));
        if (message) {
          await chatPersistence.saveMessage(message, dbConvId, userId);
        }
      }
      break;
    }
    
    case 'chat/addMessage':
    case 'conversation/addMessage': {
      const { conversationId, message } = action.payload;
      const conversation = chatState.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        // Get topic practice state if active
        const topicPracticeState = state.topicPractice;
        
        // Save conversation first to ensure it exists
        const dbConvId = await chatPersistence.saveConversation(conversation, userId, topicPracticeState);
        
        // Save the message
        await chatPersistence.saveMessage(message, dbConvId, userId);
      }
      break;
    }
    
    case 'chat/updateConversationTitle':
    case 'conversation/updateConversationTitle': {
      const { conversationId, title } = action.payload;
      if (title) {
        await chatPersistence.updateConversationTitle(conversationId, title);
      }
      break;
    }
    
    case 'chat/deleteConversation':
    case 'conversation/deleteConversation': {
      const conversationId = action.payload;
      await chatPersistence.deleteConversation(conversationId);
      break;
    }
    
    // Topic practice actions - save the created/updated conversation
    case 'chat/startTopicPractice/fulfilled':
    case 'topicPractice/startTopicPractice/fulfilled': {
      const { conversation, topicData } = action.payload;
      
      // Save conversation with topic practice state
      const dbConvId = await chatPersistence.saveConversation(conversation, userId, topicData);
      
      // Save the first message (question)
      if (conversation.messages.length > 0) {
        await chatPersistence.saveMessage(conversation.messages[0], dbConvId, userId);
      }
      break;
    }
    
    case 'chat/redoTopicQuestion/fulfilled':
    case 'topicPractice/redoTopicQuestion/fulfilled':
    case 'chat/getNextTopicQuestion/fulfilled':
    case 'topicPractice/getNextTopicQuestion/fulfilled': {
      const { conversationId, message } = action.payload;
      const conversation = chatState.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        // Get topic practice state if active
        const topicPracticeState = state.topicPractice;
        
        const dbConvId = await chatPersistence.saveConversation(conversation, userId, topicPracticeState);
        await chatPersistence.saveMessage(message, dbConvId, userId);
      }
      break;
    }
    
    // Handle message updates (transcription/pronunciation)
    case 'chat/updateMessage':
    case 'conversation/updateMessage': {
      const { conversationId, messageId, updates } = action.payload;
      const conversation = chatState.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        const message = conversation.messages.find(m => m.id === messageId);
        if (message) {
          // Get the database conversation ID
          const { data: dbConv } = await supabase
            .from('conversations')
            .select('*')
            .eq('client_id', conversationId)
            .single();
          
          if (dbConv) {
            // Get the database message ID
            const { data: dbMsg } = await supabase
              .from('messages')
              .select('*')
              .eq('client_id', messageId)
              .single();
            
            if (dbMsg) {
              // Save transcription if updated
              if (updates.transcription && !updates.transcription.isLoading) {
                await chatPersistence.saveTranscription(dbMsg.id, updates.transcription);
              }
              
              // Save pronunciation if updated
              if (updates.pronunciation && !updates.pronunciation.isLoading) {
                await chatPersistence.savePronunciation(dbMsg.id, updates.pronunciation);
              }
            }
          }
        }
      }
      break;
    }
    
    // Handle enhanced transcript
    case 'topicPractice/enhanceTranscript/fulfilled': {
      const { conversationId, message } = action.payload;
      const conversation = chatState.conversations.find(c => c.id === conversationId);
      
      if (conversation && message) {
        // Find the original message that was enhanced
        const originalMessages = conversation.messages.filter(m => 
          m.sender === 'user' && m.transcription && m.transcription.text
        );
        const lastUserMessage = originalMessages[originalMessages.length - 1];
        
        if (lastUserMessage) {
          // Get the database message ID
          const { data: dbMsg } = await supabase
            .from('messages')
            .select('*')
            .eq('client_id', lastUserMessage.id)
            .maybeSingle();
          
          if (dbMsg) {
            // Save the enhanced transcript
            await chatPersistence.saveEnhancedTranscript(
              dbMsg.id,
              message.content, // Enhanced text
              lastUserMessage.transcription.text // Original text
            );
          }
        }
      }
      break;
    }
  }
}