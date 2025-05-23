
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-eco-green-50 dark:bg-eco-green-900/20 p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 relative">
          <div className="text-9xl font-extrabold text-eco-green-700/20 dark:text-eco-green-500/20">404</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-eco-green-600 dark:text-eco-green-400">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 15.5L9 14V12M10.5 8.5H10.51M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-eco-green-800 dark:text-white mb-4">Page Not Found</h1>
        
        <p className="text-eco-green-600 dark:text-eco-green-300 mb-8">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-eco-green-600 text-eco-green-600 hover:bg-eco-green-50 dark:border-eco-green-500 dark:text-eco-green-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          <Button className="bg-eco-green-600 hover:bg-eco-green-700 text-white">
            <Home className="mr-2 h-4 w-4" />
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
