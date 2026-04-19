
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, BarChart3, ShoppingCart, Info, LogOut, User, Leaf, Moon, Sun } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProfileMenu from '@/components/ProfileMenu';
import { useTheme } from '@/contexts/ThemeContext';

const MainNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3
    },
    {
      href: '/marketplace',
      label: 'Marketplace',
      icon: ShoppingCart
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: BarChart3
    },
    {
      href: '/about',
      label: 'About',
      icon: Info
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const NavigationContent = () => (
    <>
      {navItems.map(item => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActivePath(item.href)
                ? 'bg-eco-green-100 text-eco-green-700 dark:bg-eco-green-900/40 dark:text-eco-green-400'
                : 'text-gray-600 hover:text-eco-green-600 hover:bg-eco-green-50 dark:text-gray-300 dark:hover:text-eco-green-400 dark:hover:bg-eco-green-900/20'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-eco-green-600 dark:text-eco-green-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">WasteConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationContent />

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 hover:text-eco-green-600 dark:text-gray-300 dark:hover:text-eco-green-400 transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center ml-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                <ProfileMenu />
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/enhanced-auth">Sign In</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            {isAuthenticated && <ProfileMenu />}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 dark:bg-gray-900 dark:border-gray-700">
                <div className="flex flex-col space-y-2 mt-8">
                  <NavigationContent />
                  
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 px-3 py-2">
                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {user?.email?.split('@')[0] || 'User'}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                        <Link to="/enhanced-auth" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
