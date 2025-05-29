
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BarChart3, TrendingUp, Leaf, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface WasteData {
  id: string;
  waste_type: string;
  quantity: number;
  unit: string;
  collection_date: string | null;
  environmental_impact: any;
  created_at: string;
}

interface AnalyticsData {
  id: string;
  period_start: string;
  period_end: string;
  total_waste_generated: number | null;
  recycling_rate: number | null;
  carbon_footprint: number | null;
  cost_savings: number | null;
}

const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wasteData, setWasteData] = useState<WasteData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    fetchWasteData();
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchWasteData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const daysAgo = parseInt(selectedPeriod);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data, error } = await supabase
        .from('waste_data_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      setWasteData(data || []);
    } catch (error: any) {
      console.error('Error fetching waste data:', error);
      toast({
        title: "Error",
        description: "Failed to load waste data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('waste_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('period_start', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
    }
  };

  const generateAnalytics = async () => {
    if (!user || wasteData.length === 0) return;

    setIsLoading(true);
    try {
      // Calculate analytics from waste data
      const totalWaste = wasteData.reduce((sum, item) => sum + item.quantity, 0);
      const recyclableWaste = wasteData
        .filter(item => item.waste_type === 'recyclable')
        .reduce((sum, item) => sum + item.quantity, 0);
      const recyclingRate = totalWaste > 0 ? (recyclableWaste / totalWaste) * 100 : 0;

      // Calculate carbon footprint and cost savings from environmental impact data
      let totalCarbonReduction = 0;
      let totalCostSavings = 0;

      wasteData.forEach(item => {
        if (item.environmental_impact) {
          totalCarbonReduction += item.environmental_impact.co2_reduction_kg || 0;
          // Estimate cost savings based on waste type and quantity
          const costPerKg = item.waste_type === 'recyclable' ? 0.5 : 
                           item.waste_type === 'organic' ? 0.3 : 0.1;
          totalCostSavings += item.quantity * costPerKg;
        }
      });

      const daysAgo = parseInt(selectedPeriod);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      const endDate = new Date();

      const { error } = await supabase
        .from('waste_analytics')
        .insert({
          user_id: user.id,
          period_start: startDate.toISOString().split('T')[0],
          period_end: endDate.toISOString().split('T')[0],
          total_waste_generated: totalWaste,
          recycling_rate: recyclingRate,
          carbon_footprint: totalCarbonReduction,
          cost_savings: totalCostSavings
        });

      if (error) throw error;

      toast({
        title: "Analytics Generated",
        description: "Your waste analytics have been calculated and saved!",
      });

      fetchAnalytics();
    } catch (error: any) {
      console.error('Error generating analytics:', error);
      toast({
        title: "Error",
        description: "Failed to generate analytics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data
  const wasteByType = wasteData.reduce((acc, item) => {
    const existing = acc.find(a => a.type === item.waste_type);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      acc.push({ type: item.waste_type, quantity: item.quantity });
    }
    return acc;
  }, [] as { type: string; quantity: number }[]);

  const monthlyData = wasteData.reduce((acc, item) => {
    const month = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(a => a.month === month);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      acc.push({ month, quantity: item.quantity });
    }
    return acc;
  }, [] as { month: string; quantity: number }[]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const currentAnalytics = analytics[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/dashboard" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-eco-green-700">Waste Analytics</h1>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={generateAnalytics}
            className="bg-eco-green-600 hover:bg-eco-green-700"
            disabled={isLoading || wasteData.length === 0}
          >
            {isLoading ? "Generating..." : "Generate Analytics"}
          </Button>
        </div>

        {/* Key Metrics */}
        {currentAnalytics && (
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Waste</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentAnalytics.total_waste_generated?.toFixed(1) || '0'} kg</div>
                <p className="text-xs text-muted-foreground">
                  {selectedPeriod} day period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recycling Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentAnalytics.recycling_rate?.toFixed(1) || '0'}%</div>
                <p className="text-xs text-muted-foreground">
                  Of total waste recycled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Reduction</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentAnalytics.carbon_footprint?.toFixed(1) || '0'} kg</div>
                <p className="text-xs text-muted-foreground">
                  Carbon footprint reduced
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentAnalytics.cost_savings?.toFixed(2) || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  Estimated savings
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Waste by Type</CardTitle>
              <CardDescription>Distribution of waste types in your data</CardDescription>
            </CardHeader>
            <CardContent>
              {wasteByType.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={wasteByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantity"
                    >
                      {wasteByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} kg`, 'Quantity']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No waste data available for the selected period
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Waste Trend</CardTitle>
              <CardDescription>Waste generation over time</CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value} kg`, 'Quantity']} />
                    <Line type="monotone" dataKey="quantity" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No trend data available for the selected period
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Historical Analytics */}
        {analytics.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Historical Analytics</CardTitle>
              <CardDescription>Your past analytics reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{report.total_waste_generated?.toFixed(1) || '0'} kg waste</span>
                        <span>{report.recycling_rate?.toFixed(1) || '0'}% recycled</span>
                        <span>{report.carbon_footprint?.toFixed(1) || '0'} kg CO₂ reduced</span>
                        <span>${report.cost_savings?.toFixed(2) || '0'} saved</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analytics;
