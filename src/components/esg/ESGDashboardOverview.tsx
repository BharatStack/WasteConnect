
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Droplets, 
  Zap, 
  Recycle, 
  Users, 
  Building,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

const ESGDashboardOverview = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    carbonFootprint: { value: 12450, change: -8.2, unit: 'tCO2e' },
    waterUsage: { value: 89420, change: -12.5, unit: 'm³' },
    wasteRecycling: { value: 87, change: 5.3, unit: '%' },
    energyConsumption: { value: 145600, change: -6.8, unit: 'MWh' },
    socialImpact: { value: 9240, change: 15.2, unit: 'people' },
    governanceScore: { value: 92, change: 3.1, unit: '/100' }
  });

  const [complianceStatus, setComplianceStatus] = useState([
    { framework: 'GRI', completion: 85, status: 'in-progress', dueDate: '2024-03-15' },
    { framework: 'SASB', completion: 92, status: 'completed', dueDate: '2024-02-28' },
    { framework: 'TCFD', completion: 67, status: 'in-progress', dueDate: '2024-04-10' },
    { framework: 'EU CSRD', completion: 45, status: 'pending', dueDate: '2024-05-30' }
  ]);

  const [alerts, setAlerts] = useState([
    { type: 'warning', message: 'Water usage data missing for Q4 2023', priority: 'high' },
    { type: 'deadline', message: 'GRI report due in 15 days', priority: 'medium' },
    { type: 'threshold', message: 'Carbon emissions 5% above target', priority: 'high' }
  ]);

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'carbon': return <Leaf className="h-5 w-5" />;
      case 'water': return <Droplets className="h-5 w-5" />;
      case 'waste': return <Recycle className="h-5 w-5" />;
      case 'energy': return <Zap className="h-5 w-5" />;
      case 'social': return <Users className="h-5 w-5" />;
      case 'governance': return <Building className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'deadline': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'threshold': return <Target className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">ESG Dashboard Overview</h2>
          <p className="text-gray-600 mt-1">Monitor your environmental, social, and governance performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Activity className="h-4 w-4 mr-2" />
            Real-time View
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-green-800">Carbon Footprint</CardTitle>
              {getMetricIcon('carbon')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-900">
                {dashboardData.carbonFootprint.value.toLocaleString()}
                <span className="text-sm font-normal ml-1">{dashboardData.carbonFootprint.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  {Math.abs(dashboardData.carbonFootprint.change)}% decrease
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-blue-800">Water Usage</CardTitle>
              {getMetricIcon('water')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-900">
                {dashboardData.waterUsage.value.toLocaleString()}
                <span className="text-sm font-normal ml-1">{dashboardData.waterUsage.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">
                  {Math.abs(dashboardData.waterUsage.change)}% decrease
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-purple-800">Waste Recycling</CardTitle>
              {getMetricIcon('waste')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-900">
                {dashboardData.wasteRecycling.value}
                <span className="text-sm font-normal ml-1">{dashboardData.wasteRecycling.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-purple-600 font-medium">
                  {dashboardData.wasteRecycling.change}% increase
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-orange-800">Energy Consumption</CardTitle>
              {getMetricIcon('energy')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-900">
                {dashboardData.energyConsumption.value.toLocaleString()}
                <span className="text-sm font-normal ml-1">{dashboardData.energyConsumption.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-600 font-medium">
                  {Math.abs(dashboardData.energyConsumption.change)}% decrease
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-indigo-800">Social Impact</CardTitle>
              {getMetricIcon('social')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-indigo-900">
                {dashboardData.socialImpact.value.toLocaleString()}
                <span className="text-sm font-normal ml-1">{dashboardData.socialImpact.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                <span className="text-sm text-indigo-600 font-medium">
                  {dashboardData.socialImpact.change}% increase
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-teal-800">Governance Score</CardTitle>
              {getMetricIcon('governance')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-teal-900">
                {dashboardData.governanceScore.value}
                <span className="text-sm font-normal ml-1">{dashboardData.governanceScore.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-teal-600" />
                <span className="text-sm text-teal-600 font-medium">
                  {dashboardData.governanceScore.change}% improvement
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Status and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceStatus.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.framework}</span>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{item.completion}%</span>
                </div>
                <Progress value={item.completion} className="h-2" />
                <div className="text-xs text-gray-500">
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <Badge 
                    variant={alert.priority === 'high' ? 'destructive' : 'secondary'}
                    className="mt-1"
                  >
                    {alert.priority} priority
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ESGDashboardOverview;
