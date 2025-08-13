
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import { useAuth } from "@/hooks/useAuth";
import { useAppOpeningAnimation } from "@/hooks/useAppOpeningAnimation";
import AppOpeningAnimation from "@/components/AppOpeningAnimation";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainNavigation from "@/components/navigation/MainNavigation";
import PlasticCreditMarketplace from "@/pages/PlasticCreditMarketplace";

// Import all pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UserTypes from "./pages/UserTypes";
import Features from "./pages/Features";
import About from "./pages/About";
import CitizenReports from "./pages/CitizenReports";
import CitizenReportDetails from "./pages/CitizenReportDetails";
import NewCitizenReport from "./pages/NewCitizenReport";
import WasteEntry from "./pages/WasteEntry";
import Marketplace from "./pages/Marketplace";
import RouteOptimization from "./pages/RouteOptimization";
import CarbonCreditTrading from "./pages/CarbonCreditTrading";
import WaterCreditTrading from "./pages/WaterCreditTrading";
import GreenBonds from "./pages/GreenBonds";
import ESGReportingTools from "./pages/ESGReportingTools";
import ESGInvestmentTracking from "./pages/ESGInvestmentTracking";
import ESGReportingCompliance from "./pages/ESGReportingCompliance";
import MicroFinance from "./pages/MicroFinance";
import EnhancedAuth from "./pages/EnhancedAuth";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import GovernmentUsers from "./pages/GovernmentUsers";
import HouseholdUsers from "./pages/HouseholdUsers";
import IndustryUsers from "./pages/IndustryUsers";
import MunicipalityUsers from "./pages/MunicipalityUsers";
import ResetPassword from "./pages/ResetPassword";
import EnhancedGreenBonds from "./pages/EnhancedGreenBonds";
import EnhancedMicroFinance from "./pages/EnhancedMicroFinance";
import AIAssistant from "./pages/AIAssistant";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const { showOpeningAnimation, handleOpeningComplete } = useAppOpeningAnimation();

  // Show opening animation first
  if (showOpeningAnimation) {
    return <AppOpeningAnimation onComplete={handleOpeningComplete} />;
  }

  // Show authentication if not authenticated and animation is complete
  if (!isAuthenticated && !loading) {
    return <EnhancedAuth />;
  }

  // Show main app if authenticated
  if (isAuthenticated) {
    return (
      <>
        <MainNavigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-types" element={<UserTypes />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/citizen-reports" element={
            <ProtectedRoute>
              <CitizenReports />
            </ProtectedRoute>
          } />
          <Route path="/citizen-reports/:id" element={
            <ProtectedRoute>
              <CitizenReportDetails />
            </ProtectedRoute>
          } />
          <Route path="/citizen-reports/new" element={
            <ProtectedRoute>
              <NewCitizenReport />
            </ProtectedRoute>
          } />
          <Route path="/waste-entry" element={
            <ProtectedRoute>
              <WasteEntry />
            </ProtectedRoute>
          } />
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          } />
          <Route path="/plastic-credit-marketplace" element={
            <ProtectedRoute>
              <PlasticCreditMarketplace />
            </ProtectedRoute>
          } />
          <Route path="/route-optimization" element={
            <ProtectedRoute>
              <RouteOptimization />
            </ProtectedRoute>
          } />
          <Route path="/carbon-credit-trading" element={
            <ProtectedRoute>
              <CarbonCreditTrading />
            </ProtectedRoute>
          } />
          <Route path="/water-credit-trading" element={
            <ProtectedRoute>
              <WaterCreditTrading />
            </ProtectedRoute>
          } />
          <Route path="/green-bonds" element={
            <ProtectedRoute>
              <GreenBonds />
            </ProtectedRoute>
          } />
          <Route path="/esg-reporting-tools" element={
            <ProtectedRoute>
              <ESGReportingTools />
            </ProtectedRoute>
          } />
          <Route path="/esg-investment-tracking" element={
            <ProtectedRoute>
              <ESGInvestmentTracking />
            </ProtectedRoute>
          } />
          <Route path="/esg-reporting-compliance" element={
            <ProtectedRoute>
              <ESGReportingCompliance />
            </ProtectedRoute>
          } />
          <Route path="/micro-finance" element={
            <ProtectedRoute>
              <MicroFinance />
            </ProtectedRoute>
          } />
          <Route path="/enhanced-auth" element={<EnhancedAuth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/government-users" element={<GovernmentUsers />} />
          <Route path="/household-users" element={<HouseholdUsers />} />
          <Route path="/industry-users" element={<IndustryUsers />} />
          <Route path="/municipality-users" element={<MunicipalityUsers />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/enhanced-green-bonds" element={
            <ProtectedRoute>
              <EnhancedGreenBonds />
            </ProtectedRoute>
          } />
          <Route path="/enhanced-micro-finance" element={
            <ProtectedRoute>
              <EnhancedMicroFinance />
            </ProtectedRoute>
          } />
          <Route path="/ai-assistant" element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600"></div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
