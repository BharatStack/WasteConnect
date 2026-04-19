
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };



  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
            <AvatarFallback className="bg-eco-green-100 text-eco-green-700 dark:bg-eco-green-900 dark:text-eco-green-300">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" align="end" forceMount>
        {/* Profile Info Section */}
        <div className="flex items-center space-x-3 p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
            <AvatarFallback className="bg-eco-green-100 text-eco-green-700 dark:bg-eco-green-900 dark:text-eco-green-300 text-lg">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-eco-green-600 dark:text-eco-green-400 mt-1">
              {user?.email_confirmed_at ? '✓ Verified' : '⚠ Unverified'}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

        {/* Menu Items */}
        <DropdownMenuItem 
          onClick={handleProfile}
          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          <User className="mr-3 h-4 w-4" />
          <div>
            <div className="text-sm font-medium">Profile</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Manage your profile information</div>
          </div>
        </DropdownMenuItem>



        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <div>
            <div className="text-sm font-medium">Sign out</div>
            <div className="text-xs text-red-500 dark:text-red-400">Sign out of your account</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
