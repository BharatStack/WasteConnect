
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  const getSystemTheme = () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const handleSystemTheme = () => {
    const systemTheme = getSystemTheme();
    setTheme(systemTheme);
  };

  return (
    <header className="bg-white dark:bg-eco-green-900 shadow-sm border-b border-gray-200 dark:border-eco-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-eco-green-700 dark:text-eco-green-300">WasteConnect</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white dark:bg-eco-green-800 border border-gray-200 dark:border-eco-green-600" align="end" forceMount>
                <DropdownMenuItem className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-eco-green-700">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-eco-green-700">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-eco-green-600" />
                <div className="px-2 py-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Theme</p>
                  <div className="grid grid-cols-3 gap-1">
                    <Button
                      variant={theme === 'light' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleThemeChange('light')}
                      className="h-8 px-2"
                    >
                      <Sun className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleThemeChange('dark')}
                      className="h-8 px-2"
                    >
                      <Moon className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSystemTheme}
                      className="h-8 px-2"
                    >
                      <Monitor className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-eco-green-600" />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-eco-green-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
