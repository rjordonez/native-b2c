import { RouteConfig } from '../shared/types/common';
import { House, BookOpen, PencilSimple, Microphone } from 'phosphor-react';

export const ROUTES: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    icon: House,
  },
  {
    path: '/practice',
    name: 'Practice',
    icon: PencilSimple,
  },
  {
    path: '/topic-library',
    name: 'Topic Library',
    icon: BookOpen,
  },
  {
    path: '/livekit',
    name: 'Voice Chat',
    icon: Microphone,
  },
];