export interface SettingsState {
  profile: {
    name: string;
    profilePicture: string; // Deprecated - use avatarUrl
    avatarUrl: string | null;
  };
  billing: {
    plan: 'free' | 'pro' | 'premium';
    nextBillingDate: string;
    amount: number;
  };
  isLoading: boolean;
  error: string | null;
}

export interface ProfileUpdatePayload {
  name?: string;
  profilePicture?: string; // Deprecated
  avatarUrl?: string;
}

export interface BillingUpdatePayload {
  plan?: 'free' | 'pro' | 'premium';
  nextBillingDate?: string;
  amount?: number;
}