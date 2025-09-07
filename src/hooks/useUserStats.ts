
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
      // Calculate stats from existing data
      const [activitiesData, wasteData, creditsData] = await Promise.all([
        supabase.from('user_activities').select('*').eq('user_id', user.id),
        supabase.from('waste_data_logs').select('*').eq('user_id', user.id),
        supabase.from('carbon_credits').select('*').eq('user_id', user.id)
      ]);

      // Calculate aggregated stats
      const activities = activitiesData.data || [];
      const wasteLogs = wasteData.data || [];
      const credits = creditsData.data || [];

      const totalWaste = wasteLogs.reduce((sum, log) => sum + (log.quantity || 0), 0);
      const totalCO2 = wasteLogs.reduce((sum, log) => {
        const envImpact = log.environmental_impact as any;
        return sum + (envImpact?.co2_reduction_kg || 0);
      }, 0);
      const totalCredits = credits.reduce((sum, credit) => sum + (credit.credits_amount || 0), 0);

      setStats({
        total_waste_logged_kg: totalWaste,
        total_co2_reduced_kg: totalCO2,
        total_cost_savings: totalCO2 * 3800, // INR conversion
        total_credits_earned: totalCredits,
        total_earnings: totalCredits * 50, // Example rate
        activities_completed: activities.length,
        current_level: Math.floor(activities.length / 10) + 1,
        total_visits: Math.floor(Math.random() * 100) + 20, // Placeholder
        streak_days: 1,
        last_activity_date: activities[0]?.created_at?.split('T')[0] || null
      });
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
      .channel('user-activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_activities',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refresh stats when activities change
          fetchUserStats();
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
