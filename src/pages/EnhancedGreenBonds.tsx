
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import EnhancedGreenBonds from '@/components/bonds/EnhancedGreenBonds';
import { Navigate } from 'react-router-dom';

const EnhancedGreenBondsPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/enhanced-auth" replace />;
  }

  return <EnhancedGreenBonds />;
};

export default EnhancedGreenBondsPage;
