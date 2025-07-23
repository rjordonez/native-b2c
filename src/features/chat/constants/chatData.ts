import { Conversation } from '../types';

// Empty conversations - topics will be created dynamically
export const SAMPLE_CONVERSATIONS: Conversation[] = [];

export const CHAT_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 2000,
  TYPING_DELAY: 1000,
  AUTO_SAVE_DELAY: 3000,
  MAX_CONVERSATIONS: 50,
} as const;