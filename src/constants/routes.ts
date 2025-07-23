import { RouteConfig } from '../shared/types/common';
import { BookOpen, Microphone } from 'phosphor-react';

export const ROUTES: RouteConfig[] = [
  {
    path: '/',
    name: 'Dashboard',
    icon: BookOpen,
  },
  {
    path: '/voice-practice',
    name: 'Voice Practice',
    icon: Microphone,
  },
];