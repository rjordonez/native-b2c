import { Room } from 'livekit-client';
import type { ReceivedChatMessage, TextStreamData } from '@livekit/components-react';

/**
 * Converts LiveKit transcription data to chat message format
 */
export function transcriptionToChatMessage(
  textStream: TextStreamData,
  room: Room
): ReceivedChatMessage {
  const from = textStream.participantInfo.identity === room.localParticipant.identity
    ? room.localParticipant
    : Array.from(room.remoteParticipants.values()).find(
        (p: any) => p.identity === textStream.participantInfo.identity
      );

  return {
    id: textStream.streamInfo.id,
    timestamp: textStream.streamInfo.timestamp,
    message: textStream.text,
    from,
  };
}