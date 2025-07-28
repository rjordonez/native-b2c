import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { startSaving, completeSaving, failSaving } from '../slices/saveStatusSlice';
import { getUserFriendlyError, logError } from '../../utils/error';
import { DELAYS } from '../../constants/timing';
import { SAVE_ACTIONS } from './autoSaveMiddleware/constants';
import {
  handleCreateConversation,
  handleAddUserMessage,
  handleAddMessage,
  handleUpdateConversationTitle,
  handleDeleteConversation,
  handleStartTopicPractice,
  handleTopicQuestionUpdate,
  handleUpdateMessage,
  handleEnhanceTranscript
} from './autoSaveMiddleware/handlers';

// Debounce timer for saves
let saveTimer: NodeJS.Timeout | null = null;

export const autoSaveMiddleware: Middleware = (store) => (next) => (action) => {
  // Execute the action first
  const result = next(action);
  
  const actionType = (action as AnyAction).type;
  
  
  // Check if this action should trigger a save
  if (SAVE_ACTIONS.includes(actionType)) {
    const state = store.getState();
    const userId = state.auth.user?.id;
    
    
    // Only save if user is authenticated
    if (userId) {
      // For critical actions like adding messages, save immediately
      const criticalActions = ['conversation/addMessage', 'chat/addMessage'];
      const isCritical = criticalActions.includes(actionType);
      
      if (isCritical) {
        // Save immediately for critical actions
        store.dispatch(startSaving());
        
        (async () => {
          try {
            await handleSave(action as AnyAction, state, userId);
            store.dispatch(completeSaving());
          } catch (error) {
            console.error('[AutoSave] Save failed:', error);
            logError(error, 'AutoSave');
            const userMessage = getUserFriendlyError(error);
            store.dispatch(failSaving(userMessage));
          }
        })();
      } else {
        // Clear existing timer for non-critical saves
        if (saveTimer) {
          clearTimeout(saveTimer);
        }
        
        // Only start saving if not already saving
        const saveStatus = state.saveStatus;
        if (!saveStatus.isSaving) {
          store.dispatch(startSaving());
        }
        
        // Debounce non-critical saves
        saveTimer = setTimeout(async () => {
          try {
            // Get fresh state for the save
            const freshState = store.getState();
            await handleSave(action as AnyAction, freshState, userId);
            store.dispatch(completeSaving());
          } catch (error) {
            console.error('[AutoSave] Save failed:', error);
            logError(error, 'AutoSave');
            const userMessage = getUserFriendlyError(error);
            store.dispatch(failSaving(userMessage));
          }
        }, DELAYS.AUTOSAVE_DEBOUNCE);
      }
    }
  }
  
  return result;
};

/**
 * Handle the save operation based on action type
 */
async function handleSave(action: AnyAction, state: RootState, userId: string) {
  switch (action.type) {
    case 'chat/createConversation/fulfilled':
    case 'conversation/createConversation/fulfilled':
      await handleCreateConversation(action, userId);
      break;
    
    case 'chat/addUserMessage':
    case 'conversation/addUserMessage':
      await handleAddUserMessage(action, state, userId);
      break;
    
    case 'chat/addMessage':
    case 'conversation/addMessage':
      await handleAddMessage(action, state, userId);
      break;
    
    case 'chat/updateConversationTitle':
    case 'conversation/updateConversationTitle':
      await handleUpdateConversationTitle(action);
      break;
    
    case 'chat/deleteConversation':
    case 'conversation/deleteConversation':
      await handleDeleteConversation(action);
      break;
    
    // Topic practice actions
    case 'chat/startTopicPractice/fulfilled':
    case 'topicPractice/startTopicPractice/fulfilled':
      await handleStartTopicPractice(action, userId);
      break;
    
    case 'chat/redoTopicQuestion/fulfilled':
    case 'topicPractice/redoTopicQuestion/fulfilled':
    case 'chat/getNextTopicQuestion/fulfilled':
    case 'topicPractice/getNextTopicQuestion/fulfilled':
      await handleTopicQuestionUpdate(action, state, userId);
      break;
    
    // Handle message updates (transcription/pronunciation)
    case 'chat/updateMessage':
    case 'conversation/updateMessage':
      await handleUpdateMessage(action, state, userId);
      break;
    
    // Handle enhanced transcript
    case 'topicPractice/enhanceTranscript/fulfilled':
      await handleEnhanceTranscript(action, state);
      break;
  }
}