import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { checkAuth, setUser } from './authSlice';
import { fetchUserProfile } from '../settings/settingsSlice';
import { subscriptions } from '../../shared/services/supabaseService';
import { loadConversations } from '../chat/store/conversationSlice';
import { restoreTopicPracticeState } from '../chat/store/topicPracticeSlice';

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
      // Load user's conversations and topic practice state
      dispatch(loadConversations(user.id))
        .unwrap()
        .then((result) => {
          // Restore topic practice state if it exists
          if (result.topicPracticeState) {
            dispatch(restoreTopicPracticeState(result.topicPracticeState));
          }
        })
        .catch((error) => {
          console.error('Failed to load conversations:', error);
        });
    }
  }, [dispatch, user?.id, needsOnboarding]);

  return <>{children}</>;
};

export default AuthProvider;