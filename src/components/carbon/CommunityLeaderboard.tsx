
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';

const CommunityLeaderboard = () => {
  const [leaderboards, setLeaderboards] = useState<any>({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      // This would typically fetch real leaderboard data
      // For now, we'll create mock data
      const mockData = {
        daily: [
          { id: 1, user_name: 'EcoWarrior123', credits_earned: 15.5, activities_count: 8, rank_position: 1 },
          { id: 2, user_name: 'G***nGuardian', credits_earned: 12.3, activities_count: 6, rank_position: 2 },
          { id: 3, user_name: 'WasteBuster', credits_earned: 10.8, activities_count: 5, rank_position: 3 },
          { id: 4, user_name: 'CleanEarth', credits_earned: 9.2, activities_count: 4, rank_position: 4 },
          { id: 5, user_name: 'RecycleKing', credits_earned: 8.7, activities_count: 3, rank_position: 5 }
        ],
        weekly: [
          { id: 1, user_name: 'EcoChampion', credits_earned: 85.2, activities_count: 32, rank_position: 1 },
          { id: 2, user_name: 'GreenHero', credits_earned: 72.8, activities_count: 28, rank_position: 2 },
          { id: 3, user_name: 'SustainableLiving', credits_earned: 68.5, activities_count: 25, rank_position: 3 },
          { id: 4, user_name: 'EcoMaster', credits_earned: 61.3, activities_count: 23, rank_position: 4 },
          { id: 5, user_name: 'WasteWise', credits_earned: 55.9, activities_count: 20, rank_position: 5 }
        ],
        monthly: [
          { id: 1, user_name: 'PlanetSaver', credits_earned: 342.5, activities_count: 125, rank_position: 1 },
          { id: 2, user_name: 'EcoLegend', credits_earned: 298.7, activities_count: 110, rank_position: 2 },
          { id: 3, user_name: 'GreenGuru', credits_earned: 276.3, activities_count: 98, rank_position: 3 },
          { id: 4, user_name: 'SustainStar', credits_earned: 245.8, activities_count: 89, rank_position: 4 },
          { id: 5, user_name: 'ClimateHero', credits_earned: 223.4, activities_count: 82, rank_position: 5 }
        ]
      };

      setLeaderboards(mockData);
    } catch (error: any) {
      console.error('Error fetching leaderboards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="h-5 w-5 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 3:
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const renderLeaderboardTable = (data: any[]) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {data.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
              user.rank_position <= 3 
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                : 'bg-white border-gray-200 hover:border-eco-green-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getRankIcon(user.rank_position)}
                <Badge className={getRankBadgeColor(user.rank_position)}>
                  #{user.rank_position}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-eco-green-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-eco-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {user.user_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {user.activities_count} activities
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-eco-green-600 text-lg">
                {user.credits_earned} credits
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Rising
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Community Leaderboard
          </CardTitle>
          <CardDescription>
            See how you rank against other eco-warriors in the community
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Top Performers</CardTitle>
              <CardDescription>
                Leading contributors for the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderLeaderboardTable(leaderboards.daily)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Week's Champions</CardTitle>
              <CardDescription>
                Top performers over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderLeaderboardTable(leaderboards.weekly)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Leaderboard</CardTitle>
              <CardDescription>
                Top contributors for this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderLeaderboardTable(leaderboards.monthly)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Competition Info */}
      <Card className="bg-gradient-to-r from-eco-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="text-center">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Monthly Competition Rewards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">₹5,000</div>
                <div className="text-sm text-gray-600">1st Place</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">₹3,000</div>
                <div className="text-sm text-gray-600">2nd Place</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">₹1,000</div>
                <div className="text-sm text-gray-600">3rd Place</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Plus bonus rewards for top 10 performers each month!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityLeaderboard;
