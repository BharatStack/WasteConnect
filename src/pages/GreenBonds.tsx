
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Leaf, 
  TrendingUp, 
  BarChart3,
  ShoppingCart,
  PieChart,
  FileText,
  Target,
  Award
} from 'lucide-react';
import BondMarketplace from '@/components/bonds/BondMarketplace';
import BondPortfolio from '@/components/bonds/BondPortfolio';
import BondAnalytics from '@/components/bonds/BondAnalytics';
import ImpactDashboard from '@/components/bonds/ImpactDashboard';

const GreenBonds = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('marketplace');

  useEffect(() => {
    if (user) {
      fetchPortfolioData();
    }
  }, [user]);

  const fetchPortfolioData = async () => {
    if (!user) return;

    try {
      // Fetch or create user's bond portfolio
      const { data: existingPortfolio, error: portfolioError } = await supabase
        .from('bond_portfolios')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (portfolioError) throw portfolioError;

      if (!existingPortfolio) {
        // Create new portfolio for user
        const { data: newPortfolio, error: createError } = await supabase
          .from('bond_portfolios')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (createError) throw createError;
        setPortfolio(newPortfolio);
      } else {
        setPortfolio(existingPortfolio);
      }
    } catch (error: any) {
      console.error('Error fetching portfolio data:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Green Bond Investment Platform</h1>
              <p className="text-green-100">Invest in sustainable projects and create positive environmental impact</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">₹{portfolio?.total_invested?.toLocaleString() || 0}</div>
                <div className="text-sm text-green-200">Total Invested</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{portfolio?.current_value?.toLocaleString() || 0}</div>
                <div className="text-sm text-green-200">Current Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{portfolio?.active_investments || 0}</div>
                <div className="text-sm text-green-200">Active Bonds</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              My Portfolio
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Impact Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace">
            <BondMarketplace onInvestmentComplete={fetchPortfolioData} />
          </TabsContent>

          <TabsContent value="portfolio">
            <BondPortfolio portfolio={portfolio} onPortfolioUpdate={fetchPortfolioData} />
          </TabsContent>

          <TabsContent value="analytics">
            <BondAnalytics />
          </TabsContent>

          <TabsContent value="impact">
            <ImpactDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GreenBonds;
