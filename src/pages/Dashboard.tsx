
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Route, ShoppingCart, BarChart3, MessageSquare, TrendingUp, Leaf, Recycle, Layout } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardIntegrations from '@/components/dashboard/DashboardIntegrations';

interface WasteStats {
  totalWaste: number;
  recyclingRate: number;
  carbonReduction: number;
  costSavings: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [wasteStats, setWasteStats] = useState<WasteStats>({
    totalWaste: 0,
    recyclingRate: 0,
    carbonReduction: 0,
    costSavings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWasteStats();
  }, [user]);

  const fetchWasteStats = async () => {
    if (!user) return;

    try {
      // Fetch waste data logs
      const { data: wasteData, error: wasteError } = await supabase
        .from('waste_data_logs')
        .select('quantity, waste_type, environmental_impact')
        .eq('user_id', user.id);

      if (wasteError) throw wasteError;

      // Calculate statistics
      let totalWaste = 0;
      let recyclableWaste = 0;
      let totalCarbonReduction = 0;
      let totalCostSavings = 0;

      wasteData?.forEach(item => {
        totalWaste += item.quantity;
        if (item.waste_type === 'recyclable') {
          recyclableWaste += item.quantity;
        }
        if (item.environmental_impact && typeof item.environmental_impact === 'object') {
          const impact = item.environmental_impact as any;
          totalCarbonReduction += impact.co2_reduction_kg || 0;
        }
        // Estimate cost savings
        const costPerKg = item.waste_type === 'recyclable' ? 0.5 : 
                         item.waste_type === 'organic' ? 0.3 : 0.1;
        totalCostSavings += item.quantity * costPerKg;
      });

      const recyclingRate = totalWaste > 0 ? (recyclableWaste / totalWaste) * 100 : 0;

      setWasteStats({
        totalWaste,
        recyclingRate,
        carbonReduction: totalCarbonReduction,
        costSavings: totalCostSavings
      });
    } catch (error) {
      console.error('Error fetching waste stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your waste data and environmental impact</p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Waste Statistics */}
              <div className="grid gap-6 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Waste Logged</CardTitle>
                    <Trash2 className="h-4 w-4 text-eco-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{wasteStats.totalWaste.toFixed(1)} kg</div>
                    <p className="text-xs text-muted-foreground">All time total</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recycling Rate</CardTitle>
                    <Recycle className="h-4 w-4 text-eco-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{wasteStats.recyclingRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Of total waste recycled</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CO₂ Reduction</CardTitle>
                    <Leaf className="h-4 w-4 text-eco-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{wasteStats.carbonReduction.toFixed(1)} kg</div>
                    <p className="text-xs text-muted-foreground">Carbon footprint reduced</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                    <TrendingUp className="h-4 w-4 text-eco-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${wasteStats.costSavings.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Estimated savings</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              {/* Feature Actions */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trash2 className="h-5 w-5 text-eco-green-600" />
                      Waste Data Entry
                    </CardTitle>
                    <CardDescription>
                      Record waste data with automatic environmental impact calculations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/waste-entry">
                      <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                        Log Waste Data
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Route className="h-5 w-5 text-eco-green-600" />
                      Route Optimization
                    </CardTitle>
                    <CardDescription>
                      Optimize collection routes to reduce fuel consumption and emissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/route-optimization">
                      <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                        Optimize Routes
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="h-5 w-5 text-eco-green-600" />
                      Analytics & Reports
                    </CardTitle>
                    <CardDescription>
                      View detailed analytics and generate environmental impact reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/analytics">
                      <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                        View Analytics
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ShoppingCart className="h-5 w-5 text-eco-green-600" />
                      Circular Economy
                    </CardTitle>
                    <CardDescription>
                      Buy and sell recyclable materials in our marketplace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/marketplace">
                      <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                        Browse Marketplace
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="h-5 w-5 text-eco-green-600" />
                      Citizen Reports
                    </CardTitle>
                    <CardDescription>
                      Report environmental issues and track municipality responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/citizen-reports">
                      <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                        View Reports
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <DashboardIntegrations />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
