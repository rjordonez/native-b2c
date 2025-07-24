import { RouteConfig } from '../shared/types/common';
import { House, ChatCircle, BookOpen } from 'phosphor-react';

export const ROUTES: RouteConfig[] = [
  {
    path: '/library',
    name: 'Library',
    icon: BookOpen,
  },
  {
    path: '/chat',
    name: 'Chat',
    icon: ChatCircle,
  },
];