import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const {
    toast
  } = useToast();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDark(!isDark);
    toast({
      title: `Switched to ${!isDark ? 'dark' : 'light'} mode`,
      duration: 2000
    });
  };
  return <header className="sticky top-0 z-50 w-full bg-white dark:bg-eco-green-900/90 shadow-sm backdrop-filter backdrop-blur-md bg-opacity-90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-eco-green-500 to-eco-green-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-eco-green-700 dark:text-white">WasteConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-eco-green-600 dark:text-eco-green-300 hover:text-eco-green-800 dark:hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/user-types" className="text-eco-green-600 dark:text-eco-green-300 hover:text-eco-green-800 dark:hover:text-white transition-colors">
              User Types
            </Link>
            <Link to="/features" className="text-eco-green-600 dark:text-eco-green-300 hover:text-eco-green-800 dark:hover:text-white transition-colors">
              Features
            </Link>
            
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button className="bg-eco-green-600 hover:bg-eco-green-700 text-white">
              <User className="h-4 w-4 mr-2" />
              <span>Login</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-eco-green-700 dark:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <nav className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/dashboard" className="text-eco-green-600 dark:text-eco-green-300 hover:text-eco-green-800 dark:hover:text-white transition-colors px-4 py-2">
                Dashboard
              </Link>
              <Link to="/user-types" className="text-eco-green-600 dark:text-eco-green-300 hover:text-eco-green-800 dark:hover:text-white transition-colors px-4 py-2">
                User Types
              </Link>
              <Link to="/features" className="text-eco-green-600 dark:text-eco-green-300 hover:text-eco-green-800 dark:hover:text-white transition-colors px-4 py-2">
                Features
              </Link>
              <Link to="/about" className="text-eco-green-600 dark:text-eco-green-300 hover:text-eco-green-800 dark:hover:text-white transition-colors px-4 py-2">
                About
              </Link>
              <div className="flex items-center justify-between pt-2 px-4">
                <Button variant="ghost" size="sm" onClick={toggleTheme} className="rounded-full text-eco-green-700 dark:text-white">
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span className="ml-2">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </Button>
              </div>
              <Button className="bg-eco-green-600 hover:bg-eco-green-700 text-white mx-4">
                <User className="h-4 w-4 mr-2" />
                <span>Login</span>
              </Button>
            </div>
          </nav>}
      </div>
    </header>;
};
export default Header;