import { AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../../types';
import { chatPersistence } from '../../../features/chat/services/chatPersistence';
import { supabase } from '../../../shared/services/supabase';
import { transformTopicPracticeForDB } from './transformers';

export async function handleCreateConversation(action: AnyAction, userId: string) {
  const conversation = action.payload;
  await chatPersistence.saveConversation(conversation, userId);
}

export async function handleAddUserMessage(action: AnyAction, state: RootState, userId: string) {
  const { conversationId, messageId } = action.payload;
  const chatState = state.conversation;
  const conversation = chatState.conversations.find((c: { id: string }) => c.id === conversationId);
  
  if (conversation) {
    // Get topic practice state if active
    const topicPracticeState = state.topicPractice;
    const transformedTopicState = transformTopicPracticeForDB(topicPracticeState);
    
    // Save conversation first to ensure it exists
    const dbConvId = await chatPersistence.saveConversation(conversation, userId, transformedTopicState);
    
    // Find and save the message
    const message = conversation.messages.find((m: { id: string }) => m.id === (messageId || `msg-${Date.now()}-user`));
    if (message) {
      await chatPersistence.saveMessage(message, dbConvId, userId);
    }
  }
}

export async function handleAddMessage(action: AnyAction, state: RootState, userId: string) {
  const { conversationId, message } = action.payload;
  const chatState = state.conversation;
  const conversation = chatState.conversations.find((c: { id: string }) => c.id === conversationId);
  
  if (conversation) {
    // Get topic practice state if active
    const topicPracticeState = state.topicPractice;
    const transformedTopicState = transformTopicPracticeForDB(topicPracticeState);
    
    // Save conversation first to ensure it exists
    const dbConvId = await chatPersistence.saveConversation(conversation, userId, transformedTopicState);
    
    // Save the message
    await chatPersistence.saveMessage(message, dbConvId, userId);
  }
}

export async function handleUpdateConversationTitle(action: AnyAction) {
  const { conversationId, title } = action.payload;
  if (title) {
    await chatPersistence.updateConversationTitle(conversationId, title);
  }
}

export async function handleDeleteConversation(action: AnyAction) {
  const conversationId = action.payload;
  await chatPersistence.deleteConversation(conversationId);
}

export async function handleStartTopicPractice(action: AnyAction, userId: string) {
  const { conversation, topicData } = action.payload;
  
  // Save conversation with topic practice state
  const dbConvId = await chatPersistence.saveConversation(conversation, userId, topicData);
  
  // Save the first message (question)
  if (conversation.messages.length > 0) {
    await chatPersistence.saveMessage(conversation.messages[0], dbConvId, userId);
  }
}

export async function handleTopicQuestionUpdate(action: AnyAction, state: RootState, userId: string) {
  const { conversationId, message } = action.payload;
  const chatState = state.conversation;
  const conversation = chatState.conversations.find((c: { id: string }) => c.id === conversationId);
  
  if (conversation) {
    // Get topic practice state if active
    const topicPracticeState = state.topicPractice;
    const transformedTopicState = transformTopicPracticeForDB(topicPracticeState);
    
    const dbConvId = await chatPersistence.saveConversation(conversation, userId, transformedTopicState);
    await chatPersistence.saveMessage(message, dbConvId, userId);
  }
}

export async function handleUpdateMessage(action: AnyAction, state: RootState, userId: string) {
  const { conversationId, messageId, updates } = action.payload;
  const chatState = state.conversation;
  const conversation = chatState.conversations.find((c: { id: string }) => c.id === conversationId);
  
  if (conversation) {
    const message = conversation.messages.find((m: { id: string }) => m.id === messageId);
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
          .maybeSingle();
        
        if (dbMsg) {
          // Save transcription if updated
          if (updates.transcription && !updates.transcription.isLoading) {
            await chatPersistence.saveTranscription(dbMsg.id, updates.transcription);
          }
          
          // Save pronunciation if updated
          if (updates.pronunciation && !updates.pronunciation.isLoading) {
            await chatPersistence.savePronunciation(dbMsg.id, updates.pronunciation);
          }
        } else if (!updates.transcription?.isLoading && !updates.pronunciation?.isLoading) {
          // Message doesn't exist in DB yet, but we have final data - save the complete message
          const completeMessage = { ...message, ...updates };
          await chatPersistence.saveMessage(completeMessage, dbConv.id, userId);
        }
      }
    }
  }
}

export async function handleEnhanceTranscript(action: AnyAction, state: RootState) {
  const { conversationId, message } = action.payload;
  const chatState = state.conversation;
  const conversation = chatState.conversations.find((c: { id: string }) => c.id === conversationId);
  
  if (conversation && message) {
    // Find the original message that was enhanced
    const originalMessages = conversation.messages.filter((m: { sender: string; transcription?: { text: string } }) => 
      m.sender === 'user' && m.transcription && m.transcription.text
    );
    const lastUserMessage = originalMessages[originalMessages.length - 1];
    
    if (lastUserMessage && lastUserMessage.transcription) {
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
}