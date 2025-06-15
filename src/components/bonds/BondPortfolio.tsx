
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Leaf
} from 'lucide-react';

interface BondPortfolioProps {
  portfolio: any;
  onPortfolioUpdate: () => void;
}

const BondPortfolio: React.FC<BondPortfolioProps> = ({ portfolio, onPortfolioUpdate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInvestments();
    }
  }, [user]);

  const fetchInvestments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bond_investments')
        .select(`
          *,
          green_bonds (
            bond_name,
            issuer_name,
            category,
            interest_rate,
            bond_rating,
            status
          )
        `)
        .eq('investor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error: any) {
      console.error('Error fetching investments:', error);
      toast({
        title: "Error",
        description: "Failed to load your investments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePortfolioStats = () => {
    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.investment_amount), 0);
    const totalExpectedReturn = investments.reduce((sum, inv) => sum + Number(inv.expected_return), 0);
    const totalGains = totalExpectedReturn - totalInvested;
    const avgYield = investments.length > 0 
      ? investments.reduce((sum, inv) => sum + Number(inv.green_bonds.interest_rate), 0) / investments.length 
      : 0;

    return {
      totalInvested,
      totalExpectedReturn,
      totalGains,
      avgYield: avgYield * 100,
      portfolioReturn: totalInvested > 0 ? ((totalGains / totalInvested) * 100) : 0
    };
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'renewable_energy':
        return 'bg-yellow-100 text-yellow-800';
      case 'sustainable_water':
        return 'bg-blue-100 text-blue-800';
      case 'waste_management':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'matured':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = calculatePortfolioStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{investments.length} active bonds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalExpectedReturn.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {stats.portfolioReturn.toFixed(2)}% total return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Gains</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{stats.totalGains.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Interest earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
            <PieChart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgYield.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Annual interest rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Investment List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Bond Investments</CardTitle>
          <CardDescription>
            Track your green bond portfolio performance and upcoming payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {investments.length > 0 ? (
            <div className="space-y-4">
              {investments.map((investment) => (
                <div key={investment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{investment.green_bonds.bond_name}</h4>
                      <p className="text-sm text-gray-600">{investment.green_bonds.issuer_name}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(investment.green_bonds.category)}>
                          {investment.green_bonds.category.replace('_', ' ')}
                        </Badge>
                        <Badge className={getStatusColor(investment.status)}>
                          {investment.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">₹{Number(investment.investment_amount).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        {investment.green_bonds.bond_rating} • {(Number(investment.green_bonds.interest_rate) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Purchase Date</span>
                      <div className="font-medium">
                        {new Date(investment.purchase_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Maturity Date</span>
                      <div className="font-medium">
                        {new Date(investment.maturity_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Expected Return</span>
                      <div className="font-medium text-green-600">
                        ₹{Number(investment.expected_return).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No investments yet</h3>
              <p className="text-gray-500 mb-4">Start building your green bond portfolio today</p>
              <Button onClick={() => window.location.hash = '#marketplace'} className="bg-green-600 hover:bg-green-700">
                Browse Bonds
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BondPortfolio;
