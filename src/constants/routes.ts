import { RouteConfig } from '../shared/types/common';
import { House, Info, ChartBar } from 'phosphor-react';

export const ROUTES: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    icon: House,
  },
  {
    path: '/about',
    name: 'About',
    icon: Info,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: ChartBar,
  },
];