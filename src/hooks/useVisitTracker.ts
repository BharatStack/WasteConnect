
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useVisitTracker = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const trackVisit = async () => {
      try {
        // Log visit as an activity instead
        await supabase.from('user_activities').insert({
          user_id: user.id,
          activity_type: 'app_visit',
          title: 'App Visit',
          description: 'User visited the application',
          status: 'completed',
          metadata: {
            timestamp: new Date().toISOString(),
            visit_date: new Date().toISOString().split('T')[0]
          }
        });
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, [user]);
};
