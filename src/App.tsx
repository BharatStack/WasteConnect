
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <MainNavigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/enhanced-auth" element={<EnhancedAuth />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
