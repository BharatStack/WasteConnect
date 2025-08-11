
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SecureAuthForm from '@/components/auth/SecureAuthForm';
import ProfileSetup from '@/components/auth/ProfileSetup';
import GovernmentDashboard from '@/components/government/GovernmentDashboard';
import { User, Session } from '@supabase/supabase-js';

const EnhancedAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuthAndProfile = async (currentSession: Session | null) => {
      if (!mounted) return;
      
      console.log('Checking auth and profile for session:', currentSession?.user?.email);
      
      if (currentSession?.user) {
        setUser(currentSession.user);
        setSession(currentSession);
        
        try {
          // Check if user has completed profile setup
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          
          console.log('Profile data:', profile, 'Error:', error);
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
          }
          
          setUserProfile(profile);
          
          if (!profile || !profile.full_name) {
            console.log('Profile setup needed');
            setNeedsProfileSetup(true);
          } else {
            console.log('Profile complete, user type:', profile.user_type);
            setNeedsProfileSetup(false);
            
            // Redirect based on user type
            if (profile.user_type === 'government') {
              console.log('Government user - staying on this page');
              // Stay on this page to show government dashboard
            } else {
              console.log('Regular user - redirecting to dashboard');
              navigate('/dashboard');
              return;
            }
          }
        } catch (error) {
          console.error('Error in profile check:', error);
          setNeedsProfileSetup(true);
        }
      } else {
        console.log('No user session found');
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setNeedsProfileSetup(false);
      }
      
      if (mounted) {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        await checkAuthAndProfile(session);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session?.user?.email);
      await checkAuthAndProfile(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuthSuccess = () => {
    console.log('Auth success handler called');
    // The auth state change handler will take care of navigation
  };

  const handleProfileComplete = async () => {
    console.log('Profile complete handler called');
    setNeedsProfileSetup(false);
    
    if (user) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserProfile(profile);
        
        if (profile?.user_type === 'government') {
          console.log('Government user - staying on this page after profile setup');
          // Stay on this page for government dashboard
        } else {
          console.log('Regular user - redirecting to dashboard after profile setup');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching updated profile:', error);
        navigate('/dashboard');
      }
    }
  };

  console.log('EnhancedAuth render state:', {
    isLoading,
    hasUser: !!user,
    hasProfile: !!userProfile,
    needsProfileSetup,
    userType: userProfile?.user_type
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eco-green-50 to-eco-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600 mx-auto mb-4"></div>
          <p className="text-eco-green-600">Loading...</p>
        </div>
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

  if (user && userProfile?.user_type === 'government') {
    return <GovernmentDashboard />;
  }

  if (user && !needsProfileSetup) {
    // This should not happen as we should have redirected to dashboard
    console.log('User authenticated but still on auth page - redirecting');
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-eco-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-eco-green-800 mb-2">WasteConnect</h1>
          <p className="text-eco-green-600">Enhanced secure authentication</p>
        </div>
        <SecureAuthForm onSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
};

export default EnhancedAuth;
