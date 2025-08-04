
import { useState, useEffect } from 'react';

export const useLoadingAnimation = () => {
  const [hasShownAnimation, setHasShownAnimation] = useState(() => {
    // Check if animation has been shown in this session
    return sessionStorage.getItem('wasteconnect-animation-shown') === 'true';
  });

  const [showAnimation, setShowAnimation] = useState(!hasShownAnimation);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setHasShownAnimation(true);
    sessionStorage.setItem('wasteconnect-animation-shown', 'true');
  };

  // Reset animation flag when user navigates away and comes back
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('wasteconnect-animation-shown');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    showAnimation,
    handleAnimationComplete
  };
};
