
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Droplets, 
  Trophy, 
  TrendingUp, 
  Coins, 
  Activity, 
  BarChart3,
  Settings,
  Shield,
  Zap,
  Target,
  Award,
  DollarSign,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import WaterCreditScoring from '@/components/water/WaterCreditScoring';
import WaterTradingPlatform from '@/components/water/WaterTradingPlatform';
import WaterAnalyticsDashboard from '@/components/water/WaterAnalyticsDashboard';
import WaterComplianceMonitor from '@/components/water/WaterComplianceMonitor';
import WaterInnovationTracker from '@/components/water/WaterInnovationTracker';

const WaterCreditTrading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [waterProfile, setWaterProfile] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch water credit profile
      const { data: profile, error: profileError } = await supabase
        .from('water_credit_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
      }

      setWaterProfile(profile);

      // Fetch user stats or create default
      const { data: stats, error: statsError } = await supabase
        .from('water_user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Stats error:', statsError);
      }

      setUserStats(stats || {
        total_credits_earned: 0,
        total_earnings: 0,
        current_score: 750,
        efficiency_rating: 85
      });
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

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={handleBackToDashboard}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Droplets className="h-8 w-8" />
                Water Credit Trading
              </h1>
              <p className="text-blue-100">Generate water credits from conservation through improved waste management</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats?.total_credits_earned || 0}</div>
                <div className="text-sm text-blue-200">Credits Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{userStats?.total_earnings || 0}</div>
                <div className="text-sm text-blue-200">Total Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats?.current_score || 750}</div>
                <div className="text-sm text-blue-200">Water Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats?.efficiency_rating || 85}%</div>
                <div className="text-sm text-blue-200">Efficiency</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="scoring" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Scoring Engine
            </TabsTrigger>
            <TabsTrigger value="trading" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trading Platform
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="innovation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Innovation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <WaterAnalyticsDashboard userStats={userStats} waterProfile={waterProfile} />
          </TabsContent>

          <TabsContent value="scoring">
            <WaterCreditScoring onScoreUpdate={fetchUserData} />
          </TabsContent>

          <TabsContent value="trading">
            <WaterTradingPlatform userStats={userStats} />
          </TabsContent>

          <TabsContent value="analytics">
            <WaterAnalyticsDashboard userStats={userStats} waterProfile={waterProfile} />
          </TabsContent>

          <TabsContent value="compliance">
            <WaterComplianceMonitor />
          </TabsContent>

          <TabsContent value="innovation">
            <WaterInnovationTracker onUpdate={fetchUserData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WaterCreditTrading;
