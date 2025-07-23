import { RouteConfig } from '../shared/types/common';
import { House, ChatCircle } from 'phosphor-react';

export const ROUTES: RouteConfig[] = [
  {
    path: '/',
    name: 'Dashboard',
    icon: House,
  },
  {
    path: '/chat',
    name: 'Chat',
    icon: ChatCircle,
  },
];