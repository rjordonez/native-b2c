import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import type { RootState } from '../../store/types';
import { AuthState } from './types';
import { signIn, signUp, signOut, checkAuth, completeOnboarding } from './authThunks';

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
    howDidYouHear: '',
  },
};

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

// Re-export thunks for convenience
export { signIn, signUp, signOut, checkAuth, completeOnboarding } from './authThunks';

export default authSlice.reducer;