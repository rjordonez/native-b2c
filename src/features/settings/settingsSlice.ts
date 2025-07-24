import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/types';
import { SettingsState, ProfileUpdatePayload, BillingUpdatePayload } from './types';
import { supabase } from '../../shared/services/supabase';

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'settings/fetchUserProfile',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('full_name, avatar_url')
      .eq('auth_user_id', userId)
      .single();
    
    if (error) {
      // If no profile exists, return defaults
      if (error.code === 'PGRST116') {
        return {
          name: 'User',
          avatarUrl: null,
        };
      }
      throw error;
    }
    
    return {
      name: data.full_name || 'User',
      avatarUrl: data.avatar_url || null,
    };
  }
);

const initialState: SettingsState = {
  profile: {
    name: 'User',
    profilePicture: '', // Deprecated - use avatarUrl
    avatarUrl: null,
  },
  billing: {
    plan: 'free',
    nextBillingDate: '',
    amount: 0,
  },
  isLoading: false,
  error: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile.name = action.payload.name;
        state.profile.avatarUrl = action.payload.avatarUrl;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      });
  },
});

export const { updateProfile, updateBilling, resetSettings } = settingsSlice.actions;

export const selectProfile = (state: RootState) => state.settings.profile;
export const selectBilling = (state: RootState) => state.settings.billing;
export const selectProfileName = (state: RootState) => state.settings.profile.name;
export const selectProfilePicture = (state: RootState) => state.settings.profile.profilePicture;
export const selectAvatarUrl = (state: RootState) => state.settings.profile.avatarUrl;

export default settingsSlice.reducer;