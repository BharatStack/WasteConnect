
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
}

const ProtectedRoute = ({ children, allowedUserTypes }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        console.log('ProtectedRoute: Fetching profile for user:', user.id);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error('ProtectedRoute: Error fetching profile:', error);
          }
          
          console.log('ProtectedRoute: Profile data:', data);
          setUserProfile(data);
        } catch (error) {
          console.error('ProtectedRoute: Error in fetchUserProfile:', error);
        }
      }
      setProfileLoading(false);
    };

    if (user) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
      setProfileLoading(false);
    }
  }, [user]);

  console.log('ProtectedRoute state:', {
    loading,
    profileLoading,
    isAuthenticated,
    hasUser: !!user,
    hasProfile: !!userProfile,
    currentPath: location.pathname
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to auth');
    return <Navigate to="/enhanced-auth" replace />;
  }

  // Check if Features page requires government access
  if (location.pathname === '/features' && userProfile?.user_type !== 'government') {
    console.log('ProtectedRoute: Non-government user trying to access features, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Check for specific user type restrictions
  if (allowedUserTypes && userProfile && !allowedUserTypes.includes(userProfile.user_type)) {
    console.log('ProtectedRoute: User type not allowed for this route, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
