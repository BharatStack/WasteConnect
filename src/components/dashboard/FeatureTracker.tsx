
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserActivities } from '@/hooks/useUserActivities';

interface FeatureTrackerProps {
  featureName: string;
  children: React.ReactNode;
}

const FeatureTracker = ({ featureName, children }: FeatureTrackerProps) => {
  const { user } = useAuth();
  const { createActivity } = useUserActivities();

  useEffect(() => {
    if (user) {
      trackFeatureUsage();
    }
  }, [user, featureName]);

  const trackFeatureUsage = async () => {
    try {
      console.log(`Feature accessed: ${featureName} by user: ${user?.id}`);
      
      // Create activity log for feature usage
      await createActivity(
        'feature_accessed',
        'Feature Accessed',
        `Accessed ${featureName} feature`,
        'active',
        { feature_name: featureName }
      );
    } catch (error) {
      console.error('Error tracking feature usage:', error);
    }
  };

  return <>{children}</>;
};

export default FeatureTracker;
