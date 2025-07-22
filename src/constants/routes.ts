import { RouteConfig } from '../shared/types/common';
import { House, BookOpen, Microphone } from 'phosphor-react';

export const ROUTES: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    icon: House,
  },
  {
    path: '/library',
    name: 'Library',
    icon: BookOpen,
  },
  {
    path: '/voice-practice',
    name: 'Voice Practice',
    icon: Microphone,
  },
];