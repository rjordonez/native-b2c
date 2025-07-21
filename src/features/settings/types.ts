export interface SettingsState {
  profile: {
    name: string;
    profilePicture: string;
  };
  billing: {
    plan: 'free' | 'pro' | 'premium';
    nextBillingDate: string;
    amount: number;
  };
}

export interface ProfileUpdatePayload {
  name?: string;
  profilePicture?: string;
}

export interface BillingUpdatePayload {
  plan?: 'free' | 'pro' | 'premium';
  nextBillingDate?: string;
  amount?: number;
}