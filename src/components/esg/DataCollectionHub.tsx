
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Wifi, 
  Smartphone, 
  Globe, 
  Activity, 
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  Cloud,
  Server,
  Eye,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';

const DataCollectionHub = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSource, setSelectedSource] = useState('all');

  const dataSources = [
    {
      id: 'iot',
      name: 'IoT Sensors',
      type: 'Real-time',
      status: 'active',
      devices: 1247,
      lastSync: '2 mins ago',
      dataPoints: 456789,
      quality: 98,
      icon: Wifi
    },
    {
      id: 'erp',
      name: 'ERP System',
      type: 'Batch',
      status: 'active',
      devices: 1,
      lastSync: '15 mins ago',
      dataPoints: 234567,
      quality: 95,
      icon: Server
    },
    {
      id: 'mobile',
      name: 'Mobile Apps',
      type: 'User-generated',
      status: 'active',
      devices: 8900,
      lastSync: '5 mins ago',
      dataPoints: 123456,
      quality: 89,
      icon: Smartphone
    },
    {
      id: 'api',
      name: 'External APIs',
      type: 'Real-time',
      status: 'active',
      devices: 45,
      lastSync: '1 min ago',
      dataPoints: 567890,
      quality: 92,
      icon: Cloud
    },
    {
      id: 'web',
      name: 'Web Scraping',
      type: 'Scheduled',
      status: 'warning',
      devices: 12,
      lastSync: '2 hours ago',
      dataPoints: 78901,
      quality: 76,
      icon: Globe
    }
  ];

  const iotDevices = [
    {
      id: 'energy-001',
      name: 'Smart Energy Meter',
      location: 'Manufacturing Floor A',
      type: 'Energy',
      status: 'active',
      value: '245.7 kWh',
      trend: 'down',
      battery: 85,
      lastReading: '2 mins ago'
    },
    {
      id: 'water-002',
      name: 'Water Flow Sensor',
      location: 'Cooling System',
      type: 'Water',
      status: 'active',
      value: '1,234 L/min',
      trend: 'up',
      battery: 92,
      lastReading: '1 min ago'
    },
    {
      id: 'air-003',
      name: 'Air Quality Monitor',
      location: 'Production Area B',
      type: 'Environmental',
      status: 'warning',
      value: '45 AQI',
      trend: 'up',
      battery: 23,
      lastReading: '5 mins ago'
    },
    {
      id: 'waste-004',
      name: 'Waste Bin Sensor',
      location: 'Warehouse',
      type: 'Waste',
      status: 'active',
      value: '67% full',
      trend: 'steady',
      battery: 78,
      lastReading: '3 mins ago'
    }
  ];

  const apiConnectors = [
    {
      name: 'Weather API',
      provider: 'OpenWeatherMap',
      status: 'active',
      requests: 24567,
      limit: 100000,
      endpoint: '/weather/current'
    },
    {
      name: 'Supply Chain API',
      provider: 'LogisticsHub',
      status: 'active',
      requests: 12345,
      limit: 50000,
      endpoint: '/shipments/track'
    },
    {
      name: 'Energy Grid API',
      provider: 'GridConnect',
      status: 'error',
      requests: 8901,
      limit: 25000,
      endpoint: '/grid/emissions'
    },
    {
      name: 'Financial Data API',
      provider: 'MarketData',
      status: 'active',
      requests: 5678,
      limit: 15000,
      endpoint: '/esg/scores'
    }
  ];

  const dataQuality = [
    { metric: 'Completeness', value: 94, target: 95, status: 'warning' },
    { metric: 'Accuracy', value: 97, target: 98, status: 'good' },
    { metric: 'Consistency', value: 89, target: 90, status: 'warning' },
    { metric: 'Timeliness', value: 92, target: 85, status: 'good' },
    { metric: 'Validity', value: 96, target: 95, status: 'good' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Data Collection Hub</h2>
          <p className="text-gray-600 mt-1">Centralized data management and IoT integration platform</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Data Sources Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {dataSources.map((source) => {
          const Icon = source.icon;
          return (
            <Card key={source.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-6 w-6 text-blue-600" />
                  <Badge className={getStatusColor(source.status)}>
                    {source.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{source.name}</CardTitle>
                <p className="text-sm text-gray-600">{source.type}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Devices</p>
                    <p className="font-medium">{source.devices.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quality</p>
                    <p className="font-medium">{source.quality}%</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Data Points</span>
                    <span className="font-medium">{source.dataPoints.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500">Last sync: {source.lastSync}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="iot" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="iot">IoT Devices</TabsTrigger>
          <TabsTrigger value="apis">API Connectors</TabsTrigger>
          <TabsTrigger value="quality">Data Quality</TabsTrigger>
          <TabsTrigger value="streaming">Real-time Stream</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Data</TabsTrigger>
        </TabsList>

        <TabsContent value="iot" className="space-y-6">
          {/* IoT Device Management */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search devices..." className="pl-10" />
            </div>
            <select className="border border-gray-300 rounded-md px-3 py-2">
              <option>All Types</option>
              <option>Energy</option>
              <option>Water</option>
              <option>Environmental</option>
              <option>Waste</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {iotDevices.map((device) => (
              <Card key={device.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <Badge className={getStatusColor(device.status)}>
                      {device.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">{device.type}</Badge>
                    <span>•</span>
                    <span>{device.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{device.value}</span>
                    <div className="flex items-center gap-1">
                      {device.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : device.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <Activity className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Battery Level</span>
                      <span className="font-medium">{device.battery}%</span>
                    </div>
                    <Progress value={device.battery} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last reading: {device.lastReading}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {apiConnectors.map((api, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{api.name}</CardTitle>
                    <Badge className={getStatusColor(api.status)}>
                      {api.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{api.provider}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>API Usage</span>
                      <span className="font-medium">{api.requests.toLocaleString()} / {api.limit.toLocaleString()}</span>
                    </div>
                    <Progress value={(api.requests / api.limit) * 100} className="h-2" />
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Endpoint:</p>
                    <p className="text-sm font-mono">{api.endpoint}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Monitor
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Data Quality Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {dataQuality.map((metric, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">{metric.metric}</h4>
                    <div className={`text-2xl font-bold mb-1 ${getQualityColor(metric.status)}`}>
                      {metric.value}%
                    </div>
                    <p className="text-sm text-gray-600">Target: {metric.target}%</p>
                    <Progress value={metric.value} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Data Quality Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Completeness below target</p>
                      <p className="text-sm text-gray-600">Energy data from Manufacturing Floor A</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Investigate
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">API connection failed</p>
                      <p className="text-sm text-gray-600">Energy Grid API - GridConnect</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Reconnect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-time Data Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">24.7M</p>
                    <p className="text-sm text-blue-700">Messages/hour</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">98.5%</p>
                    <p className="text-sm text-green-700">Uptime</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">234ms</p>
                    <p className="text-sm text-purple-700">Avg Latency</p>
                  </div>
                </div>
                
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Real-time data visualization would be displayed here</p>
                    <p className="text-sm text-gray-500 mt-2">Live streaming data from all connected sources</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile Data Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Employee ESG App</h3>
                  <p className="text-sm text-gray-600 mb-4">8,900 active users</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily Reports</span>
                      <span className="font-medium">2,340</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Data Quality</span>
                      <span className="font-medium">89%</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Field Data Collection</h3>
                  <p className="text-sm text-gray-600 mb-4">1,567 site visits</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Photos Uploaded</span>
                      <span className="font-medium">5,678</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GPS Locations</span>
                      <span className="font-medium">1,234</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <Database className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Supplier Portal</h3>
                  <p className="text-sm text-gray-600 mb-4">247 suppliers</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Reports</span>
                      <span className="font-medium">198</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Compliance Rate</span>
                      <span className="font-medium">94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataCollectionHub;
