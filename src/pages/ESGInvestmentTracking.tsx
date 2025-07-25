
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  BarChart3, 
  Leaf, 
  Building, 
  Target, 
  Brain,
  Map,
  Users,
  DollarSign,
  Settings,
  Shield,
  Globe,
  Zap,
  AlertCircle,
  FileText,
  Database,
  Network,
  Thermometer
} from 'lucide-react';
import ESGDashboard from '@/components/esg/ESGDashboard';
import AIAnalysisDashboard from '@/components/esg/AIAnalysisDashboard';
import IndiaRecyclingPortal from '@/components/esg/IndiaRecyclingPortal';
import CircularEconomyNetwork from '@/components/esg/CircularEconomyNetwork';
import UserDataManagement from '@/components/esg/UserDataManagement';

const ESGInvestmentTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize ESG tracking data
    setIsLoading(false);
  }, [user]);

  const handleAccessReportingTools = () => {
    navigate('/esg-reporting-tools');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-700 via-teal-600 to-emerald-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                ESG Investment Tracking
              </h1>
              <p className="text-green-100 text-lg">
                Comprehensive ESG analysis, AI insights, and sustainable investment management
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">₹2.5Cr</div>
                <div className="text-sm text-green-200">Total ESG Assets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">A+</div>
                <div className="text-sm text-green-200">ESG Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">12.5%</div>
                <div className="text-sm text-green-200">Annual Return</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reporting Tools Access Card */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <FileText className="h-8 w-8" />
              ESG Reporting & Compliance Tools
            </CardTitle>
            <CardDescription className="text-blue-100">
              Access our comprehensive ESG reporting platform with 50+ frameworks, AI analytics, and real-time monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                <p className="font-semibold">Trading Floor</p>
                <p className="text-sm text-blue-200">Real-time ESG performance</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-purple-200" />
                <p className="font-semibold">AI Copilot</p>
                <p className="text-sm text-purple-200">Intelligent insights</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Network className="h-8 w-8 mx-auto mb-2 text-green-200" />
                <p className="font-semibold">Supply Chain</p>
                <p className="text-sm text-green-200">End-to-end visibility</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Database className="h-8 w-8 mx-auto mb-2 text-yellow-200" />
                <p className="font-semibold">Data Hub</p>
                <p className="text-sm text-yellow-200">Centralized collection</p>
              </div>
            </div>
            <Button 
              onClick={handleAccessReportingTools}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 text-lg"
            >
              Access Reporting Tools
            </Button>
          </CardContent>
        </Card>

        {/* Original Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-white/70 backdrop-blur-md">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">ESG Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="india-recycling" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">India Recycling</span>
            </TabsTrigger>
            <TabsTrigger value="funding-network" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Funding Network</span>
            </TabsTrigger>
            <TabsTrigger value="user-management" className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">User Data</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <ESGDashboard />
          </TabsContent>

          <TabsContent value="ai-analysis" className="space-y-6">
            <AIAnalysisDashboard />
          </TabsContent>

          <TabsContent value="india-recycling" className="space-y-6">
            <IndiaRecyclingPortal />
          </TabsContent>

          <TabsContent value="funding-network" className="space-y-6">
            <CircularEconomyNetwork />
          </TabsContent>

          <TabsContent value="user-management" className="space-y-6">
            <UserDataManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ESGInvestmentTracking;
