import { User } from '@supabase/supabase-js';

export interface LoginForm {
  email: string;
  password: string;
  showPassword: boolean;
}

export interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export interface OnboardingData {
  fullName: string;
  targetScore: string;
  currentLevel: string;
  testDate: string;
  howDidYouHear: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  loginForm: LoginForm;
  signupForm: SignupForm;
  needsOnboarding: boolean;
  onboardingData: OnboardingData;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  fullName?: string;
}