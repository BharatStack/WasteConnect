
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
  Award,
  AlertCircle,
  DollarSign,
  Brain,
  Shield,
  Zap
} from 'lucide-react';
import BondMarketplace from '@/components/bonds/BondMarketplace';
import BondPortfolio from '@/components/bonds/BondPortfolio';
import BondAnalytics from '@/components/bonds/BondAnalytics';
import ImpactDashboard from '@/components/bonds/ImpactDashboard';
import ProjectCreationForm from '@/components/bonds/ProjectCreationForm';
import InvestmentOpportunities from '@/components/bonds/InvestmentOpportunities';
import InsuranceInterface from '@/components/bonds/InsuranceInterface';
import AIAnalytics from '@/components/bonds/AIAnalytics';
import SmartBondMatching from '@/components/bonds/SmartBondMatching';
import GreenwashingDetector from '@/components/bonds/GreenwashingDetector';
import DynamicPricingEngine from '@/components/bonds/DynamicPricingEngine';

const GreenBonds = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('marketplace');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user profile to determine role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profile);

      // Fetch or create user's bond portfolio
      const { data: existingPortfolio, error: portfolioError } = await supabase
        .from('bond_portfolios')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (portfolioError) throw portfolioError;

      if (!existingPortfolio) {
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
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDashboardTabs = () => {
    const userType = userProfile?.user_type;
    
    if (userType === 'government' || userType === 'municipality') {
      // Waste Operator Dashboard
      return [
        { id: 'projects', label: 'My Projects', icon: FileText },
        { id: 'create-project', label: 'Create Project', icon: Target },
        { id: 'funding', label: 'Funding Status', icon: DollarSign },
        { id: 'insurance', label: 'Insurance Coverage', icon: Award },
        { id: 'reports', label: 'Environmental Reports', icon: BarChart3 }
      ];
    } else if (userType === 'business' || userType === 'individual') {
      // Enhanced Investor Dashboard with AI features
      return [
        { id: 'marketplace', label: 'Investment Opportunities', icon: ShoppingCart },
        { id: 'smart-matching', label: 'AI Smart Matching', icon: Brain },
        { id: 'dynamic-pricing', label: 'Dynamic Pricing', icon: Zap },
        { id: 'greenwashing-detection', label: 'Fraud Detection', icon: Shield },
        { id: 'portfolio', label: 'My Portfolio', icon: PieChart },
        { id: 'analytics', label: 'Market Analytics', icon: BarChart3 },
        { id: 'impact', label: 'Impact Dashboard', icon: Target },
        { id: 'ai-insights', label: 'AI Insights', icon: TrendingUp }
      ];
    } else {
      // Default investor view
      return [
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
        { id: 'smart-matching', label: 'Smart Matching', icon: Brain },
        { id: 'portfolio', label: 'Portfolio', icon: PieChart },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'impact', label: 'Impact', icon: Target }
      ];
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const dashboardTabs = getDashboardTabs();
  const userType = userProfile?.user_type;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {userType === 'government' || userType === 'municipality' 
                  ? 'Waste Management Project Platform'
                  : 'Green Bond Investment Platform'
                }
              </h1>
              <p className="text-green-100">
                {userType === 'government' || userType === 'municipality'
                  ? 'Create and manage sustainable waste management projects'
                  : 'Invest in sustainable projects and create positive environmental impact'
                }
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">₹{portfolio?.total_invested?.toLocaleString() || 0}</div>
                <div className="text-sm text-green-200">
                  {userType === 'government' || userType === 'municipality' ? 'Total Funding' : 'Total Invested'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{portfolio?.current_value?.toLocaleString() || 0}</div>
                <div className="text-sm text-green-200">Current Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{portfolio?.active_investments || 0}</div>
                <div className="text-sm text-green-200">
                  {userType === 'government' || userType === 'municipality' ? 'Active Projects' : 'Active Bonds'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full mb-6" style={{gridTemplateColumns: `repeat(${dashboardTabs.length}, minmax(0, 1fr))`}}>
            {dashboardTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 text-xs sm:text-sm px-2 py-2">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Waste Operator Tabs */}
          {(userType === 'government' || userType === 'municipality') && (
            <>
              <TabsContent value="projects">
                <InvestmentOpportunities userType="waste_operator" />
              </TabsContent>

              <TabsContent value="create-project">
                <ProjectCreationForm onProjectCreated={fetchUserData} />
              </TabsContent>

              <TabsContent value="funding">
                <BondPortfolio portfolio={portfolio} onPortfolioUpdate={fetchUserData} />
              </TabsContent>

              <TabsContent value="insurance">
                <InsuranceInterface userType="waste_operator" />
              </TabsContent>

              <TabsContent value="reports">
                <ImpactDashboard />
              </TabsContent>
            </>
          )}

          {/* Enhanced Investor Tabs with AI Features */}
          {(userType === 'business' || userType === 'individual' || !userType) && (
            <>
              <TabsContent value="marketplace">
                <BondMarketplace onInvestmentComplete={fetchUserData} />
              </TabsContent>

              <TabsContent value="smart-matching">
                <SmartBondMatching />
              </TabsContent>

              <TabsContent value="dynamic-pricing">
                <DynamicPricingEngine />
              </TabsContent>

              <TabsContent value="greenwashing-detection">
                <GreenwashingDetector />
              </TabsContent>

              <TabsContent value="portfolio">
                <BondPortfolio portfolio={portfolio} onPortfolioUpdate={fetchUserData} />
              </TabsContent>

              <TabsContent value="analytics">
                <BondAnalytics />
              </TabsContent>

              <TabsContent value="impact">
                <ImpactDashboard />
              </TabsContent>

              <TabsContent value="ai-insights">
                <AIAnalytics />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default GreenBonds;
