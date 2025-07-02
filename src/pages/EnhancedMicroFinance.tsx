
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import MicroFinanceDashboard from '@/components/microfinance/MicroFinanceDashboard';
import { Navigate } from 'react-router-dom';

const EnhancedMicroFinance = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/enhanced-auth" replace />;
  }

  return <MicroFinanceDashboard />;
};

export default EnhancedMicroFinance;
