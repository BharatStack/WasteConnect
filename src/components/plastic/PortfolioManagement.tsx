
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Recycle, Award, Target } from 'lucide-react';

const PortfolioManagement = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');

  const portfolioData = {
    totalValue: 248500,
    totalCredits: 1247,
    weeklyChange: 12.5,
    monthlyReturn: 8.3,
    holdings: [
      {
        id: 1,
        type: 'PET Bottles',
        amount: 450,
        value: 89750,
        change: 5.2,
        location: 'Mumbai, India',
        verificationStatus: 'verified',
        impactMetrics: { co2Offset: 2.3, oceanCleanup: 450 }
      },
      {
        id: 2,
        type: 'HDPE Containers',
        amount: 325,
        value: 67890,
        change: -2.1,
        location: 'Jakarta, Indonesia',
        verificationStatus: 'pending',
        impactMetrics: { co2Offset: 1.8, oceanCleanup: 325 }
      },
      {
        id: 3,
        type: 'Mixed Plastics',
        amount: 472,
        value: 90860,
        change: 15.7,
        location: 'Manila, Philippines',
        verificationStatus: 'verified',
        impactMetrics: { co2Offset: 3.1, oceanCleanup: 472 }
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                Portfolio
              </Badge>
            </div>
            <div className="text-2xl font-bold text-blue-900">₹{portfolioData.totalValue.toLocaleString()}</div>
            <div className="text-sm text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{portfolioData.weeklyChange}% this week
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Recycle className="h-8 w-8 text-green-600" />
              <Badge variant="secondary" className="bg-green-200 text-green-800">
                Credits
              </Badge>
            </div>
            <div className="text-2xl font-bold text-green-900">{portfolioData.totalCredits}</div>
            <div className="text-sm text-green-600">Total plastic credits owned</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8 text-purple-600" />
              <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                Impact
              </Badge>
            </div>
            <div className="text-2xl font-bold text-purple-900">7.2 tons</div>
            <div className="text-sm text-purple-600">CO₂ offset achieved</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-orange-600" />
              <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                Returns
              </Badge>
            </div>
            <div className="text-2xl font-bold text-orange-900">{portfolioData.monthlyReturn}%</div>
            <div className="text-sm text-orange-600">Monthly return rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Tabs */}
      <Tabs defaultValue="holdings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="impact">Impact Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>My Credit Holdings</span>
                <Button variant="outline" size="sm">
                  Export Portfolio
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioData.holdings.map((holding) => (
                  <div key={holding.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{holding.type}</h3>
                        <p className="text-sm text-gray-600">{holding.location}</p>
                      </div>
                      <Badge 
                        variant={holding.verificationStatus === 'verified' ? 'default' : 'secondary'}
                        className={holding.verificationStatus === 'verified' ? 'bg-green-500' : ''}
                      >
                        {holding.verificationStatus}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-semibold">{holding.amount} credits</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Value</p>
                        <p className="font-semibold">₹{holding.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">24h Change</p>
                        <p className={`font-semibold flex items-center ${holding.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                          {holding.change >= 0 ? '+' : ''}{holding.change}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">CO₂ Offset</p>
                        <p className="font-semibold">{holding.impactMetrics.co2Offset} tons</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Trade</Button>
                      <Button variant="outline" size="sm">Transfer</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex space-x-2">
                  {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeframe(timeframe)}
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
                
                <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Performance Chart Placeholder</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">+12.5%</p>
                    <p className="text-sm text-gray-600">Total Return</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">8.3%</p>
                    <p className="text-sm text-gray-600">Monthly Return</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">2.1%</p>
                    <p className="text-sm text-gray-600">Volatility</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">1.45</p>
                    <p className="text-sm text-gray-600">Sharpe Ratio</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
                    <p className="text-gray-600 mb-3">Plastic Items Collected</p>
                    <Progress value={82} className="h-2" />
                    <p className="text-sm text-gray-500 mt-1">82% of annual goal</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">7.2</div>
                    <p className="text-gray-600 mb-3">Tons CO₂ Offset</p>
                    <Progress value={68} className="h-2" />
                    <p className="text-sm text-gray-500 mt-1">68% of annual goal</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
                    <p className="text-gray-600 mb-3">Ocean Cleanup Projects</p>
                    <Progress value={75} className="h-2" />
                    <p className="text-sm text-gray-500 mt-1">75% participation rate</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Impact Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Beach Cleanup - Manila Bay</p>
                        <p className="text-sm text-gray-600">Collected 450 PET bottles • 2.3 tons CO₂ offset</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">River Cleanup - Ganges Delta</p>
                        <p className="text-sm text-gray-600">Collected 325 HDPE containers • 1.8 tons CO₂ offset</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Urban Waste Collection - Jakarta</p>
                        <p className="text-sm text-gray-600">Collected 472 mixed plastics • 3.1 tons CO₂ offset</p>
                      </div>
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

export default PortfolioManagement;
