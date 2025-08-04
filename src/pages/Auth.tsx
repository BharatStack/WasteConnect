
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SecureAuthForm from '@/components/auth/SecureAuthForm';
import ProfileSetup from '@/components/auth/ProfileSetup';
import { User, Session } from '@supabase/supabase-js';

const Auth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user has completed profile setup
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!profile || !profile.full_name) {
            setNeedsProfileSetup(true);
          } else {
            navigate('/dashboard');
          }
        }
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user has completed profile setup
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (!profile || !profile.full_name) {
          setNeedsProfileSetup(true);
        } else {
          navigate('/dashboard');
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuthSuccess = () => {
    // The auth state change handler will take care of navigation
  };

  const handleProfileComplete = () => {
    setNeedsProfileSetup(false);
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eco-green-50 to-eco-green-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  if (user && needsProfileSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-eco-green-100 flex items-center justify-center p-4">
        <ProfileSetup onComplete={handleProfileComplete} />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-eco-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-eco-green-800 mb-2">WasteConnect</h1>
          <p className="text-eco-green-600">Secure access to your waste management platform</p>
        </div>
        <SecureAuthForm onSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
};

export default Auth;
