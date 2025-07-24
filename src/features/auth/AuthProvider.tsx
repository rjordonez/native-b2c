import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { checkAuth, setUser } from './authSlice';
import { fetchUserProfile } from '../settings/settingsSlice';
import { subscriptions } from '../../shared/services/supabaseService';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    // Check initial auth state
    dispatch(checkAuth());

    // Subscribe to auth changes
    const { data: subscription } = subscriptions.subscribeToAuthChanges((user) => {
      dispatch(setUser(user));
    });

    // Cleanup subscription
    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [dispatch]);

  // Fetch user profile when user is authenticated AND not in onboarding
  const needsOnboarding = useAppSelector((state) => state.auth.needsOnboarding);
  
  useEffect(() => {
    if (user?.id && !needsOnboarding) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch, user?.id, needsOnboarding]);

  return <>{children}</>;
};

export default AuthProvider;