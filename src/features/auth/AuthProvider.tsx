import React, { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { checkAuth, setUser } from './authSlice';
import { subscriptions } from '../../shared/services/supabaseService';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

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

  return <>{children}</>;
};

export default AuthProvider;