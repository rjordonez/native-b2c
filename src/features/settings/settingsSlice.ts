import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/types';
import { SettingsState, ProfileUpdatePayload, BillingUpdatePayload } from './types';

const initialState: SettingsState = {
  profile: {
    name: 'John Doe',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  billing: {
    plan: 'free',
    nextBillingDate: '2024-08-15',
    amount: 0,
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<ProfileUpdatePayload>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateBilling: (state, action: PayloadAction<BillingUpdatePayload>) => {
      state.billing = { ...state.billing, ...action.payload };
    },
    resetSettings: () => initialState,
  },
});

export const { updateProfile, updateBilling, resetSettings } = settingsSlice.actions;

export const selectProfile = (state: RootState) => state.settings.profile;
export const selectBilling = (state: RootState) => state.settings.billing;
export const selectProfileName = (state: RootState) => state.settings.profile.name;
export const selectProfilePicture = (state: RootState) => state.settings.profile.profilePicture;

export default settingsSlice.reducer;