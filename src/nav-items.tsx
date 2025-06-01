
import { Home, BarChart3, Recycle, ShoppingCart, Users, Settings, Upload, Route, FileText, AlertTriangle } from "lucide-react";
import Index from "./pages/Index.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WasteEntry from "./pages/WasteEntry.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import UserTypes from "./pages/UserTypes.jsx";
import Features from "./pages/Features.jsx";
import About from "./pages/About.jsx";
import Analytics from "./pages/Analytics.jsx";
import RouteOptimization from "./pages/RouteOptimization.jsx";
import Auth from "./pages/Auth.jsx";
import EnhancedAuth from "./pages/EnhancedAuth.jsx";
import CitizenReports from "./pages/CitizenReports.jsx";
import NewCitizenReport from "./pages/NewCitizenReport.jsx";
import CitizenReportDetails from "./pages/CitizenReportDetails.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Marketplace",
    to: "/marketplace",
    icon: <ShoppingCart className="h-4 w-4" />,
    page: <Marketplace />,
    protected: true,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Dashboard />,
    protected: true,
  },
  {
    title: "Waste Entry",
    to: "/waste-entry",
    icon: <Upload className="h-4 w-4" />,
    page: <WasteEntry />,
    protected: true,
  },
  {
    title: "Route Optimization",
    to: "/route-optimization",
    icon: <Route className="h-4 w-4" />,
    page: <RouteOptimization />,
    protected: true,
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Analytics />,
    protected: true,
  },
  {
    title: "Citizen Reports",
    to: "/citizen-reports",
    icon: <AlertTriangle className="h-4 w-4" />,
    page: <CitizenReports />,
    protected: true,
  },
  {
    title: "New Report",
    to: "/new-citizen-report",
    icon: <FileText className="h-4 w-4" />,
    page: <NewCitizenReport />,
    protected: true,
  },
  {
    title: "Report Details",
    to: "/citizen-report/:id",
    icon: <FileText className="h-4 w-4" />,
    page: <CitizenReportDetails />,
    protected: true,
  },
  {
    title: "User Types",
    to: "/user-types",
    icon: <Users className="h-4 w-4" />,
    page: <UserTypes />,
  },
  {
    title: "Features",
    to: "/features",
    icon: <Settings className="h-4 w-4" />,
    page: <Features />,
  },
  {
    title: "About",
    to: "/about",
    icon: <Settings className="h-4 w-4" />,
    page: <About />,
  },
  {
    title: "Auth",
    to: "/auth",
    icon: <Settings className="h-4 w-4" />,
    page: <Auth />,
  },
  {
    title: "Enhanced Auth",
    to: "/enhanced-auth",
    icon: <Settings className="h-4 w-4" />,
    page: <EnhancedAuth />,
  },
];
