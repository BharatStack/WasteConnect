
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, CheckCircle, AlertCircle, BarChart3, Users } from 'lucide-react';

interface ReportStatsProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    avgResolutionTime: number;
    thisMonth: number;
    lastMonth: number;
  };
}

const ReportStats = ({ stats }: ReportStatsProps) => {
  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const monthlyGrowth = stats.lastMonth > 0 ? Math.round(((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100) : 0;

  const statCards = [
    {
      title: "Total Reports",
      value: stats.total,
      description: "All time reports",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending",
      value: stats.pending,
      description: "Awaiting action",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      description: "Being resolved",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Resolved",
      value: stats.resolved,
      description: `${resolutionRate}% resolution rate`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Avg Resolution",
      value: `${stats.avgResolutionTime}h`,
      description: "Average time to resolve",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "This Month",
      value: stats.thisMonth,
      description: `${monthlyGrowth >= 0 ? '+' : ''}${monthlyGrowth}% from last month`,
      icon: Users,
      color: monthlyGrowth >= 0 ? "text-green-600" : "text-red-600",
      bgColor: monthlyGrowth >= 0 ? "bg-green-50" : "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
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

export default ReportStats;
