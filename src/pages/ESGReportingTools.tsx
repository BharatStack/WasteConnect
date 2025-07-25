
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Brain, 
  FileText, 
  Network, 
  Thermometer, 
  Users, 
  Database,
  TrendingUp,
  Globe,
  Zap,
  Shield,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Import all the ESG components
import ESGTradingFloor from '@/components/esg/ESGTradingFloor';
import ESGAICopilot from '@/components/esg/ESGAICopilot';
import ESGReportingEngine from '@/components/esg/ESGReportingEngine';
import SupplyChainIntelligence from '@/components/esg/SupplyChainIntelligence';
import ClimateScenarioPlanning from '@/components/esg/ClimateScenarioPlanning';
import StakeholderEngagement from '@/components/esg/StakeholderEngagement';
import DataCollectionHub from '@/components/esg/DataCollectionHub';

const ESGReportingTools = () => {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState('trading-floor');

  const modules = [
    {
      id: 'trading-floor',
      name: 'Trading Floor',
      description: 'Real-time ESG performance command center',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      component: ESGTradingFloor
    },
    {
      id: 'ai-copilot',
      name: 'AI Copilot',
      description: 'Intelligent ESG analysis and insights',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      component: ESGAICopilot
    },
    {
      id: 'reporting-engine',
      name: 'Reporting Engine',
      description: 'Comprehensive ESG framework reporting',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      component: ESGReportingEngine
    },
    {
      id: 'supply-chain',
      name: 'Supply Chain Intelligence',
      description: 'End-to-end supply chain ESG management',
      icon: Network,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      component: SupplyChainIntelligence
    },
    {
      id: 'climate-planning',
      name: 'Climate Scenario Planning',
      description: 'Advanced climate risk modeling',
      icon: Thermometer,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      component: ClimateScenarioPlanning
    },
    {
      id: 'stakeholder-engagement',
      name: 'Stakeholder Engagement',
      description: 'Multi-stakeholder communication platform',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      component: StakeholderEngagement
    },
    {
      id: 'data-collection',
      name: 'Data Collection Hub',
      description: 'Centralized data management and IoT integration',
      icon: Database,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      component: DataCollectionHub
    }
  ];

  const platformStats = {
    totalDataPoints: '24.7M',
    activeDevices: '12,458',
    frameworkSupport: '50+',
    apiConnections: '247',
    realTimeStreams: '1,247',
    stakeholders: '14,892'
  };

  const ActiveComponent = modules.find(m => m.id === activeModule)?.component || ESGTradingFloor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                ESG Reporting & Compliance Tools
              </h1>
              <p className="text-slate-300 text-lg">
                Next-generation ESG intelligence platform with predictive analytics
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{platformStats.totalDataPoints}</div>
                <div className="text-sm text-slate-400">Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{platformStats.frameworkSupport}</div>
                <div className="text-sm text-slate-400">ESG Frameworks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{platformStats.stakeholders}</div>
                <div className="text-sm text-slate-400">Stakeholders</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{platformStats.activeDevices}</p>
              <p className="text-sm text-blue-700">Active Devices</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">{platformStats.apiConnections}</p>
              <p className="text-sm text-green-700">API Connections</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">{platformStats.realTimeStreams}</p>
              <p className="text-sm text-purple-700">Real-time Streams</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <Globe className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-900">95%</p>
              <p className="text-sm text-orange-700">Data Quality</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-900">99.9%</p>
              <p className="text-sm text-red-700">Uptime</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-indigo-900">87</p>
              <p className="text-sm text-indigo-700">ESG Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Module Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  activeModule === module.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setActiveModule(module.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`${module.bgColor} p-3 rounded-lg mb-3 inline-flex`}>
                    <Icon className={`h-6 w-6 ${module.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{module.name}</h3>
                  <p className="text-xs text-gray-600">{module.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Active Module Content */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <ActiveComponent />
          </CardContent>
        </Card>

        {/* Platform Features Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Predictive Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                6-24 month ESG risk forecasting with AI-powered insights and automated recommendations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Global Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Support for 50+ ESG frameworks including GRI, SASB, TCFD, CSRD, and custom standards.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Real-time Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Live data streaming from IoT sensors, APIs, and mobile devices with instant analytics.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Enterprise Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                SOC 2 Type II compliant with end-to-end encryption and comprehensive audit trails.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ESGReportingTools;
