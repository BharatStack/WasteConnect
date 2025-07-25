
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Zap,
  Globe,
  Leaf,
  Users,
  Shield,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, ScatterChart, Scatter } from 'recharts';

const ESGTradingFloor = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M');
  const [alerts, setAlerts] = useState([
    { id: 1, severity: 'high', message: 'Carbon emissions exceeded Q3 target by 15%', timestamp: '2 mins ago' },
    { id: 2, severity: 'medium', message: 'Water usage increasing in Asia-Pacific region', timestamp: '15 mins ago' },
    { id: 3, severity: 'low', message: 'New CSRD regulation update available', timestamp: '1 hour ago' }
  ]);

  const esgMetrics = [
    { 
      title: 'ESG Score', 
      value: 87, 
      change: '+5.2%', 
      trend: 'up',
      target: 90,
      icon: Target,
      color: 'text-green-600'
    },
    { 
      title: 'Carbon Footprint', 
      value: '2.3M', 
      change: '-8.1%', 
      trend: 'down',
      target: '2.0M',
      icon: Leaf,
      color: 'text-green-600',
      unit: 'tCO2e'
    },
    { 
      title: 'Water Usage', 
      value: '1.2M', 
      change: '+3.4%', 
      trend: 'up',
      target: '1.1M',
      icon: Globe,
      color: 'text-blue-600',
      unit: 'liters'
    },
    { 
      title: 'Waste Recycled', 
      value: '78%', 
      change: '+12.3%', 
      trend: 'up',
      target: '85%',
      icon: Activity,
      color: 'text-green-600'
    }
  ];

  const performanceData = [
    { month: 'Jan', esg: 82, financial: 95, industry: 79 },
    { month: 'Feb', esg: 84, financial: 92, industry: 80 },
    { month: 'Mar', esg: 86, financial: 98, industry: 82 },
    { month: 'Apr', esg: 85, financial: 94, industry: 81 },
    { month: 'May', esg: 87, financial: 96, industry: 83 },
    { month: 'Jun', esg: 88, financial: 99, industry: 84 }
  ];

  const riskData = [
    { name: 'Climate Risk', value: 65, color: '#ff6b6b' },
    { name: 'Regulatory Risk', value: 45, color: '#ffd93d' },
    { name: 'Reputational Risk', value: 30, color: '#6bcf7f' },
    { name: 'Supply Chain Risk', value: 55, color: '#4ecdc4' }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">ESG Trading Floor</h2>
          <p className="text-gray-600 mt-1">Real-time ESG performance monitoring and analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="1D">1 Day</option>
              <option value="1W">1 Week</option>
              <option value="1M">1 Month</option>
              <option value="3M">3 Months</option>
              <option value="1Y">1 Year</option>
            </select>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {esgMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                    {metric.unit && <span className="text-sm text-gray-500">{metric.unit}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                      {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {metric.change}
                    </Badge>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Target: {metric.target}</span>
                      <span>{typeof metric.value === 'number' ? Math.round((metric.value / 100) * 100) : '87'}%</span>
                    </div>
                    <Progress value={typeof metric.value === 'number' ? metric.value : 87} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              ESG Performance vs Financial Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="esg" stroke="#10b981" strokeWidth={2} name="ESG Score" />
                <Line type="monotone" dataKey="financial" stroke="#3b82f6" strokeWidth={2} name="Financial Performance" />
                <Line type="monotone" dataKey="industry" stroke="#6b7280" strokeWidth={2} name="Industry Average" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskData.map((risk, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{risk.name}</span>
                    <span className="text-sm text-gray-600">{risk.value}%</span>
                  </div>
                  <Progress value={risk.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Real-time Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.message}</p>
                    <p className="text-xs opacity-75 mt-1">{alert.timestamp}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Benchmarking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Industry Benchmarking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsBarChart data={[
                { company: 'Your Company', esg: 87, financial: 96 },
                { company: 'Competitor A', esg: 82, financial: 89 },
                { company: 'Competitor B', esg: 79, financial: 92 },
                { company: 'Industry Avg', esg: 75, financial: 85 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="esg" fill="#10b981" name="ESG Score" />
                <Bar dataKey="financial" fill="#3b82f6" name="Financial Performance" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              ESG Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={[
                    { name: 'Environmental', value: 85, color: '#10b981' },
                    { name: 'Social', value: 90, color: '#3b82f6' },
                    { name: 'Governance', value: 86, color: '#f59e0b' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {[
                    { name: 'Environmental', value: 85, color: '#10b981' },
                    { name: 'Social', value: 90, color: '#3b82f6' },
                    { name: 'Governance', value: 86, color: '#f59e0b' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ESGTradingFloor;
