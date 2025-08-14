
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  total_waste_logged_kg: number;
  total_co2_reduced_kg: number;
  total_cost_savings: number;
  total_credits_earned: number;
  total_earnings: number;
  activities_completed: number;
  current_level: number;
  total_visits: number;
  streak_days: number;
  last_activity_date: string | null;
}

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    fetchUserStats();
    setupRealtimeSubscription();
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Initialize user stats if not exists
      await supabase.rpc('initialize_user_stats', {
        p_user_id: user.id
      });

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Set default values on error
      setStats({
        total_waste_logged_kg: 0,
        total_co2_reduced_kg: 0,
        total_cost_savings: 0,
        total_credits_earned: 0,
        total_earnings: 0,
        activities_completed: 0,
        current_level: 1,
        total_visits: 0,
        streak_days: 0,
        last_activity_date: null
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('user-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_stats',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('User stats changed:', payload);
          if (payload.new) {
            setStats(payload.new as UserStats);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    stats,
    loading,
    refreshStats: fetchUserStats
  };
};
