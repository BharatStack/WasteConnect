import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import MainNavigation from "./components/navigation/MainNavigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import EnhancedAuth from "./pages/EnhancedAuth";
import About from "./pages/About";
import Features from "./pages/Features";
import UserTypes from "./pages/UserTypes";
import WasteEntry from "./pages/WasteEntry";
import Analytics from "./pages/Analytics";
import RouteOptimization from "./pages/RouteOptimization";
import CitizenReports from "./pages/CitizenReports";
import NewCitizenReport from "./pages/NewCitizenReport";
import CitizenReportDetails from "./pages/CitizenReportDetails";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import HouseholdUsers from "./pages/HouseholdUsers";
import MunicipalityUsers from "./pages/MunicipalityUsers";
import IndustryUsers from "./pages/IndustryUsers";
import GovernmentUsers from "./pages/GovernmentUsers";
import AIAssistant from "./pages/AIAssistant";
import CarbonCreditTrading from './pages/CarbonCreditTrading';
import GreenBonds from './pages/GreenBonds';
import MicroFinance from './pages/MicroFinance';
import EnhancedGreenBonds from './pages/EnhancedGreenBonds';
import EnhancedMicroFinance from './pages/EnhancedMicroFinance';
import ResetPassword from './pages/ResetPassword';
import ESGInvestmentTracking from './pages/ESGInvestmentTracking';
import ESGReportingTools from './pages/ESGReportingTools';
import ESGReportingCompliance from "@/pages/ESGReportingCompliance";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/enhanced-auth" element={<EnhancedAuth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={
                <ProtectedRoute>
                  <Features />
                </ProtectedRoute>
              } />
              <Route path="/user-types" element={<UserTypes />} />
              <Route path="/household-users" element={
                <ProtectedRoute>
                  <HouseholdUsers />
                </ProtectedRoute>
              } />
              <Route path="/municipality-users" element={
                <ProtectedRoute>
                  <MunicipalityUsers />
                </ProtectedRoute>
              } />
              <Route path="/industry-users" element={
                <ProtectedRoute>
                  <IndustryUsers />
                </ProtectedRoute>
              } />
              <Route path="/government-users" element={
                <ProtectedRoute>
                  <GovernmentUsers />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/waste-entry" element={
                <ProtectedRoute>
                  <WasteEntry />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/route-optimization" element={
                <ProtectedRoute>
                  <RouteOptimization />
                </ProtectedRoute>
              } />
              <Route path="/citizen-reports" element={
                <ProtectedRoute>
                  <CitizenReports />
                </ProtectedRoute>
              } />
              <Route path="/citizen-reports/new" element={
                <ProtectedRoute>
                  <NewCitizenReport />
                </ProtectedRoute>
              } />
              <Route path="/citizen-reports/:id" element={
                <ProtectedRoute>
                  <CitizenReportDetails />
                </ProtectedRoute>
              } />
              <Route path="/marketplace" element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              } />
              <Route path="/ai-assistant" element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              } />
              <Route path="/carbon-trading" element={<CarbonCreditTrading />} />
              <Route path="/green-bonds" element={
                <ProtectedRoute>
                  <GreenBonds />
                </ProtectedRoute>
              } />
              <Route path="/micro-finance" element={
                <ProtectedRoute>
                  <MicroFinance />
                </ProtectedRoute>
              } />
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
              <Route path="/esg-investment-tracking" element={
                <ProtectedRoute>
                  <ESGInvestmentTracking />
                </ProtectedRoute>
              } />
              <Route path="/esg-reporting-tools" element={
                <ProtectedRoute>
                  <ESGReportingTools />
                </ProtectedRoute>
              } />
              <Route path="/esg-reporting-compliance" element={
                <ProtectedRoute>
                  <ESGReportingCompliance />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
