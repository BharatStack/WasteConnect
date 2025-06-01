
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, User, LogOut, Home } from 'lucide-react';

const MainNavigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-eco-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FW</span>
            </div>
            <span className="font-bold text-xl text-gray-900">FarmWaste</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
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

            {user && (
              <>
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
                  to="/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'text-eco-green-600 bg-eco-green-50' 
                      : 'text-gray-600 hover:text-eco-green-600'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
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
