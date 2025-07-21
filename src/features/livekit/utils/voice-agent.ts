import { Room } from 'livekit-client';
import type { ReceivedChatMessage, TextStreamData } from '@livekit/components-react';
import { APP_CONFIG_DEFAULTS } from '../app-config';
import type { AppConfig, SandboxConfig } from '../types';

export const CONFIG_ENDPOINT = import.meta.env.VITE_APP_CONFIG_ENDPOINT;
export const SANDBOX_ID = import.meta.env.VITE_SANDBOX_ID;

export const THEME_STORAGE_KEY = 'theme-mode';
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export function transcriptionToChatMessage(
  textStream: TextStreamData,
  room: Room
): ReceivedChatMessage {
  console.log('🔥 Converting transcription:', {
    text: textStream.text,
    participantIdentity: textStream.participantInfo.identity,
    localParticipantIdentity: room.localParticipant.identity,
    remoteParticipants: Array.from(room.remoteParticipants.values()).map((p: any) => ({ 
      identity: p.identity, 
      isAgent: p.isAgent 
    }))
  });

  const from = textStream.participantInfo.identity === room.localParticipant.identity
    ? room.localParticipant
    : Array.from(room.remoteParticipants.values()).find(
        (p: any) => p.identity === textStream.participantInfo.identity
      );

  console.log('🔥 Found participant:', from);

  return {
    id: textStream.streamInfo.id,
    timestamp: textStream.streamInfo.timestamp,
    message: textStream.text,
    from,
  };
}

export function getOrigin(): string {
  return window.location.origin;
}

export const getAppConfig = async (): Promise<AppConfig> => {
  if (CONFIG_ENDPOINT) {
    const origin = getOrigin();
    const sandboxId = SANDBOX_ID ?? origin.split('.')[0];

    try {
      const response = await fetch(CONFIG_ENDPOINT, {
        cache: 'no-store',
        headers: { 'X-Sandbox-ID': sandboxId },
      });

      const remoteConfig: SandboxConfig = await response.json();
      const config: AppConfig = { ...APP_CONFIG_DEFAULTS };

      for (const [key, entry] of Object.entries(remoteConfig)) {
        if (entry === null) continue;
        if (
          key in config &&
          typeof config[key as keyof AppConfig] === entry.type &&
          typeof config[key as keyof AppConfig] === typeof entry.value
        ) {
          // @ts-expect-error I'm not sure quite how to appease TypeScript, but we've thoroughly checked types above
          config[key as keyof AppConfig] = entry.value as AppConfig[keyof AppConfig];
        }
      }

      return config;
    } catch (error) {
      console.error('Failed to fetch app config:', error);
    }
  }

  return APP_CONFIG_DEFAULTS;
};