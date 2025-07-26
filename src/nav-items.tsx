import {
  Home,
  Dashboard,
  Users,
  Settings,
  PlusSquare,
  FileText,
  ListChecks,
  BarChart3,
  Leaf,
  Coins,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  Contact2,
  Building,
  Network,
  Zap,
  Thermometer,
  Globe,
  Shield,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Brain,
  Map
} from "lucide-react";

export type NavItem = {
  title: string;
  to: string;
  icon: keyof typeof icons;
  page: string;
  restricted?: string[];
};

const icons = {
  home: Home,
  dashboard: Dashboard,
  users: Users,
  settings: Settings,
  plusSquare: PlusSquare,
  fileText: FileText,
  listChecks: ListChecks,
  barChart3: BarChart3,
  leaf: Leaf,
  coins: Coins,
  trendingUp: TrendingUp,
  messageSquare: MessageSquare,
  helpCircle: HelpCircle,
  contact2: Contact2,
  building: Building,
  network: Network,
  zap: Zap,
  thermometer: Thermometer,
  globe: Globe,
  shield: Shield,
  target: Target,
  activity: Activity,
  alertTriangle: AlertTriangle,
  checkCircle: CheckCircle,
  brain: Brain,
  map: Map
};

export const navItems: NavItem[] = [
  {
    title: "Home",
    to: "/",
    icon: "home",
    page: "Index",
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: "dashboard",
    page: "Dashboard",
  },
  {
    title: "Features",
    to: "/features",
    icon: "settings",
    page: "Features",
    restricted: ["government"]
  },
  {
    title: "Waste Management",
    to: "/waste-management",
    icon: "listChecks",
    page: "WasteManagement",
  },
  {
    title: "Recycling Programs",
    to: "/recycling-programs",
    icon: "leaf",
    page: "RecyclingPrograms",
  },
  {
    title: "Marketplace",
    to: "/marketplace",
    icon: "coins",
    page: "Marketplace",
  },
  {
    title: "Green Finance",
    to: "/green-finance",
    icon: "trendingUp",
    page: "GreenFinance",
  },
  {
    title: "Community Forum",
    to: "/community-forum",
    icon: "messageSquare",
    page: "CommunityForum",
  },
  {
    title: "Support",
    to: "/support",
    icon: "helpCircle",
    page: "Support",
  },
  {
    title: "Contact Us",
    to: "/contact-us",
    icon: "contact2",
    page: "ContactUs",
  },
  {
    title: "Enhanced Auth",
    to: "/enhanced-auth",
    icon: "settings",
    page: "EnhancedAuth",
  },
   {
    title: "ESG Investment Tracking",
    to: "/esg-investment-tracking",
    icon: "leaf",
    page: "ESGInvestmentTracking",
  },
  {
    title: "ESG Reporting & Compliance",
    to: "/esg-reporting-compliance",
    icon: "fileText",
    page: "ESGReportingCompliance",
  },
  {
    title: "ESG Reporting Tools",
    to: "/esg-reporting-tools",
    icon: "barChart3",
    page: "ESGReportingTools",
  },
  {
    title: "Admin Dashboard",
    to: "/admin-dashboard",
    icon: "dashboard",
    page: "AdminDashboard",
  },
];
