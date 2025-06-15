
import { HomeIcon, Users, Building2, Recycle, BarChart3, MessageSquare, Route, Leaf, DollarSign, TrendingUp } from "lucide-react";
import Index from "./pages/Index.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserTypes from "./pages/UserTypes.jsx";
import HouseholdUsers from "./pages/HouseholdUsers.jsx";
import IndustryUsers from "./pages/IndustryUsers.jsx";
import MunicipalityUsers from "./pages/MunicipalityUsers.jsx";
import GovernmentUsers from "./pages/GovernmentUsers.jsx";
import WasteEntry from "./pages/WasteEntry.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import Analytics from "./pages/Analytics.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";
import RouteOptimization from "./pages/RouteOptimization.jsx";
import CarbonCreditTrading from "./pages/CarbonCreditTrading.jsx";
import GreenBonds from "./pages/GreenBonds.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "User Types",
    to: "/user-types", 
    icon: <Users className="h-4 w-4" />,
    page: <UserTypes />,
  },
  {
    title: "Household Users",
    to: "/household-users",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <HouseholdUsers />,
  },
  {
    title: "Industry Users", 
    to: "/industry-users",
    icon: <Building2 className="h-4 w-4" />,
    page: <IndustryUsers />,
  },
  {
    title: "Municipality Users",
    to: "/municipality-users", 
    icon: <Building2 className="h-4 w-4" />,
    page: <MunicipalityUsers />,
  },
  {
    title: "Government Users",
    to: "/government-users",
    icon: <Building2 className="h-4 w-4" />,
    page: <GovernmentUsers />,
  },
  {
    title: "Waste Entry",
    to: "/waste-entry",
    icon: <Recycle className="h-4 w-4" />,
    page: <WasteEntry />,
  },
  {
    title: "Marketplace",
    to: "/marketplace", 
    icon: <DollarSign className="h-4 w-4" />,
    page: <Marketplace />,
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Analytics />,
  },
  {
    title: "AI Assistant",
    to: "/ai-assistant",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <AIAssistant />,
  },
  {
    title: "Route Optimization",
    to: "/route-optimization",
    icon: <Route className="h-4 w-4" />,
    page: <RouteOptimization />,
  },
  {
    title: "Carbon Credits",
    to: "/carbon-credit-trading",
    icon: <Leaf className="h-4 w-4" />,
    page: <CarbonCreditTrading />,
  },
  {
    title: "Green Bonds",
    to: "/green-bonds",
    icon: <TrendingUp className="h-4 w-4" />,
    page: <GreenBonds />,
  },
];
