
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, BarChart3, ShoppingCart, Info, LogOut, User, Leaf } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProfileMenu from '@/components/ProfileMenu';

const MainNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
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
      href: '/marketplace',
      label: 'Marketplace',
      icon: ShoppingCart
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3
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
                ? 'bg-eco-green-100 text-eco-green-700'
                : 'text-gray-600 hover:text-eco-green-600 hover:bg-eco-green-50'
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
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-eco-green-600" />
              <span className="text-xl font-bold text-gray-900">WasteConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationContent />
            
            {isAuthenticated ? (
              <div className="flex items-center ml-4 pl-4 border-l border-gray-200">
                <ProfileMenu />
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/enhanced-auth">Sign In</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && <ProfileMenu />}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-2 mt-8">
                  <NavigationContent />
                  
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 px-3 py-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {user?.email?.split('@')[0] || 'User'}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
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
