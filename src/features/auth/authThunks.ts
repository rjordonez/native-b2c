import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import { LoginCredentials, SignupCredentials } from './types';
import { supabase } from '../../shared/services/supabase';
import { generateDefaultAvatar } from '../../lib/supabase/avatars';
import { updateProfile } from '../settings/settingsSlice';
import type { AppDispatch } from '../../store/types';

// Async thunks for authentication
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: LoginCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) throw error;
    
    const user = data.user;
    if (!user) throw new Error('No user returned');
    
    // Check onboarding status
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('auth_user_id', user.id);
    
    const needsOnboarding = !profiles || profiles.length === 0 || !profiles[0]?.onboarding_completed;
    
    return { user, needsOnboarding };
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (credentials: SignupCredentials) => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName,
        },
      },
    });
    
    if (error) throw error;
    return data.user;
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { user: null, needsOnboarding: false };
    }

    // Check onboarding status from user_profiles table
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('auth_user_id', user.id);

    if (error) {
      // If profile doesn't exist or there's an error, assume needs onboarding
      return { 
        user, 
        needsOnboarding: true 
      };
    }

    // Check if profile exists
    if (!profiles || profiles.length === 0) {
      return { 
        user, 
        needsOnboarding: true 
      };
    }

    return { 
      user, 
      needsOnboarding: !profiles[0]?.onboarding_completed 
    };
  }
);

export const completeOnboarding = createAsyncThunk<
  any,
  any,
  { dispatch: AppDispatch }
>(
  'auth/completeOnboarding',
  async (onboardingData: any, { dispatch }) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get UTM data from localStorage

    // Generate default gradient avatar
    const avatarUrl = generateDefaultAvatar(user.email || user.id, onboardingData.fullName);

    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!existingProfile) {
      // Create new profile
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          auth_user_id: user.id,
          email: user.email || '',
          full_name: onboardingData.fullName,
          target_band_score: parseFloat(onboardingData.targetScore),
          current_level: onboardingData.currentLevel,
          test_date: onboardingData.testDate || null,
          how_did_you_hear: onboardingData.howDidYouHear,
          avatar_url: avatarUrl,
          onboarding_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }
    } else {
      // Update existing profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: onboardingData.fullName,
          target_band_score: parseFloat(onboardingData.targetScore),
          current_level: onboardingData.currentLevel,
          test_date: onboardingData.testDate || null,
          how_did_you_hear: onboardingData.howDidYouHear,
          avatar_url: avatarUrl,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('auth_user_id', user.id);

      if (error) {
        throw error;
      }
    }

    // Update Redux profile state immediately
    dispatch(updateProfile({
      name: onboardingData.fullName,
      avatarUrl: avatarUrl,
    }));

    return onboardingData;
  }
);