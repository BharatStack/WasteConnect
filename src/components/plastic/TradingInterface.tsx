
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { usePlasticMarketplace } from '@/hooks/usePlasticMarketplace';
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, BarChart3 } from 'lucide-react';

const TradingInterface = () => {
  const { user } = useAuth();
  const { 
    orders, 
    ordersLoading, 
    createOrder, 
    isCreatingOrder,
    portfolio,
    credits 
  } = usePlasticMarketplace();

  const [orderData, setOrderData] = useState({
    order_type: 'buy' as 'buy' | 'sell',
    credit_type: '',
    quantity: '',
    price_per_credit: ''
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('24H');

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderData.credit_type || !orderData.quantity || !orderData.price_per_credit) {
      return;
    }

    createOrder({
      order_type: orderData.order_type,
      credit_type: orderData.credit_type,
      quantity: parseFloat(orderData.quantity),
      price_per_credit: parseFloat(orderData.price_per_credit)
    });

    // Reset form
    setOrderData({
      order_type: 'buy',
      credit_type: '',
      quantity: '',
      price_per_credit: ''
    });
  };

  // Separate buy and sell orders
  const buyOrders = React.useMemo(() => {
    return orders?.filter(order => order.order_type === 'buy') || [];
  }, [orders]);

  const sellOrders = React.useMemo(() => {
    return orders?.filter(order => order.order_type === 'sell') || [];
  }, [orders]);

  // Calculate market statistics
  const marketStats = React.useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        avgPrice: 0,
        totalVolume: 0,
        priceChange: 0,
        activeOrders: 0
      };
    }

    const activeOrders = orders.filter(order => order.status === 'active');
    const avgPrice = activeOrders.reduce((sum, order) => sum + order.price_per_credit, 0) / activeOrders.length;
    const totalVolume = activeOrders.reduce((sum, order) => sum + order.total_amount, 0);

    return {
      avgPrice: avgPrice || 0,
      totalVolume,
      priceChange: Math.random() * 10 - 5, // Simulated price change
      activeOrders: activeOrders.length
    };
  }, [orders]);

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to access the trading interface.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                Price
              </Badge>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              ₹{marketStats.avgPrice.toFixed(2)}
            </div>
            <div className="text-sm text-blue-600 flex items-center mt-1">
              {marketStats.priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {marketStats.priceChange >= 0 ? '+' : ''}{marketStats.priceChange.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <Badge variant="secondary" className="bg-green-200 text-green-800">
                Volume
              </Badge>
            </div>
            <div className="text-2xl font-bold text-green-900">
              ₹{marketStats.totalVolume.toLocaleString()}
            </div>
            <div className="text-sm text-green-600">{selectedTimeframe} trading volume</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-8 w-8 text-purple-600" />
              <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                Orders
              </Badge>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {marketStats.activeOrders}
            </div>
            <div className="text-sm text-purple-600">Active orders</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-orange-600" />
              <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                Your Credits
              </Badge>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {(portfolio?.total_credits || 0).toFixed(0)}
            </div>
            <div className="text-sm text-orange-600">Available for trading</div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Order */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <Label htmlFor="order_type">Order Type</Label>
                <Select 
                  value={orderData.order_type} 
                  onValueChange={(value: 'buy' | 'sell') => setOrderData(prev => ({ ...prev, order_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy Credits</SelectItem>
                    <SelectItem value="sell">Sell Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="credit_type">Credit Type</Label>
                <Select 
                  value={orderData.credit_type} 
                  onValueChange={(value) => setOrderData(prev => ({ ...prev, credit_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select credit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PET Bottles">PET Bottles</SelectItem>
                    <SelectItem value="HDPE Containers">HDPE Containers</SelectItem>
                    <SelectItem value="Mixed Plastics">Mixed Plastics</SelectItem>
                    <SelectItem value="Film Plastics">Film Plastics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter quantity"
                  value={orderData.quantity}
                  onChange={(e) => setOrderData(prev => ({ ...prev, quantity: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price_per_credit">Price per Credit (₹)</Label>
                <Input
                  id="price_per_credit"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter price"
                  value={orderData.price_per_credit}
                  onChange={(e) => setOrderData(prev => ({ ...prev, price_per_credit: e.target.value }))}
                  required
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="font-semibold">
                    ₹{(parseFloat(orderData.quantity || '0') * parseFloat(orderData.price_per_credit || '0')).toFixed(2)}
                  </span>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isCreatingOrder}
                >
                  {isCreatingOrder ? 'Creating Order...' : 'Create Order'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Order Book */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="orderbook" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orderbook">Order Book</TabsTrigger>
              <TabsTrigger value="myorders">My Orders</TabsTrigger>
              <TabsTrigger value="history">Trade History</TabsTrigger>
            </TabsList>

            <TabsContent value="orderbook">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Buy Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <TrendingUp className="h-5 w-5" />
                      Buy Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {buyOrders.length > 0 ? (
                        buyOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg border hover:bg-green-100 transition-colors"
                          >
                            <div>
                              <div className="font-medium">₹{order.price_per_credit}</div>
                              <div className="text-sm text-gray-600">
                                {order.quantity} {order.credit_type}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                Total: ₹{order.total_amount.toFixed(2)}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={order.user_id === user?.id}
                                className="mt-1"
                              >
                                {order.user_id === user?.id ? 'Your Order' : 'Sell to'}
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No buy orders available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Sell Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <TrendingDown className="h-5 w-5" />
                      Sell Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {sellOrders.length > 0 ? (
                        sellOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-3 bg-red-50 rounded-lg border hover:bg-red-100 transition-colors"
                          >
                            <div>
                              <div className="font-medium">₹{order.price_per_credit}</div>
                              <div className="text-sm text-gray-600">
                                {order.quantity} {order.credit_type}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                Total: ₹{order.total_amount.toFixed(2)}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={order.user_id === user?.id}
                                className="mt-1"
                              >
                                {order.user_id === user?.id ? 'Your Order' : 'Buy from'}
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No sell orders available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="myorders">
              <Card>
                <CardHeader>
                  <CardTitle>Your Active Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {orders?.filter(order => order.user_id === user?.id && order.status === 'active').length > 0 ? (
                      orders
                        .filter(order => order.user_id === user?.id && order.status === 'active')
                        .map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant={order.order_type === 'buy' ? 'default' : 'secondary'}>
                                  {order.order_type.toUpperCase()}
                                </Badge>
                                <span className="font-medium">{order.credit_type}</span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {order.quantity} credits at ₹{order.price_per_credit} each
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">₹{order.total_amount.toFixed(2)}</div>
                              <Button size="sm" variant="outline" className="mt-1">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No active orders. Create your first order to start trading!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Trade History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Trade history will appear here once you complete your first trade.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Market Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Price Chart</span>
            <div className="flex space-x-2">
              {['1H', '24H', '1W', '1M'].map((timeframe) => (
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Interactive price chart coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingInterface;
