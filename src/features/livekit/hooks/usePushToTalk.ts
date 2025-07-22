import { useEffect, useRef, useState } from 'react';
import { Room } from 'livekit-client';

interface UsePushToTalkProps {
  room: Room;
  onToggleMicrophone: (enabled: boolean) => Promise<void>;
  isMicrophoneEnabled: boolean;
}

export function usePushToTalk({ 
  room, 
  onToggleMicrophone, 
  isMicrophoneEnabled 
}: UsePushToTalkProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [isPttActive, setIsPttActive] = useState(false);
  const holdingRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat && !holdingRef.current) {
        event.preventDefault();
        holdingRef.current = true;
        setIsHolding(true);
        setIsPttActive(true);

        try {
          if (!isMicrophoneEnabled) {
            await onToggleMicrophone(true);
          }
          
          await room.localParticipant.performRpc({
            destinationIdentity: "ptt-agent",
            method: "start_turn",
            payload: ""
          });
        } catch (error) {
          console.error('Error starting PTT turn:', error);
        }
      }
    };

    const handleKeyUp = async (event: KeyboardEvent) => {
      if (event.code === 'Space' && holdingRef.current) {
        event.preventDefault();
        holdingRef.current = false;
        setIsHolding(false);
        setIsPttActive(false);

        try {
          await room.localParticipant.performRpc({
            destinationIdentity: "ptt-agent",
            method: "end_turn",
            payload: ""
          });
        } catch (error) {
          console.error('Error ending PTT turn:', error);
        }
      }
    };

    const handleBlur = async () => {
      if (holdingRef.current) {
        holdingRef.current = false;
        setIsHolding(false);
        setIsPttActive(false);

        try {
          await room.localParticipant.performRpc({
            destinationIdentity: "ptt-agent",
            method: "end_turn",
            payload: ""
          });
        } catch (error) {
          console.error('Error ending PTT turn on blur:', error);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [room, onToggleMicrophone, isMicrophoneEnabled]);

  return {
    isHolding,
    isPttActive
  };
}