import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trash2, 
  Route, 
  ShoppingCart, 
  BarChart3, 
  MessageSquare, 
  TrendingUp, 
  Leaf, 
  Recycle, 
  DollarSign,
  Coins,
  CreditCard,
  PiggyBank,
  Shield,
  Building,
  Users2,
  FileText,
  Globe,
  Network,
  Users,
  MapPin,
  Handshake
} from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardIntegrations from '@/components/dashboard/DashboardIntegrations';
import NetworkDashboard from '@/components/network/NetworkDashboard';

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
  const [showNetworkDashboard, setShowNetworkDashboard] = useState(false);

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

  if (showNetworkDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-4">
              <Button 
                variant="outline" 
                onClick={() => setShowNetworkDashboard(false)}
                className="mb-4"
              >
                ← Back to Dashboard
              </Button>
            </div>
            <NetworkDashboard />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your waste data, environmental impact, and green finance opportunities</p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Core Features</TabsTrigger>
              <TabsTrigger value="green-finance">Green Finance</TabsTrigger>
              <TabsTrigger value="trading">Trading & Markets</TabsTrigger>
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Network className="h-5 w-5 text-eco-green-600" />
                      Network
                    </CardTitle>
                    <CardDescription>
                      Connect with bharat - Build connections across India's waste management ecosystem
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                        onClick={() => setShowNetworkDashboard(true)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Connect with Communities
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setShowNetworkDashboard(true)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Find Local Partners
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setShowNetworkDashboard(true)}
                      >
                        <Handshake className="h-4 w-4 mr-2" />
                        Join Networks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="green-finance" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Green Finance Solutions</h2>
                <p className="text-gray-600">Access sustainable financing options and environmental investments</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="h-5 w-5 text-eco-green-600" />
                      ESG Investment Tracking
                    </CardTitle>
                    <CardDescription>
                      Track ESG performance and access impact investment opportunities with AI-powered insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/esg-investment-tracking">
                      <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                        View ESG Dashboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Coins className="h-5 w-5 text-eco-green-600" />
                      Green Bonds Platform
                    </CardTitle>
                    <CardDescription>
                      Invest in green bonds for waste infrastructure projects with verified environmental impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/green-bonds">
                      <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                        Explore Green Bonds
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <PiggyBank className="h-5 w-5 text-eco-green-600" />
                      Micro-Finance Solutions
                    </CardTitle>
                    <CardDescription>
                      Access micro-loans and financial inclusion services for waste workers and small businesses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/micro-finance">
                      <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                        Apply for Micro-Finance
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-eco-green-600" />
                      Green Insurance
                    </CardTitle>
                    <CardDescription>
                      Parametric insurance for waste management operations and climate risk coverage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                      Get Insurance Quote
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CreditCard className="h-5 w-5 text-eco-green-600" />
                      Equipment Financing
                    </CardTitle>
                    <CardDescription>
                      Asset financing for waste collection vehicles, sorting equipment, and processing machinery
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                      Apply for Equipment Loan
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-eco-green-600" />
                      ESG Reporting & Compliance
                    </CardTitle>
                    <CardDescription>
                      Automated ESG reporting platform with regulatory compliance tracking
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                      Access Reporting Tools
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trading" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Environmental Asset Trading</h2>
                <p className="text-gray-600">Trade carbon credits, plastic credits, and other environmental assets</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Leaf className="h-5 w-5 text-eco-green-600" />
                      Carbon Credit Trading
                    </CardTitle>
                    <CardDescription>
                      Generate, buy, and sell verified carbon credits from waste reduction activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/carbon-trading">
                      <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                        Start Carbon Trading
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Recycle className="h-5 w-5 text-eco-green-600" />
                      Plastic Credit Marketplace
                    </CardTitle>
                    <CardDescription>
                      Trade plastic credits and achieve plastic neutrality through verified collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                      Trade Plastic Credits
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-eco-green-600" />
                      Green Cryptocurrency
                    </CardTitle>
                    <CardDescription>
                      Earn and trade green crypto backed by verified environmental assets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                      Access Green Crypto
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Globe className="h-5 w-5 text-eco-green-600" />
                      Water Credit Trading
                    </CardTitle>
                    <CardDescription>
                      Generate water credits from conservation through improved waste management
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                      Trade Water Credits
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users2 className="h-5 w-5 text-eco-green-600" />
                      Biodiversity Credits
                    </CardTitle>
                    <CardDescription>
                      Earn credits for waste management activities that protect natural habitats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                      Generate Bio Credits
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-eco-green-600" />
                      Corporate Offset Programs
                    </CardTitle>
                    <CardDescription>
                      B2B marketplace for corporate carbon offsetting and sustainability programs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                      Corporate Solutions
                    </Button>
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
