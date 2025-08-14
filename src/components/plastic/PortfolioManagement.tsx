
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { usePlasticMarketplace } from '@/hooks/usePlasticMarketplace';
import { TrendingUp, TrendingDown, DollarSign, Recycle, Award, Target } from 'lucide-react';

const PortfolioManagement = () => {
  const { user } = useAuth();
  const { 
    portfolio, 
    portfolioLoading, 
    credits, 
    creditsLoading,
    collections,
    collectionsLoading 
  } = usePlasticMarketplace();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');

  // Group credits by type for portfolio display
  const creditHoldings = React.useMemo(() => {
    if (!credits) return [];

    const grouped = credits.reduce((acc, credit) => {
      const existing = acc.find(item => item.type === credit.credit_type);
      if (existing) {
        existing.amount += credit.credits_amount;
        existing.value += credit.credits_amount * 200; // Estimated value at ₹200 per credit
      } else {
        acc.push({
          id: credit.id,
          type: credit.credit_type,
          amount: credit.credits_amount,
          value: credit.credits_amount * 200,
          change: Math.random() * 20 - 10, // Simulated price change
          location: 'Your Collections',
          verificationStatus: 'verified',
          impactMetrics: { 
            co2Offset: credit.credits_amount * 0.5, 
            oceanCleanup: credit.credits_amount 
          }
        });
      }
      return acc;
    }, [] as any[]);

    return grouped;
  }, [credits]);

  if (portfolioLoading || creditsLoading || collectionsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to view your portfolio.</p>
      </div>
    );
  }

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
            <div className="text-2xl font-bold text-blue-900">
              ₹{(portfolio?.total_value || 0).toLocaleString()}
            </div>
            <div className="text-sm text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{portfolio?.total_trades || 0} trades
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
            <div className="text-2xl font-bold text-green-900">
              {(portfolio?.total_credits || 0).toLocaleString()}
            </div>
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
            <div className="text-2xl font-bold text-purple-900">
              {(portfolio?.co2_offset || 0).toFixed(1)} tons
            </div>
            <div className="text-sm text-purple-600">CO₂ offset achieved</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-orange-600" />
              <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                Collections
              </Badge>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {portfolio?.total_collections || 0}
            </div>
            <div className="text-sm text-orange-600">Verified collections</div>
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
                {creditHoldings.length > 0 ? (
                  creditHoldings.map((holding) => (
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
                          <p className="font-semibold">{holding.amount.toFixed(2)} credits</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Value</p>
                          <p className="font-semibold">₹{holding.value.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">24h Change</p>
                          <p className={`font-semibold flex items-center ${holding.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">CO₂ Offset</p>
                          <p className="font-semibold">{holding.impactMetrics.co2Offset.toFixed(1)} tons</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Trade</Button>
                        <Button variant="outline" size="sm">Transfer</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No credit holdings yet. Start by submitting collections for verification!</p>
                  </div>
                )}
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
                  <p className="text-gray-500">Performance Chart - Coming Soon</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      +{((portfolio?.total_value || 0) / Math.max(1, portfolio?.total_trades || 1) * 0.125).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Total Return</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {((portfolio?.total_trades || 0) / Math.max(1, portfolio?.total_collections || 1) * 8.3).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Trade Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.min(5.0, (portfolio?.co2_offset || 0) * 0.5).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Impact Growth</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.min(2.5, (portfolio?.total_collections || 0) * 0.1 + 1).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Collection Ratio</p>
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
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {portfolio?.total_collections || 0}
                    </div>
                    <p className="text-gray-600 mb-3">Plastic Collections Submitted</p>
                    <Progress value={Math.min(100, (portfolio?.total_collections || 0) * 10)} className="h-2" />
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.min(100, (portfolio?.total_collections || 0) * 10)}% of annual goal
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {(portfolio?.co2_offset || 0).toFixed(1)}
                    </div>
                    <p className="text-gray-600 mb-3">Tons CO₂ Offset</p>
                    <Progress value={Math.min(100, (portfolio?.co2_offset || 0) * 10)} className="h-2" />
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.min(100, (portfolio?.co2_offset || 0) * 10)}% of annual goal
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {portfolio?.total_trades || 0}
                    </div>
                    <p className="text-gray-600 mb-3">Successful Trades</p>
                    <Progress value={Math.min(100, (portfolio?.total_trades || 0) * 5)} className="h-2" />
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.min(100, (portfolio?.total_trades || 0) * 5)}% market participation
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Your Impact Timeline</h3>
                  <div className="space-y-3">
                    {collections && collections.length > 0 ? (
                      collections.slice(0, 3).map((collection, index) => (
                        <div key={collection.id} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            collection.verification_status === 'verified' ? 'bg-green-500' :
                            collection.verification_status === 'pending' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                          <div>
                            <p className="font-medium">{collection.collection_type} Collection</p>
                            <p className="text-sm text-gray-600">
                              {collection.quantity} items • {collection.location} • 
                              {collection.verification_status === 'verified' ? 
                                ` ${collection.credits_earned} credits earned` :
                                ` ${collection.verification_status}`
                              }
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>No collections yet. Submit your first collection to start tracking your impact!</p>
                      </div>
                    )}
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
