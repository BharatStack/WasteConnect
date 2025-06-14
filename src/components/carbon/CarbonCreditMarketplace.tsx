
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
  Filter,
  Plus,
  Minus
} from 'lucide-react';

const CarbonCreditMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [userCredits, setUserCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [orderData, setOrderData] = useState({
    order_type: 'buy' as 'buy' | 'sell',
    credits_amount: '',
    price_per_credit: ''
  });

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      // Fetch active orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('carbon_credit_orders')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch user's available credits
      if (user) {
        const { data: creditsData, error: creditsError } = await supabase
          .from('carbon_credits')
          .select('credits_amount')
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (creditsError) throw creditsError;
        
        const totalCredits = creditsData?.reduce((sum, credit) => sum + credit.credits_amount, 0) || 0;
        setUserCredits(totalCredits);
      }
    } catch (error: any) {
      console.error('Error fetching market data:', error);
      toast({
        title: "Error",
        description: "Failed to load market data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

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

    try {
      const { error } = await supabase
        .from('carbon_credit_orders')
        .insert({
          user_id: user.id,
          order_type: orderData.order_type,
          credits_amount: creditsAmount,
          price_per_credit: pricePerCredit,
          total_amount: creditsAmount * pricePerCredit,
          status: 'active' as const,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });

      if (error) throw error;

      toast({
        title: "Order Created",
        description: `Your ${orderData.order_type} order has been placed successfully.`,
      });

      setShowCreateOrder(false);
      setOrderData({
        order_type: 'buy',
        credits_amount: '',
        price_per_credit: ''
      });
      fetchMarketData();
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order.",
        variant: "destructive",
      });
    }
  };

  const handleMatchOrder = async (order: any) => {
    if (!user) return;

    try {
      // This would implement order matching logic
      // For now, we'll show a placeholder
      toast({
        title: "Feature Coming Soon",
        description: "Order matching will be available in the next update.",
      });
    } catch (error: any) {
      console.error('Error matching order:', error);
      toast({
        title: "Error",
        description: "Failed to process order.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Credits</p>
                <p className="text-2xl font-bold text-eco-green-600">{userCredits.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-eco-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold">₹12.50</p>
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
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Order */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Create Order</CardTitle>
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
                  className="bg-eco-green-600 hover:bg-eco-green-700"
                >
                  Create Order
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
                        {order.credits_amount} credits
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
                        disabled={order.user_id === user?.id}
                      >
                        Sell to
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
                        {order.credits_amount} credits
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
                        disabled={order.user_id === user?.id}
                      >
                        Buy from
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
    </div>
  );
};

export default CarbonCreditMarketplace;
