import { useMemo } from 'react';
import {
  type ReceivedChatMessage,
  type TextStreamData,
  useChat,
  useRoomContext,
  useTranscriptions,
} from '@livekit/components-react';
import { transcriptionToChatMessage } from '../../features/livekit/utils/voice-agent';

export default function useChatAndTranscription() {
  const transcriptions: TextStreamData[] = useTranscriptions();
  const chat = useChat();
  const room = useRoomContext();

  const mergedTranscriptions = useMemo(() => {
    console.log('🔥 Converting transcriptions to chat messages:', transcriptions);
    
    // Create synthetic agent chat messages from transcriptions if transcriptions are empty
    // but we know there should be agent messages
    const syntheticAgentMessages: ReceivedChatMessage[] = [];
    
    // If transcriptions are empty, we'll manually create agent messages
    // This is a temporary fix to ensure agent messages appear in chat
    if (transcriptions.length === 0) {
      // We could get agent transcripts from the agent control bar or other sources
      // For now, let's make sure the chat system works with actual transcriptions
    }
    
    const convertedTranscriptions = transcriptions.map((transcription) => {
      const chatMessage = transcriptionToChatMessage(transcription, room);
      console.log('🔥 Converted transcription:', transcription, 'to chat message:', chatMessage);
      return chatMessage;
    });
    
    const merged: Array<ReceivedChatMessage> = [
      ...convertedTranscriptions,
      ...syntheticAgentMessages,
      ...chat.chatMessages,
    ];
    console.log('🔥 Final merged messages:', merged);
    return merged.sort((a, b) => a.timestamp - b.timestamp);
  }, [transcriptions, chat.chatMessages, room]);

  return { messages: mergedTranscriptions, send: chat.send };
}
