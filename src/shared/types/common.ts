import { Icon } from 'phosphor-react';

export interface RouteConfig {
  path: string;
  name: string;
  icon: Icon;
}

export interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}