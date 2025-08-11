
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Droplets, 
  Target,
  Activity,
  Globe,
  Zap,
  Shield
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface WaterAnalyticsDashboardProps {
  userStats: any;
  waterProfile: any;
}

const WaterAnalyticsDashboard: React.FC<WaterAnalyticsDashboardProps> = ({ userStats, waterProfile }) => {
  
  const performanceData = [
    { month: 'Jan', score: 720, efficiency: 82, volume: 15000 },
    { month: 'Feb', score: 745, efficiency: 85, volume: 14200 },
    { month: 'Mar', score: 760, efficiency: 87, volume: 13800 },
    { month: 'Apr', score: 750, efficiency: 86, volume: 14100 },
    { month: 'May', score: 785, efficiency: 89, volume: 13200 },
    { month: 'Jun', score: 820, efficiency: 92, volume: 12500 }
  ];

  const sectorData = [
    { name: 'Manufacturing', score: 765, color: '#3b82f6' },
    { name: 'Chemical', score: 680, color: '#ef4444' },
    { name: 'Textile', score: 720, color: '#f59e0b' },
    { name: 'Food Processing', score: 810, color: '#10b981' },
    { name: 'Pharmaceutical', score: 850, color: '#8b5cf6' }
  ];

  const regionalData = [
    { region: 'North', efficiency: 78, volume: 125000 },
    { region: 'South', efficiency: 85, volume: 98000 },
    { region: 'East', efficiency: 72, volume: 142000 },
    { region: 'West', efficiency: 88, volume: 89000 },
    { region: 'Central', efficiency: 80, volume: 115000 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Water Score</p>
                <p className="text-2xl font-bold text-blue-600">785/1000</p>
                <Badge variant="default" className="mt-1">Excellent</Badge>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Efficiency Rating</p>
                <p className="text-2xl font-bold text-green-600">92%</p>
                <div className="text-xs text-green-600">+7% this month</div>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Daily Volume</p>
                <p className="text-2xl font-bold text-blue-600">12.5K L</p>
                <div className="text-xs text-green-600">-18% reduction</div>
              </div>
              <Droplets className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Credits Earned</p>
                <p className="text-2xl font-bold text-purple-600">245.5</p>
                <div className="text-xs text-green-600">+32 this week</div>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Trend
            </CardTitle>
            <CardDescription>Water score and efficiency over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Water Score" />
                <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} name="Efficiency %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sector Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sector Benchmarking
            </CardTitle>
            <CardDescription>Your performance vs industry sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Usage Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Water Usage Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Recycled Water</span>
                  <span className="text-sm font-bold text-green-600">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Fresh Water</span>
                  <span className="text-sm font-bold text-blue-600">18%</span>
                </div>
                <Progress value={18} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Groundwater</span>
                  <span className="text-sm font-bold text-yellow-600">4%</span>
                </div>
                <Progress value={4} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Treatment Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">BOD Removal</span>
                <Badge variant="default">98.5%</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">COD Removal</span>
                <Badge variant="default">96.2%</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">TSS Removal</span>
                <Badge variant="default">99.1%</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">pH Compliance</span>
                <Badge variant="default">100%</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Heavy Metals</span>
                <Badge variant="default">99.8%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Regional Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {regionalData.map((region, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{region.region}</span>
                    <span className="text-sm text-gray-600">{region.efficiency}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={region.efficiency} className="h-2 flex-1" />
                    <span className="text-xs text-gray-500">{(region.volume / 1000).toFixed(0)}K L</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Predictive Analytics & Recommendations
          </CardTitle>
          <CardDescription>AI-powered insights and optimization suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">Optimization Opportunities</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="font-medium text-sm">Increase Recycling Ratio</div>
                  <div className="text-xs text-gray-600">Potential score increase: +25 points</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="font-medium text-sm">IoT Sensor Integration</div>
                  <div className="text-xs text-gray-600">Potential score increase: +50 points</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="font-medium text-sm">Advanced Treatment Tech</div>
                  <div className="text-xs text-gray-600">Potential score increase: +75 points</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-orange-600">Risk Alerts</h4>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <div className="font-medium text-sm">Seasonal Water Stress</div>
                  <div className="text-xs text-gray-600">Expected in 2 months</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="font-medium text-sm">Compliance Review Due</div>
                  <div className="text-xs text-gray-600">Due in 15 days</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterAnalyticsDashboard;
