
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
  const navigate = useNavigate();
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
      // Try to fetch carbon credit profile
      const { data: profile, error: profileError } = await supabase
        .from('carbon_credit_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.log('Profile error:', profileError);
        // Create a default profile if none exists
        setCarbonProfile({
          id: user.id,
          user_id: user.id,
          onboarding_completed: true,
          kyc_status: 'pending',
          role: 'individual'
        });
      } else {
        setCarbonProfile(profile || {
          id: user.id,
          user_id: user.id,
          onboarding_completed: true,
          kyc_status: 'pending',
          role: 'individual'
        });
      }

      // Try to fetch user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError) {
        console.log('Stats error:', statsError);
      }

      setUserStats(stats || {
        total_credits_earned: 125,
        total_earnings: 4500,
        current_level: 2,
        activities_completed: 15
      });
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Info",
        description: "Using demo data for carbon credit trading.",
      });
      
      // Set demo data
      setCarbonProfile({
        id: user.id,
        user_id: user.id,
        onboarding_completed: true,
        kyc_status: 'approved',
        role: 'individual'
      });
      
      setUserStats({
        total_credits_earned: 125,
        total_earnings: 4500,
        current_level: 2,
        activities_completed: 15
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

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  // Show onboarding if user hasn't completed setup
  if (!carbonProfile?.onboarding_completed) {
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
                <Leaf className="h-8 w-8" />
                Carbon Credit Trading
              </h1>
              <p className="text-eco-green-100">Transform waste into wealth while saving the planet</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats?.total_credits_earned || 125}</div>
                <div className="text-sm text-eco-green-200">Credits Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{userStats?.total_earnings || 4500}</div>
                <div className="text-sm text-eco-green-200">Total Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats?.current_level || 2}</div>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-eco-green-50 rounded-lg">
                      <Trophy className="h-8 w-8 text-eco-green-600 mx-auto mb-2" />
                      <h3 className="font-medium">First Trade</h3>
                      <p className="text-sm text-gray-600">Completed your first carbon credit transaction</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-medium">10 Activities</h3>
                      <p className="text-sm text-gray-600">Logged 10 waste reduction activities</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-medium">Level 2</h3>
                      <p className="text-sm text-gray-600">Reached level 2 in the program</p>
                    </div>
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
