
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useVisitTracker = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const trackVisit = async () => {
      try {
        // Call the track_user_visit function
        const { error } = await supabase.rpc('track_user_visit', {
          p_user_id: user.id
        });

        if (error) {
          console.error('Error tracking visit:', error);
        }
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, [user]);
};
