
import { useState, useEffect } from 'react';

export const useAppOpeningAnimation = () => {
  const [hasShownOpening, setHasShownOpening] = useState(() => {
    // Check if opening animation has been shown in this session
    return sessionStorage.getItem('wasteconnect-opening-shown') === 'true';
  });

  const [showOpeningAnimation, setShowOpeningAnimation] = useState(!hasShownOpening);

  const handleOpeningComplete = () => {
    setShowOpeningAnimation(false);
    setHasShownOpening(true);
    sessionStorage.setItem('wasteconnect-opening-shown', 'true');
  };

  // Reset animation flag when user navigates away and comes back
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('wasteconnect-opening-shown');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    showOpeningAnimation,
    handleOpeningComplete
  };
};
