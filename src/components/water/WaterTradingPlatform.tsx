
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  User,
  Plus,
  Minus,
  RefreshCw,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface WaterTradingPlatformProps {
  userStats: any;
}

const WaterTradingPlatform: React.FC<WaterTradingPlatformProps> = ({ userStats }) => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [userCredits, setUserCredits] = useState(245.5);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [orderData, setOrderData] = useState({
    order_type: 'buy' as 'buy' | 'sell',
    credits_amount: '',
    price_per_credit: ''
  });

  const [marketData, setMarketData] = useState({
    current_price: 28.50,
    volume_24h: 12450,
    price_change: 2.3,
    active_orders: 89,
    total_volume: 1250000
  });

  useEffect(() => {
    // Simulate fetching market orders
    setOrders([
      {
        id: 1,
        user_id: 'user1',
        order_type: 'buy',
        credits_amount: 50,
        price_per_credit: 28.25,
        total_amount: 1412.50,
        created_at: new Date(),
        user_name: 'Industrial Corp A'
      },
      {
        id: 2,
        user_id: 'user2',
        order_type: 'sell',
        credits_amount: 75,
        price_per_credit: 29.00,
        total_amount: 2175.00,
        created_at: new Date(),
        user_name: 'Water Tech Solutions'
      },
      {
        id: 3,
        user_id: 'user3',
        order_type: 'buy',
        credits_amount: 100,
        price_per_credit: 27.80,
        total_amount: 2780.00,
        created_at: new Date(),
        user_name: 'Municipal Authority'
      }
    ]);
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const creditsAmount = parseFloat(orderData.credits_amount);
    const pricePerCredit = parseFloat(orderData.price_per_credit);

    if (!creditsAmount || !pricePerCredit) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid amounts.",
        variant: "destructive",
      });
      return;
    }

    // Validate sell orders
    if (orderData.order_type === 'sell' && creditsAmount > userCredits) {
      toast({
        title: "Insufficient Credits",
        description: "You don't have enough credits to sell.",
        variant: "destructive",
      });
      return;
    }

    const newOrder = {
      id: orders.length + 1,
      user_id: 'current_user',
      order_type: orderData.order_type,
      credits_amount: creditsAmount,
      price_per_credit: pricePerCredit,
      total_amount: creditsAmount * pricePerCredit,
      created_at: new Date(),
      user_name: 'Your Company'
    };

    setOrders(prev => [newOrder, ...prev]);
    
    toast({
      title: "Order Created",
      description: `Your ${orderData.order_type} order has been placed on the blockchain.`,
    });

    setShowCreateOrder(false);
    setOrderData({
      order_type: 'buy',
      credits_amount: '',
      price_per_credit: ''
    });
  };

  const handleMatchOrder = async (order: any) => {
    toast({
      title: "Smart Contract Executing",
      description: "Processing order match on blockchain...",
    });

    // Simulate blockchain transaction
    setTimeout(() => {
      toast({
        title: "Trade Completed",
        description: `Successfully ${order.order_type === 'buy' ? 'sold' : 'bought'} ${order.credits_amount} credits.`,
      });
      
      // Update user credits
      if (order.order_type === 'buy') {
        setUserCredits(prev => prev + order.credits_amount);
      } else {
        setUserCredits(prev => prev - order.credits_amount);
      }
      
      // Remove order from list
      setOrders(prev => prev.filter(o => o.id !== order.id));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Credits</p>
                <p className="text-2xl font-bold text-blue-600">{userCredits.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Price</p>
                <p className="text-2xl font-bold">₹{marketData.current_price}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">24h Volume</p>
                <p className="text-2xl font-bold">{marketData.volume_24h.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold">{marketData.active_orders}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Price Change</p>
                <p className="text-2xl font-bold text-green-600">+{marketData.price_change}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Order */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Create Smart Contract Order
              </CardTitle>
              <CardDescription>Deploy order to blockchain trading platform</CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateOrder(!showCreateOrder)}
              variant="outline"
              size="sm"
            >
              {showCreateOrder ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {showCreateOrder && (
          <CardContent>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="credits_amount">Credits Amount</Label>
                  <Input
                    id="credits_amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Enter amount"
                    value={orderData.credits_amount}
                    onChange={(e) => setOrderData(prev => ({ ...prev, credits_amount: e.target.value }))}
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
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Total: ₹{(parseFloat(orderData.credits_amount || '0') * parseFloat(orderData.price_per_credit || '0')).toFixed(2)}
                </div>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Deploy to Blockchain
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Order Book */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buy Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Buy Orders
            </CardTitle>
            <CardDescription>Active buy orders on the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {orders
                .filter(order => order.order_type === 'buy')
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">₹{order.price_per_credit}/credit</div>
                      <div className="text-sm text-gray-600">
                        {order.credits_amount} credits • {order.user_name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Total: ₹{order.total_amount}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMatchOrder(order)}
                        disabled={order.user_id === 'current_user'}
                      >
                        {order.user_id === 'current_user' ? 'Your Order' : 'Sell to'}
                      </Button>
                    </div>
                  </div>
                ))}
              {orders.filter(order => order.order_type === 'buy').length === 0 && (
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
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Sell Orders
            </CardTitle>
            <CardDescription>Active sell orders on the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {orders
                .filter(order => order.order_type === 'sell')
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">₹{order.price_per_credit}/credit</div>
                      <div className="text-sm text-gray-600">
                        {order.credits_amount} credits • {order.user_name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Total: ₹{order.total_amount}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMatchOrder(order)}
                        disabled={order.user_id === 'current_user'}
                      >
                        {order.user_id === 'current_user' ? 'Your Order' : 'Buy from'}
                      </Button>
                    </div>
                  </div>
                ))}
              {orders.filter(order => order.order_type === 'sell').length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No sell orders available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Contract Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            Blockchain Integration
          </CardTitle>
          <CardDescription>Smart contract and security features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Smart Contract Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Automated order matching</li>
                <li>• Escrow protection</li>
                <li>• Instant settlement</li>
                <li>• Transparent pricing</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Security Measures</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multi-signature wallets</li>
                <li>• Audit trail logging</li>
                <li>• Fraud detection</li>
                <li>• Regulatory compliance</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Trading Stats</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Gas Fee:</span>
                  <span>₹2.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Settlement Time:</span>
                  <span>~15 mins</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span>99.8%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterTradingPlatform;
