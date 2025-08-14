
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { usePlasticMarketplace } from '@/hooks/usePlasticMarketplace';
import { 
  TrendingUp, 
  Waves, 
  Recycle, 
  Award, 
  Globe, 
  Users,
  DollarSign,
  BarChart3,
  Leaf,
  Target
} from 'lucide-react';

const MarketplaceDashboard = () => {
  const { user } = useAuth();
  const { 
    portfolio, 
    portfolioLoading, 
    credits, 
    creditsLoading, 
    orders, 
    ordersLoading,
    collections,
    collectionsLoading 
  } = usePlasticMarketplace();

  const [animatedValues, setAnimatedValues] = useState({
    totalCredits: 0,
    tradingVolume: 0,
    impactScore: 0,
    oceanHealth: 0
  });

  useEffect(() => {
    if (!portfolio) return;

    // Animate numbers based on real data
    const targets = {
      totalCredits: portfolio.total_credits || 0,
      tradingVolume: portfolio.total_value || 0,
      impactScore: Math.min(92, (portfolio.total_collections || 0) * 10), // Cap at 92%
      oceanHealth: Math.min(85, (portfolio.co2_offset || 0) * 2) // Cap at 85%
    };

    Object.keys(targets).forEach(key => {
      let current = 0;
      const target = targets[key as keyof typeof targets];
      const increment = target / 50;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 30);
    });
  }, [portfolio]);

  // Get recent activity from collections and orders
  const recentActivity = React.useMemo(() => {
    const activities = [];
    
    // Add recent collections
    if (collections) {
      collections.slice(0, 2).forEach(collection => {
        activities.push({
          id: collection.id,
          type: 'verify',
          amount: collection.quantity,
          user: user?.user_metadata?.full_name || 'You',
          time: new Date(collection.created_at).toLocaleString(),
          verified: collection.verification_status === 'verified'
        });
      });
    }

    // Add recent orders (limited to user's orders for privacy)
    if (orders && user) {
      orders
        .filter(order => order.user_id === user.id)
        .slice(0, 2)
        .forEach(order => {
          activities.push({
            id: order.id,
            type: order.order_type,
            amount: order.quantity,
            price: order.price_per_credit,
            user: 'You',
            time: new Date(order.created_at).toLocaleString(),
            verified: true
          });
        });
    }

    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);
  }, [collections, orders, user]);

  const achievements = [
    { icon: '🌊', title: 'Ocean Protector', description: 'Traded 1000+ credits', unlocked: (portfolio?.total_trades || 0) >= 1000 },
    { icon: '♻️', title: 'Recycling Champion', description: 'Verified 500+ collections', unlocked: (portfolio?.total_collections || 0) >= 500 },
    { icon: '🌱', title: 'Green Pioneer', description: 'First 100 trades', unlocked: (portfolio?.total_trades || 0) >= 100 },
    { icon: '🏆', title: 'Impact Master', description: 'Top 10% impact score', unlocked: (portfolio?.co2_offset || 0) >= 10 },
  ];

  if (portfolioLoading || creditsLoading || ordersLoading || collectionsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to view your plastic credit dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">My Credits</p>
                <p className="text-3xl font-bold">{animatedValues.totalCredits.toLocaleString()}</p>
                <p className="text-blue-200 text-sm">
                  {credits && credits.length > 0 ? `+${credits.length} active` : 'Start collecting!'}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Recycle className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Portfolio Value</p>
                <p className="text-3xl font-bold">₹{animatedValues.tradingVolume.toLocaleString()}</p>
                <p className="text-teal-200 text-sm">
                  {portfolio?.total_trades || 0} trades completed
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Impact Score</p>
                <p className="text-3xl font-bold">{animatedValues.impactScore}%</p>
                <p className="text-green-200 text-sm">
                  {portfolio?.total_collections || 0} collections
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Target className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">CO₂ Offset</p>
                <p className="text-3xl font-bold">{(portfolio?.co2_offset || 0).toFixed(1)} tons</p>
                <p className="text-purple-200 text-sm">Environmental impact</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Waves className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Your Recent Activity
            </CardTitle>
            <CardDescription>Your latest marketplace activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'buy' ? 'bg-green-100 text-green-600' :
                        activity.type === 'sell' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'buy' ? '📈' : activity.type === 'sell' ? '📉' : '✅'}
                      </div>
                      <div>
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-gray-600">
                          {activity.type === 'verify' ? 
                            `Submitted ${activity.amount} items for verification` :
                            `${activity.type === 'buy' ? 'Bought' : 'Sold'} ${activity.amount} credits at ₹${activity.price}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                      {activity.verified && <Badge variant="secondary" className="text-xs">Verified</Badge>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity. Start by submitting a collection or placing an order!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievements & Impact */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Achievements
            </CardTitle>
            <CardDescription>Your environmental milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  achievement.unlocked 
                    ? 'bg-green-50 border border-green-200 hover:bg-green-100' 
                    : 'bg-gray-50 border border-gray-200 opacity-60'
                }`}>
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <p className={`font-medium ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                      {achievement.title}
                    </p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="ml-auto text-green-600">
                      <Award className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact Visualization */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Your Environmental Impact
          </CardTitle>
          <CardDescription>See how your actions are healing our oceans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.min(100, (portfolio?.total_collections || 0) * 5)}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (portfolio?.total_collections || 0) * 5)} 
                  className="transform rotate-90 w-24 h-2" 
                />
              </div>
              <h3 className="font-semibold text-blue-800">Ocean Cleanup</h3>
              <p className="text-sm text-gray-600">Plastic removed from ocean</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    {Math.min(100, (portfolio?.total_credits || 0) / 10)}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (portfolio?.total_credits || 0) / 10)} 
                  className="transform rotate-90 w-24 h-2" 
                />
              </div>
              <h3 className="font-semibold text-green-800">Credit Generation</h3>
              <p className="text-sm text-gray-600">Credits successfully earned</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">
                    {Math.min(100, (portfolio?.co2_offset || 0) * 10)}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (portfolio?.co2_offset || 0) * 10)} 
                  className="transform rotate-90 w-24 h-2" 
                />
              </div>
              <h3 className="font-semibold text-purple-800">CO₂ Offset</h3>
              <p className="text-sm text-gray-600">Carbon footprint reduced</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common marketplace activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-auto flex-col p-6 bg-blue-500 hover:bg-blue-600 text-white">
              <DollarSign className="h-8 w-8 mb-2" />
              <span className="font-medium">Buy Credits</span>
              <span className="text-xs opacity-80">Purchase verified plastic credits</span>
            </Button>
            
            <Button variant="outline" className="h-auto flex-col p-6 border-teal-200 hover:bg-teal-50">
              <TrendingUp className="h-8 w-8 mb-2 text-teal-600" />
              <span className="font-medium">Sell Credits</span>
              <span className="text-xs text-gray-600">List your credits for sale</span>
            </Button>
            
            <Button variant="outline" className="h-auto flex-col p-6 border-green-200 hover:bg-green-50">
              <Leaf className="h-8 w-8 mb-2 text-green-600" />
              <span className="font-medium">Submit Collection</span>
              <span className="text-xs text-gray-600">Upload new plastic collection</span>
            </Button>
            
            <Button variant="outline" className="h-auto flex-col p-6 border-purple-200 hover:bg-purple-50">
              <Users className="h-8 w-8 mb-2 text-purple-600" />
              <span className="font-medium">View Analytics</span>
              <span className="text-xs text-gray-600">Track your impact over time</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceDashboard;
