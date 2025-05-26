
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'pickup_scheduled',
      title: 'Pickup Scheduled',
      description: 'Electronic waste pickup scheduled for tomorrow',
      time: '2 hours ago',
      status: 'scheduled',
    },
    {
      id: 2,
      type: 'connection_made',
      title: 'New Connection',
      description: 'Connected with GreenTech Recycling',
      time: '1 day ago',
      status: 'active',
    },
    {
      id: 3,
      type: 'waste_listed',
      title: 'Waste Item Listed',
      description: 'Organic waste added to inventory',
      time: '2 days ago',
      status: 'available',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'available':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest waste management activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-eco-green-100 text-eco-green-700">
                  {activity.title.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
