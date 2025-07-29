import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/services/supabase';
import BlockSpinner from '../../../shared/components/layout/BlockSpinner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Authentication failed');
          setTimeout(() => navigate('/auth'), 2000);
          return;
        }

        if (session) {
          // Successfully authenticated, check if user needs onboarding
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('onboarding_completed')
            .eq('auth_user_id', session.user.id)
            .single();

          if (!profile || !profile.onboarding_completed) {
            navigate('/onboarding', { replace: true });
          } else {
            navigate('/library', { replace: true });
          }
        } else {
          // No session found, redirect to auth
          navigate('/auth', { replace: true });
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Something went wrong');
        setTimeout(() => navigate('/auth'), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <BlockSpinner className="mx-auto mb-4" />
        <p className="text-gray-600">{error || 'Completing sign in...'}</p>
      </div>
    </div>
  );
};

export default AuthCallback;