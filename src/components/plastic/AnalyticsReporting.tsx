
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Globe, Leaf, Droplets, Download, Calendar } from 'lucide-react';

const AnalyticsReporting = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Sample data for charts
  const marketTrendData = [
    { date: '2024-01', price: 180, volume: 1200, credits: 5400 },
    { date: '2024-02', price: 195, volume: 1450, credits: 6200 },
    { date: '2024-03', price: 210, volume: 1680, credits: 7100 },
    { date: '2024-04', price: 205, volume: 1590, credits: 6800 },
    { date: '2024-05', price: 225, volume: 1820, credits: 7900 },
    { date: '2024-06', price: 240, volume: 2100, credits: 8500 }
  ];

  const impactData = [
    { month: 'Jan', plastic: 2400, co2: 48, cleanup: 12 },
    { month: 'Feb', plastic: 2800, co2: 56, cleanup: 14 },
    { month: 'Mar', plastic: 3200, co2: 64, cleanup: 16 },
    { month: 'Apr', plastic: 3600, co2: 72, cleanup: 18 },
    { month: 'May', plastic: 4100, co2: 82, cleanup: 21 },
    { month: 'Jun', plastic: 4500, co2: 90, cleanup: 23 }
  ];

  const regionData = [
    { name: 'Southeast Asia', value: 35, color: '#8884d8' },
    { name: 'South Asia', value: 28, color: '#82ca9d' },
    { name: 'East Asia', value: 20, color: '#ffc658' },
    { name: 'Latin America', value: 12, color: '#ff7300' },
    { name: 'Africa', value: 5, color: '#00ff88' }
  ];

  const performanceMetrics = {
    totalTradeVolume: 2847650,
    totalCreditsTraded: 15847,
    averagePrice: 179.50,
    marketCap: 4250000,
    activeTraders: 1247,
    verificationRate: 94.5,
    monthlyGrowth: 18.5,
    co2Offset: 325.7
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                Volume
              </Badge>
            </div>
            <div className="text-2xl font-bold text-blue-900">₹{(performanceMetrics.totalTradeVolume / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{performanceMetrics.monthlyGrowth}% this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <Badge variant="secondary" className="bg-green-200 text-green-800">
                Credits
              </Badge>
            </div>
            <div className="text-2xl font-bold text-green-900">{performanceMetrics.totalCreditsTraded.toLocaleString()}</div>
            <div className="text-sm text-green-600">Total credits traded</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Globe className="h-8 w-8 text-purple-600" />
              <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                Impact
              </Badge>
            </div>
            <div className="text-2xl font-bold text-purple-900">{performanceMetrics.co2Offset}</div>
            <div className="text-sm text-purple-600">Tons CO₂ offset</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Droplets className="h-8 w-8 text-orange-600" />
              <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                Quality
              </Badge>
            </div>
            <div className="text-2xl font-bold text-orange-900">{performanceMetrics.verificationRate}%</div>
            <div className="text-sm text-orange-600">Verification success rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="market" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {['7d', '30d', '90d', '1y'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="market">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={marketTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={marketTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="volume" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Credit Supply & Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="credits" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="impact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="plastic" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="co2" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Plastic Collected</span>
                      <span className="text-sm text-gray-600">22,600 tons</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">85% of annual target</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">CO₂ Offset</span>
                      <span className="text-sm text-gray-600">452 tons</span>
                    </div>
                    <Progress value={72} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">72% of annual target</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Ocean Cleanup Projects</span>
                      <span className="text-sm text-gray-600">127 projects</span>
                    </div>
                    <Progress value={90} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">90% participation rate</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Communities Engaged</span>
                      <span className="text-sm text-gray-600">45 communities</span>
                    </div>
                    <Progress value={67} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">67% of target regions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Cleanup Activities Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cleanup" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regional">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Regions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionData.map((region, index) => (
                    <div key={region.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: region.color }}></div>
                        <div>
                          <p className="font-medium">{region.name}</p>
                          <p className="text-sm text-gray-600">{region.value}% of total volume</p>
                        </div>
                      </div>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Monthly Impact Report</h3>
                      <Badge variant="secondary">PDF</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Comprehensive overview of environmental impact and trading activity</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Last updated: June 2024</span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">ESG Compliance Report</h3>
                      <Badge variant="secondary">PDF</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Detailed ESG metrics and compliance documentation</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Last updated: June 2024</span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Market Analysis Report</h3>
                      <Badge variant="secondary">PDF</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Market trends, price forecasts, and trading insights</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Last updated: June 2024</span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Type</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Impact Analysis</option>
                      <option>Trading Performance</option>
                      <option>Verification Metrics</option>
                      <option>Regional Comparison</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Period</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" className="p-2 border rounded-md" />
                      <input type="date" className="p-2 border rounded-md" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Include Metrics</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Trading Volume
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Environmental Impact
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Regional Breakdown
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Verification Status
                      </label>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Generate Custom Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsReporting;
