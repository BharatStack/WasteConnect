
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  BarChart3, 
  Brain,
  Map,
  Users,
  Settings
} from 'lucide-react';
import ESGDashboard from '@/components/esg/ESGDashboard';
import AIAnalysisDashboard from '@/components/esg/AIAnalysisDashboard';
import IndiaRecyclingPortal from '@/components/esg/IndiaRecyclingPortal';
import CircularEconomyNetwork from '@/components/esg/CircularEconomyNetwork';
import UserDataManagement from '@/components/esg/UserDataManagement';

const ESGInvestmentTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize ESG tracking data
    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-green-700 via-teal-600 to-emerald-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                ESG Investment Tracking
              </h1>
              <p className="text-green-100 text-xl max-w-3xl">
                Comprehensive ESG analysis, AI insights, and sustainable investment management platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">₹2.5Cr</div>
                <div className="text-sm text-green-200">Total ESG Assets</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">A+</div>
                <div className="text-sm text-green-200">ESG Rating</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">12.5%</div>
                <div className="text-sm text-green-200">Annual Return</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/70 backdrop-blur-md shadow-lg rounded-xl">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">ESG Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="india-recycling" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-lg">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">India Recycling</span>
            </TabsTrigger>
            <TabsTrigger value="funding-network" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Funding Network</span>
            </TabsTrigger>
            <TabsTrigger value="user-management" className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg">
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

        {/* Platform Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-green-900">87%</p>
              <p className="text-sm text-green-700">Portfolio Performance</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-blue-900">24.7M</p>
              <p className="text-sm text-blue-700">Data Points Analyzed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Brain className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-purple-900">95%</p>
              <p className="text-sm text-purple-700">AI Accuracy</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 text-teal-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-teal-900">14,892</p>
              <p className="text-sm text-teal-700">Active Users</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ESGInvestmentTracking;
