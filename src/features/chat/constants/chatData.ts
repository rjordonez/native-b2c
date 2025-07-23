import { Conversation } from '../types';

// Sample conversations for development
export const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    title: 'IELTS Speaking Practice',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    messages: [
      {
        id: '1-1',
        content: 'Hi! I\'d like to practice IELTS speaking. Can you help me with Part 1 questions?',
        sender: 'user',
        timestamp: '2024-01-15T10:00:00Z',
      },
      {
        id: '1-2',
        content: 'Of course! I\'d be happy to help you practice IELTS speaking Part 1 questions. These are typically about familiar topics like your hometown, work/studies, hobbies, and daily routine. What topic would you like to start with?',
        sender: 'assistant',
        timestamp: '2024-01-15T10:01:00Z',
      },
      {
        id: '1-3',
        content: 'Let\'s start with questions about my hometown.',
        sender: 'user',
        timestamp: '2024-01-15T10:02:00Z',
      },
      {
        id: '1-4',
        content: 'Great choice! Here are some typical Part 1 questions about your hometown:\n\n1. Where do you come from?\n2. What do you like most about your hometown?\n3. Has your hometown changed much in recent years?\n4. Would you like to live in your hometown in the future?\n\nTake your time to answer each question. Remember to give detailed responses and explain your reasons.',
        sender: 'assistant',
        timestamp: '2024-01-15T10:03:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'Writing Task 2 Discussion',
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-16T14:45:00Z',
    messages: [
      {
        id: '2-1',
        content: 'I need help with IELTS Writing Task 2. The topic is about environmental protection.',
        sender: 'user',
        timestamp: '2024-01-16T14:00:00Z',
      },
      {
        id: '2-2',
        content: 'I\'d be happy to help you with Writing Task 2! Environmental protection is a common IELTS topic. Could you share the specific question you\'re working on? This will help me provide more targeted guidance on structure, key points, and vocabulary.',
        sender: 'assistant',
        timestamp: '2024-01-16T14:01:00Z',
      },
    ],
  },
]

export const CHAT_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 2000,
  TYPING_DELAY: 1000,
  AUTO_SAVE_DELAY: 3000,
  MAX_CONVERSATIONS: 50,
} as const;