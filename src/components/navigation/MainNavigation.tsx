import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, User, LogOut, Home, ArrowLeft, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const MainNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

  const isActive = (path: string) => location.pathname === path;
  const showBackButton = location.pathname !== '/';

  // Fetch user profile information
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserProfile(data);
      }
    };

    fetchUserProfile();
  }, [user]);

  const getUserTypeRoute = (userType: string) => {
    switch (userType) {
      case 'household':
        return '/household-users';
      case 'government':
        return '/government-users';
      case 'business':
      case 'processor':
      case 'collector':
        return '/industry-users';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-eco-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">WC</span>
              </div>
              <span className="font-bold text-xl text-gray-900">WasteConnect</span>
            </Link>

            {/* Back and Home buttons */}
            <div className="flex items-center space-x-2">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-eco-green-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              )}
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-eco-green-600 bg-eco-green-50' 
                    : 'text-gray-600 hover:text-eco-green-600'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user && userProfile && (
              <>
                <Link
                  to="/ai-assistant"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/ai-assistant') 
                      ? 'text-eco-green-600 bg-eco-green-50' 
                      : 'text-gray-600 hover:text-eco-green-600'
                  }`}
                >
                  <Bot className="h-4 w-4" />
                  <span>AI Assistant</span>
                </Link>

                <Link
                  to="/marketplace"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/marketplace') 
                      ? 'text-eco-green-600 bg-eco-green-50' 
                      : 'text-gray-600 hover:text-eco-green-600'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Marketplace</span>
                </Link>

                <Link
                  to={getUserTypeRoute(userProfile.user_type)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(getUserTypeRoute(userProfile.user_type)) 
                      ? 'text-eco-green-600 bg-eco-green-50' 
                      : 'text-gray-600 hover:text-eco-green-600'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {/* Government users get access to Features */}
                {userProfile.user_type === 'government' && (
                  <Link
                    to="/features"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/features') 
                        ? 'text-eco-green-600 bg-eco-green-50' 
                        : 'text-gray-600 hover:text-eco-green-600'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Features</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user && userProfile ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {userProfile.full_name || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link to="/enhanced-auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
