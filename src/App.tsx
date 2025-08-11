import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import UserTypes from '@/pages/UserTypes';
import Features from '@/pages/Features';
import About from '@/pages/About';
import CitizenReports from '@/pages/CitizenReports';
import WasteEntry from '@/pages/WasteEntry';
import Marketplace from '@/pages/Marketplace';
import RouteOptimization from '@/pages/RouteOptimization';
import CarbonCreditTrading from '@/pages/CarbonCreditTrading';
import GreenBonds from '@/pages/GreenBonds';
import ESGReportingTools from '@/pages/ESGReportingTools';
import ESGInvestmentTracking from '@/pages/ESGInvestmentTracking';
import ESGReportingCompliance from '@/pages/ESGReportingCompliance';
import MicroFinance from '@/pages/MicroFinance';
import EnhancedAuth from '@/pages/EnhancedAuth';
import EsgTradingFloor from '@/components/esg/ESGTradingFloor';
import WaterCreditTrading from "@/pages/WaterCreditTrading";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('accessToken'); // Check if the token exists

  if (!isAuthenticated) {
    // Redirect to the home page if not authenticated
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/user-types" element={<ProtectedRoute><UserTypes /></ProtectedRoute>} />
              <Route path="/features" element={<ProtectedRoute><Features /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
              <Route path="/citizen-reports" element={<ProtectedRoute><CitizenReports /></ProtectedRoute>} />
              <Route path="/waste-entry" element={<ProtectedRoute><WasteEntry /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/route-optimization" element={<ProtectedRoute><RouteOptimization /></ProtectedRoute>} />
              <Route path="/carbon-credit-trading" element={<ProtectedRoute><CarbonCreditTrading /></ProtectedRoute>} />
              <Route path="/green-bonds" element={<ProtectedRoute><GreenBonds /></ProtectedRoute>} />
              <Route path="/esg-reporting-tools" element={<ProtectedRoute><ESGReportingTools /></ProtectedRoute>} />
              <Route path="/esg-investment-tracking" element={<ProtectedRoute><ESGInvestmentTracking /></ProtectedRoute>} />
              <Route path="/esg-reporting-compliance" element={<ProtectedRoute><ESGReportingCompliance /></ProtectedRoute>} />
              <Route path="/micro-finance" element={<ProtectedRoute><MicroFinance /></ProtectedRoute>} />
              <Route path="/enhanced-auth" element={<ProtectedRoute><EnhancedAuth /></ProtectedRoute>} />
              <Route path="/esg" element={<ProtectedRoute><EsgTradingFloor /></ProtectedRoute>} />
              <Route path="/water-credit-trading" element={<ProtectedRoute><WaterCreditTrading /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
