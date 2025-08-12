
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Award, 
  Activity, 
  Target,
  BarChart3
} from 'lucide-react';

interface DashboardStatsProps {
  userStats: any;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userStats }) => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Credits Earned',
      value: userStats?.total_credits_earned || 0,
      icon: Target,
      color: 'text-eco-green-600',
      bgColor: 'bg-eco-green-50'
    },
    {
      title: 'Total Earnings',
      value: `₹${userStats?.total_earnings || 0}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Activities Completed',
      value: userStats?.activities_completed || 0,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Current Level',
      value: userStats?.current_level || 1,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
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
        {stats.map((stat, index) => {
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
