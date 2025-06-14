
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Leaf, 
  Trophy, 
  TrendingUp, 
  Coins, 
  Activity, 
  BarChart3,
  Zap,
  Target,
  Award,
  DollarSign
} from 'lucide-react';
import CarbonCreditOnboarding from '@/components/carbon/CarbonCreditOnboarding';
import WasteActivityTracker from '@/components/carbon/WasteActivityTracker';
import CarbonCreditMarketplace from '@/components/carbon/CarbonCreditMarketplace';
import UserDashboard from '@/components/carbon/UserDashboard';
import CommunityLeaderboard from '@/components/carbon/CommunityLeaderboard';
import PaymentInterface from '@/components/carbon/PaymentInterface';

const CarbonCreditTrading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [carbonProfile, setCarbonProfile] = useState<any>(null);
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
      // Fetch carbon credit profile
      const { data: profile, error: profileError } = await supabase
        .from('carbon_credit_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      setCarbonProfile(profile);

      // Fetch user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError) throw statsError;

      setUserStats(stats);
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

  const handleOnboardingComplete = () => {
    fetchUserData();
    toast({
      title: "Welcome to Carbon Credit Trading!",
      description: "Your profile has been set up successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  // Show onboarding if user hasn't completed setup
  if (!carbonProfile || !carbonProfile.onboarding_completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-eco-green-100">
        <CarbonCreditOnboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-eco-green-700 to-eco-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Carbon Credit Trading</h1>
              <p className="text-eco-green-100">Transform waste into wealth while saving the planet</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats?.total_credits_earned || 0}</div>
                <div className="text-sm text-eco-green-200">Credits Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{userStats?.total_earnings || 0}</div>
                <div className="text-sm text-eco-green-200">Total Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats?.current_level || 1}</div>
                <div className="text-sm text-eco-green-200">Level</div>
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
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Track Activities
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <UserDashboard userStats={userStats} carbonProfile={carbonProfile} />
          </TabsContent>

          <TabsContent value="activities">
            <WasteActivityTracker onActivityLogged={fetchUserData} />
          </TabsContent>

          <TabsContent value="marketplace">
            <CarbonCreditMarketplace />
          </TabsContent>

          <TabsContent value="leaderboard">
            <CommunityLeaderboard />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentInterface userStats={userStats} />
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-eco-green-600" />
                    Your Achievements
                  </CardTitle>
                  <CardDescription>
                    Track your progress and unlock new badges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Your achievements will appear here as you progress</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CarbonCreditTrading;
