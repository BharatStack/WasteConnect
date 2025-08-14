
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Award, 
  Activity, 
  Target,
  BarChart3,
  IndianRupee,
  Leaf
} from 'lucide-react';
import { useUserStats } from '@/hooks/useUserStats';

const DashboardStats: React.FC = () => {
  const navigate = useNavigate();
  const { stats, loading } = useUserStats();

  if (loading) {
    return (
      <div className="mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Waste Logged',
      value: `${stats?.total_waste_logged_kg?.toFixed(1) || 0} kg`,
      icon: Target,
      color: 'text-eco-green-600',
      bgColor: 'bg-eco-green-50'
    },
    {
      title: 'CO₂ Reduced',
      value: `${stats?.total_co2_reduced_kg?.toFixed(1) || 0} kg`,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Cost Savings',
      value: `₹${stats?.total_cost_savings?.toFixed(0) || 0}`,
      icon: IndianRupee,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Activities Completed',
      value: stats?.activities_completed || 0,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Impact Overview</h2>
        <Button
          onClick={() => navigate('/analytics')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          View Analytics
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardStats;
