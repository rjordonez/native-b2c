import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import type { RootState } from '../../store/types';
import { AuthState, LoginCredentials, SignupCredentials } from './types';
import { supabase } from '../../shared/services/supabase';
import { generateDefaultAvatar } from '../../lib/supabase/avatars';
import { updateProfile } from '../settings/settingsSlice';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  loginForm: {
    email: '',
    password: '',
    showPassword: false,
  },
  signupForm: {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    showPassword: false,
    showConfirmPassword: false,
  },
  needsOnboarding: false,
  onboardingData: {
    fullName: '',
    targetScore: '',
    currentLevel: '',
    testDate: '',
    studyGoal: '',
  },
};

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

export const completeOnboarding = createAsyncThunk(
  'auth/completeOnboarding',
  async (onboardingData: any, { dispatch }) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

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
          study_goal: onboardingData.studyGoal,
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
          study_goal: onboardingData.studyGoal,
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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      // Reset needsOnboarding when user changes - it will be checked by checkAuth
      if (!action.payload) {
        state.needsOnboarding = false;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // Login form actions
    updateLoginForm: (state, action: PayloadAction<Partial<typeof state.loginForm>>) => {
      state.loginForm = { ...state.loginForm, ...action.payload };
    },
    toggleLoginPasswordVisibility: (state) => {
      state.loginForm.showPassword = !state.loginForm.showPassword;
    },
    resetLoginForm: (state) => {
      state.loginForm = initialState.loginForm;
    },
    // Signup form actions
    updateSignupForm: (state, action: PayloadAction<Partial<typeof state.signupForm>>) => {
      state.signupForm = { ...state.signupForm, ...action.payload };
    },
    toggleSignupPasswordVisibility: (state) => {
      state.signupForm.showPassword = !state.signupForm.showPassword;
    },
    toggleSignupConfirmPasswordVisibility: (state) => {
      state.signupForm.showConfirmPassword = !state.signupForm.showConfirmPassword;
    },
    resetSignupForm: (state) => {
      state.signupForm = initialState.signupForm;
    },
    // Onboarding actions
    updateOnboardingData: (state, action: PayloadAction<Partial<typeof state.onboardingData>>) => {
      state.onboardingData = { ...state.onboardingData, ...action.payload };
    },
    setNeedsOnboarding: (state, action: PayloadAction<boolean>) => {
      state.needsOnboarding = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.needsOnboarding = action.payload.needsOnboarding;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign in';
      });
    
    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
        // New users need onboarding
        state.needsOnboarding = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign up';
      });
    
    // Sign Out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.needsOnboarding = false;
        state.error = null;
        // Reset all forms and onboarding data
        state.loginForm = initialState.loginForm;
        state.signupForm = initialState.signupForm;
        state.onboardingData = initialState.onboardingData;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign out';
      });
    
    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.user;
        state.needsOnboarding = action.payload.needsOnboarding;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.needsOnboarding = false;
      });
    
    // Complete Onboarding
    builder
      .addCase(completeOnboarding.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.isLoading = false;
        state.needsOnboarding = false;
        state.onboardingData = initialState.onboardingData;
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to complete onboarding';
      });
  },
});

export const { 
  setUser, 
  clearError,
  updateLoginForm,
  toggleLoginPasswordVisibility,
  resetLoginForm,
  updateSignupForm,
  toggleSignupPasswordVisibility,
  toggleSignupConfirmPasswordVisibility,
  resetSignupForm,
  updateOnboardingData,
  setNeedsOnboarding,
} = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;