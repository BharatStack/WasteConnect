
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface FeatureTrackerProps {
  featureName: string;
  children: React.ReactNode;
}

const FeatureTracker = ({ featureName, children }: FeatureTrackerProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      trackFeatureUsage();
    }
  }, [user, featureName]);

  const trackFeatureUsage = async () => {
    try {
      // For now, we'll just log to console
      // In a real app, you'd want to store this in a feature_usage table
      console.log(`Feature accessed: ${featureName} by user: ${user?.id}`);
      
      // You could extend this to store in Supabase:
      // await supabase.from('feature_usage').insert({
      //   user_id: user.id,
      //   feature_name: featureName,
      //   accessed_at: new Date().toISOString()
      // });
    } catch (error) {
      console.error('Error tracking feature usage:', error);
    }
  };

  return <>{children}</>;
};

export default FeatureTracker;
