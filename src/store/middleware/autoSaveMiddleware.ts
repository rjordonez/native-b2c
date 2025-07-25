import { Middleware, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { chatPersistence } from '../../services/chatPersistence';
import { startSaving, completeSaving, failSaving } from '../slices/saveStatusSlice';

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
];

// Debounce timer for saves
let saveTimer: NodeJS.Timeout | null = null;
const SAVE_DELAY = 1000; // 1 second debounce

export const autoSaveMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: AnyAction) => {
  // Execute the action first
  const result = next(action);
  
  console.log('Middleware: Action dispatched:', action.type);
  
  // Check if this action should trigger a save
  if (SAVE_ACTIONS.includes(action.type)) {
    console.log('Middleware: Save action detected:', action.type);
    const state = store.getState();
    const userId = state.auth.user?.id;
    
    // Only save if user is authenticated
    if (userId) {
      console.log('Middleware: User authenticated, triggering save');
      // Clear existing timer
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      
      // Set loading state immediately for user feedback
      store.dispatch(startSaving());
      
      // Debounce the actual save
      saveTimer = setTimeout(async () => {
        try {
          console.log('Middleware: Executing save for action:', action.type);
          await handleSave(action, state, userId);
          store.dispatch(completeSaving());
        } catch (error) {
          console.error('Auto-save error:', error);
          store.dispatch(failSaving(error instanceof Error ? error.message : 'Save failed'));
        }
      }, SAVE_DELAY);
    } else {
      console.log('Middleware: No user ID, skipping save');
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
      const conversation = chatState.conversations.find((c: any) => c.id === conversationId);
      
      if (conversation) {
        // Get topic practice state if active
        const topicPracticeState = state.topicPractice;
        
        // Save conversation first to ensure it exists
        const dbConvId = await chatPersistence.saveConversation(conversation, userId, topicPracticeState);
        
        // Find and save the message
        const message = conversation.messages.find((m: any) => m.id === (messageId || `msg-${Date.now()}-user`));
        if (message) {
          await chatPersistence.saveMessage(message, dbConvId);
        }
      }
      break;
    }
    
    case 'chat/addMessage':
    case 'conversation/addMessage': {
      const { conversationId, message } = action.payload;
      const conversation = chatState.conversations.find((c: any) => c.id === conversationId);
      
      if (conversation) {
        // Get topic practice state if active
        const topicPracticeState = state.topicPractice;
        
        // Save conversation first to ensure it exists
        const dbConvId = await chatPersistence.saveConversation(conversation, userId, topicPracticeState);
        
        // Save the message
        await chatPersistence.saveMessage(message, dbConvId);
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
        await chatPersistence.saveMessage(conversation.messages[0], dbConvId);
      }
      break;
    }
    
    case 'chat/redoTopicQuestion/fulfilled':
    case 'topicPractice/redoTopicQuestion/fulfilled':
    case 'chat/getNextTopicQuestion/fulfilled':
    case 'topicPractice/getNextTopicQuestion/fulfilled': {
      const { conversationId, message } = action.payload;
      const conversation = chatState.conversations.find((c: any) => c.id === conversationId);
      
      if (conversation) {
        // Get topic practice state if active
        const topicPracticeState = state.topicPractice;
        
        const dbConvId = await chatPersistence.saveConversation(conversation, userId, topicPracticeState);
        await chatPersistence.saveMessage(message, dbConvId);
      }
      break;
    }
  }
}