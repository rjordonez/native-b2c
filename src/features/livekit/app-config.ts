import type { AppConfig } from './types';

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'IELTS Practice',
  pageTitle: 'IELTS Voice Practice',
  pageDescription: 'Practice IELTS speaking with AI voice agent',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: false,
  isPreConnectBufferEnabled: false,

  logo: '/native-logo.png',
  accent: '#3b82f6',
  logoDark: '/native-logo.png',
  accentDark: '#60a5fa',
  startButtonText: 'Start Practice Session',
};