
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserActivity {
  id: string;
  activity_type: string;
  title: string;
  description: string;
  status: string;
  metadata: any;
  related_id?: string;
  created_at: string;
  updated_at: string;
}

export const useUserActivities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    fetchActivities();
    setupRealtimeSubscription();
  }, [user]);

  const fetchActivities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setActivities(data || []);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch activities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('user-activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_activities',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Activity change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setActivities(prev => [payload.new as UserActivity, ...prev.slice(0, 19)]);
          } else if (payload.eventType === 'UPDATE') {
            setActivities(prev => prev.map(activity => 
              activity.id === payload.new.id ? payload.new as UserActivity : activity
            ));
          } else if (payload.eventType === 'DELETE') {
            setActivities(prev => prev.filter(activity => activity.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createActivity = async (
    activityType: string,
    title: string,
    description: string,
    status: string,
    metadata: any = {},
    relatedId?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          title,
          description,
          status,
          metadata,
          related_id: relatedId
        });

      if (error) throw error;

      // Real-time subscription will handle updating the state
    } catch (error: any) {
      console.error('Error creating activity:', error);
      toast({
        title: "Error",
        description: "Failed to log activity",
        variant: "destructive",
      });
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'pickup_scheduled':
        return '📅';
      case 'pickup_updated':
        return '🚚';
      case 'waste_listed':
        return '📝';
      case 'item_status_changed':
        return '🔄';
      case 'plastic_collected':
        return '♻️';
      case 'verification_updated':
        return '✅';
      case 'credit_purchased':
        return '💰';
      case 'credit_sold':
        return '💸';
      case 'connection_made':
        return '🤝';
      case 'report_submitted':
        return '📊';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'verified':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return {
    activities,
    loading,
    createActivity,
    getActivityIcon,
    getStatusColor,
    refreshActivities: fetchActivities
  };
};
