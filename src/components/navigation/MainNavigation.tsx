
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  Zap, 
  Info, 
  LayoutDashboard, 
  Trash2, 
  Route, 
  ShoppingCart, 
  BarChart3, 
  MessageSquare 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const MainNavigation = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const publicRoutes = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/user-types', label: 'User Types', icon: Users },
    { path: '/features', label: 'Features', icon: Zap },
    { path: '/about', label: 'About', icon: Info },
  ];

  const privateRoutes = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/waste-entry', label: 'Waste Entry', icon: Trash2 },
    { path: '/route-optimization', label: 'Routes', icon: Route },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/citizen-reports', label: 'Reports', icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-eco-green-700">
              WasteConnect
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {publicRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link key={route.path} to={route.path}>
                    <Button 
                      variant={isActive(route.path) ? "default" : "ghost"}
                      className={`flex items-center gap-2 ${
                        isActive(route.path) 
                          ? "bg-eco-green-600 hover:bg-eco-green-700" 
                          : "hover:bg-eco-green-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {route.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-1">
              {privateRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link key={route.path} to={route.path}>
                    <Button 
                      variant={isActive(route.path) ? "default" : "ghost"}
                      size="sm"
                      className={`flex items-center gap-1 ${
                        isActive(route.path) 
                          ? "bg-eco-green-600 hover:bg-eco-green-700" 
                          : "hover:bg-eco-green-50"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {route.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-eco-green-600 hover:bg-eco-green-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
