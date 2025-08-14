
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserActivities } from '@/hooks/useUserActivities';
import { useAuth } from '@/hooks/useAuth';
import { RefreshCw, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = () => {
  const { user } = useAuth();
  const { activities, loading, getActivityIcon, getStatusColor, refreshActivities } = useUserActivities();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Please log in to view your activities</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest waste management activities</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshActivities}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-eco-green-100 text-eco-green-700 text-lg">
                    {getActivityIcon(activity.activity_type)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status.replace('_', ' ')}
                  </Badge>
                  {activity.metadata?.amount && (
                    <p className="text-xs text-gray-500">
                      ₹{activity.metadata.amount}
                    </p>
                  )}
                  {activity.metadata?.quantity && (
                    <p className="text-xs text-gray-500">
                      {activity.metadata.quantity} items
                    </p>
                  )}
                  {activity.metadata?.credits_earned && (
                    <p className="text-xs text-green-600 font-medium">
                      +{activity.metadata.credits_earned} credits
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No recent activity</p>
              <p className="text-sm">Start by scheduling a pickup, listing items, or submitting collections!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
