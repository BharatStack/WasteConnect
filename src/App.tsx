
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UserTypes from "./pages/UserTypes";
import Features from "./pages/Features";
import About from "./pages/About";
import Auth from "./pages/Auth";
import WasteEntry from "./pages/WasteEntry";
import CitizenReports from "./pages/CitizenReports";
import NewCitizenReport from "./pages/NewCitizenReport";
import CitizenReportDetails from "./pages/CitizenReportDetails";
import RouteOptimization from "./pages/RouteOptimization";
import Marketplace from "./pages/Marketplace";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/user-types" element={<UserTypes />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
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
          <Route path="/route-optimization" element={
            <ProtectedRoute>
              <RouteOptimization />
            </ProtectedRoute>
          } />
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
