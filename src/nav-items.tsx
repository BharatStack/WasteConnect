import { HomeIcon, UserIcon, BarChart3Icon, RecycleIcon, TruckIcon, ShoppingCartIcon, MessageSquareIcon, InfoIcon, UsersIcon, Settings, ShieldIcon } from "lucide-react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EnhancedAuth from "./pages/EnhancedAuth";
import Dashboard from "./pages/Dashboard";
import WasteEntry from "./pages/WasteEntry";
import Analytics from "./pages/Analytics";
import RouteOptimization from "./pages/RouteOptimization";
import Marketplace from "./pages/Marketplace";
import CitizenReports from "./pages/CitizenReports";
import NewCitizenReport from "./pages/NewCitizenReport";
import CitizenReportDetails from "./pages/CitizenReportDetails";
import About from "./pages/About";
import UserTypes from "./pages/UserTypes";
import Features from "./pages/Features";
import NotFound from "./pages/NotFound";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Authentication",
    to: "/auth",
    icon: <UserIcon className="h-4 w-4" />,
    page: <Auth />,
  },
  {
    title: "Enhanced Auth",
    to: "/enhanced-auth",
    icon: <ShieldIcon className="h-4 w-4" />,
    page: <EnhancedAuth />,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <BarChart3Icon className="h-4 w-4" />,
    page: <Dashboard />,
    protected: true,
  },
  {
    title: "Waste Entry",
    to: "/waste-entry",
    icon: <RecycleIcon className="h-4 w-4" />,
    page: <WasteEntry />,
    protected: true,
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <BarChart3Icon className="h-4 w-4" />,
    page: <Analytics />,
    protected: true,
  },
  {
    title: "Route Optimization",
    to: "/route-optimization",
    icon: <TruckIcon className="h-4 w-4" />,
    page: <RouteOptimization />,
    protected: true,
  },
  {
    title: "Marketplace",
    to: "/marketplace",
    icon: <ShoppingCartIcon className="h-4 w-4" />,
    page: <Marketplace />,
    protected: true,
  },
  {
    title: "Citizen Reports",
    to: "/citizen-reports",
    icon: <MessageSquareIcon className="h-4 w-4" />,
    page: <CitizenReports />,
    protected: true,
  },
  {
    title: "New Citizen Report",
    to: "/citizen-reports/new",
    icon: <MessageSquareIcon className="h-4 w-4" />,
    page: <NewCitizenReport />,
    protected: true,
  },
  {
    title: "Citizen Report Details",
    to: "/citizen-reports/:id",
    icon: <MessageSquareIcon className="h-4 w-4" />,
    page: <CitizenReportDetails />,
    protected: true,
  },
  {
    title: "About",
    to: "/about",
    icon: <InfoIcon className="h-4 w-4" />,
    page: <About />,
  },
  {
    title: "User Types",
    to: "/user-types",
    icon: <UsersIcon className="h-4 w-4" />,
    page: <UserTypes />,
  },
  {
    title: "Features",
    to: "/features",
    icon: <Settings className="h-4 w-4" />,
    page: <Features />,
  },
  {
    title: "404",
    to: "*",
    page: <NotFound />,
  },
];
