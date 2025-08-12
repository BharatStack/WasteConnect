
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Droplets, 
  Recycle, 
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  Coins,
  Globe,
  Building
} from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import EnvironmentalImpactCard from '@/components/dashboard/EnvironmentalImpactCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user stats with fallback
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setUserStats(stats || {
        total_credits_earned: 0,
        total_earnings: 0,
        activities_completed: 0,
        current_level: 1
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set default values on error
      setUserStats({
        total_credits_earned: 0,
        total_earnings: 0,
        activities_completed: 0,
        current_level: 1
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tradingOptions = [
    {
      id: 'carbon-credit',
      title: 'Carbon Credit Trading',
      description: 'Generate, buy, and sell verified carbon credits from waste reduction activities',
      icon: Leaf,
      route: '/carbon-credit-trading',
      buttonText: 'Start Carbon Trading',
      color: 'text-green-600'
    },
    {
      id: 'plastic-credit',
      title: 'Plastic Credit Marketplace',
      description: 'Trade plastic credits and achieve plastic neutrality through verified collection',
      icon: Recycle,
      route: '/marketplace',
      buttonText: 'Trade Plastic Credits',
      color: 'text-blue-600'
    },
    {
      id: 'green-crypto',
      title: 'Green Cryptocurrency',
      description: 'Earn and trade green crypto backed by verified environmental assets',
      icon: Coins,
      route: '/esg',
      buttonText: 'Access Green Crypto',
      color: 'text-purple-600'
    },
    {
      id: 'water-credit',
      title: 'Water Credit Trading',
      description: 'Generate water credits from conservation through improved waste management',
      icon: Droplets,
      route: '/water-credit-trading',
      buttonText: 'Trade Water Credits',
      color: 'text-blue-600'
    },
    {
      id: 'biodiversity',
      title: 'Biodiversity Credits',
      description: 'Earn credits for waste management activities that protect natural habitats',
      icon: Globe,
      route: '/features',
      buttonText: 'Generate Bio Credits',
      color: 'text-green-600'
    },
    {
      id: 'corporate',
      title: 'Corporate Offset Programs',
      description: 'B2B marketplace for corporate carbon offsetting and sustainability programs',
      icon: Building,
      route: '/green-bonds',
      buttonText: 'Corporate Solutions',
      color: 'text-gray-600'
    }
  ];

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your waste data, environmental impact, and green finance opportunities</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-8 border-b border-gray-200">
            <button 
              className="pb-4 px-1 border-b-2 border-eco-green-600 text-eco-green-600 font-medium"
            >
              Overview
            </button>
            <button 
              onClick={() => navigate('/features')}
              className="pb-4 px-1 text-gray-500 hover:text-gray-700 font-medium"
            >
              Core Features
            </button>
            <button 
              onClick={() => navigate('/green-bonds')}
              className="pb-4 px-1 text-gray-500 hover:text-gray-700 font-medium"
            >
              Green Finance
            </button>
            <button 
              className="pb-4 px-1 border-b-2 border-eco-green-600 text-eco-green-600 font-medium"
            >
              Trading & Markets
            </button>
            <button 
              onClick={() => navigate('/esg-reporting-tools')}
              className="pb-4 px-1 text-gray-500 hover:text-gray-700 font-medium"
            >
              Integrations
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <DashboardStats userStats={userStats} />

        {/* Environmental Asset Trading Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Environmental Asset Trading</h2>
          <p className="text-gray-600 mb-6">Trade carbon credits, plastic credits, and other environmental assets</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradingOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card key={option.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <IconComponent className={`h-6 w-6 ${option.color}`} />
                      {option.title}
                    </CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleNavigation(option.route)}
                      className="w-full bg-eco-green-600 hover:bg-eco-green-700 text-white"
                    >
                      {option.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Analytics and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnvironmentalImpactCard 
            environmentalImpact={{
              carbonFootprintReduced: userStats?.total_credits_earned || 125,
              wasteRecycled: userStats?.activities_completed * 10 || 150,
              energySaved: userStats?.total_credits_earned * 5 || 625,
              waterSaved: userStats?.activities_completed * 20 || 300
            }}
          />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
