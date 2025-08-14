
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, TrendingUp, Target, Zap } from 'lucide-react';
import { useUserStats } from '@/hooks/useUserStats';

const VisitTracker = () => {
  const { stats, loading } = useUserStats();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const visitStats = [
    {
      title: 'Total Visits',
      value: stats?.total_visits || 0,
      icon: CalendarDays,
      description: 'App sessions',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Activity Streak',
      value: `${stats?.streak_days || 0} days`,
      icon: Target,
      description: 'Consecutive active days',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Engagement Level',
      value: stats?.total_visits && stats.total_visits > 50 ? 'High' : stats?.total_visits && stats.total_visits > 20 ? 'Medium' : 'Getting Started',
      icon: TrendingUp,
      description: 'Based on your activity',
      color: stats?.total_visits && stats.total_visits > 50 ? 'text-green-600' : stats?.total_visits && stats.total_visits > 20 ? 'text-yellow-600' : 'text-blue-600',
      bgColor: stats?.total_visits && stats.total_visits > 50 ? 'bg-green-50' : stats?.total_visits && stats.total_visits > 20 ? 'bg-yellow-50' : 'bg-blue-50'
    },
    {
      title: 'Keep Going!',
      value: 'Come back tomorrow',
      icon: Zap,
      description: 'Build your streak',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {visitStats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription className="text-xs">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VisitTracker;
