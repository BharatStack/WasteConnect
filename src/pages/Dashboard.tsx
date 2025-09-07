
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
  Building,
  Trash2,
  Route,
  FileText,
  Shield,
  Banknote,
  ChartLine,
  Truck
} from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import EnvironmentalImpactCard from '@/components/dashboard/EnvironmentalImpactCard';
import VisitTracker from '@/components/dashboard/VisitTracker';
import { useVisitTracker } from '@/hooks/useVisitTracker';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Track user visit
  useVisitTracker();

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const featureCards = [
    {
      id: 'waste-data',
      title: 'Waste Data Entry',
      description: 'Record waste data with automatic environmental impact calculations',
      icon: Trash2,
      route: '/waste-entry',
      buttonText: 'Log Waste Data',
      color: 'text-green-600'
    },
    {
      id: 'route-optimization',
      title: 'Route Optimization',
      description: 'Optimize collection routes to reduce fuel consumption and emissions',
      icon: Route,
      route: '/route-optimization',
      buttonText: 'Optimize Routes',
      color: 'text-blue-600'
    },
    {
      id: 'analytics-reports',
      title: 'Analytics & Reports',
      description: 'View detailed analytics and generate environmental impact reports',
      icon: BarChart3,
      route: '/analytics',
      buttonText: 'View Analytics',
      color: 'text-purple-600'
    },
    {
      id: 'circular-economy',
      title: 'Circular Economy',
      description: 'Buy and sell recyclable materials in our marketplace',
      icon: Recycle,
      route: '/marketplace',
      buttonText: 'Browse Marketplace',
      color: 'text-green-600'
    },
    {
      id: 'citizen-reports',
      title: 'Citizen Reports',
      description: 'Report environmental issues and track municipality responses',
      icon: FileText,
      route: '/citizen-reports',
      buttonText: 'View Reports',
      color: 'text-orange-600'
    },
    {
      id: 'esg-investment',
      title: 'ESG Investment Tracking',
      description: 'Track ESG performance and access impact investment opportunities with AI-powered insights',
      icon: ChartLine,
      route: '/esg',
      buttonText: 'View ESG Dashboard',
      color: 'text-green-600'
    },
    {
      id: 'green-bonds',
      title: 'Green Bonds Platform',
      description: 'Invest in green bonds for waste infrastructure projects with verified environmental impact',
      icon: Banknote,
      route: '/green-bonds',
      buttonText: 'Explore Green Bonds',
      color: 'text-blue-600'
    },
    {
      id: 'micro-finance',
      title: 'Micro-Finance Solutions',
      description: 'Access micro-loans and financial inclusion services for waste workers and small businesses',
      icon: DollarSign,
      route: '/micro-finance',
      buttonText: 'Apply for Micro-Finance',
      color: 'text-purple-600'
    },
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
      route: '/plastic-credit-marketplace',
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
      route: '/corporate-offset-programs',
      buttonText: 'Corporate Solutions',
      color: 'text-gray-600'
    },
    {
      id: 'green-insurance',
      title: 'Green Insurance',
      description: 'Parametric insurance for waste management operations and climate risk coverage',
      icon: Shield,
      route: '/features',
      buttonText: 'Get Insurance Quote',
      color: 'text-teal-600'
    },
    {
      id: 'equipment-financing',
      title: 'Equipment Financing',
      description: 'Asset financing for waste collection vehicles, sorting equipment, and processing machinery',
      icon: Truck,
      route: '/features',
      buttonText: 'Apply for Equipment Loan',
      color: 'text-indigo-600'
    },
    {
      id: 'esg-reporting',
      title: 'ESG Reporting & Compliance',
      description: 'Automated ESG reporting platform with regulatory compliance tracking',
      icon: FileText,
      route: '/esg-reporting-tools',
      buttonText: 'Access Reporting Tools',
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">
            Manage your waste data, track environmental impact, and access green finance opportunities
          </p>
        </div>

        {/* Stats Dashboard */}
        <DashboardStats />

        {/* Visit Tracking Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagement Insights</h2>
          <p className="text-gray-600 mb-4">Track your app usage and build streaks to maximize your environmental impact!</p>
          <VisitTracker />
        </div>

        {/* Analytics and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EnvironmentalImpactCard />
          <RecentActivity />
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Features</h2>
          <p className="text-gray-600 mb-6">Explore all the features available in your dashboard</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Card key={card.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <IconComponent className={`h-6 w-6 ${card.color}`} />
                      {card.title}
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleNavigation(card.route)}
                      className="w-full bg-eco-green-600 hover:bg-eco-green-700 text-white"
                    >
                      {card.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
