
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BarChart3, TrendingUp, Leaf, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 via-emerald-50 to-teal-50 dark:from-eco-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link to="/dashboard" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700 transition-all duration-200 group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-eco-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Waste Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive insights into your environmental impact
            </p>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="mb-8 flex items-center justify-between p-6 bg-white/80 dark:bg-eco-green-900/30 backdrop-blur-sm rounded-xl border border-eco-green-200/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Period
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-56 bg-white/70 border-eco-green-200 focus:border-eco-green-400 focus:ring-eco-green-400/20">
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
          </div>
          
          <Button 
            onClick={generateAnalytics}
            className="bg-gradient-to-r from-eco-green-600 via-emerald-600 to-teal-600 hover:from-eco-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl px-8 py-3"
            disabled={isLoading || wasteData.length === 0}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </div>
            ) : (
              "Generate Analytics"
            )}
          </Button>
        </div>

        {/* Enhanced Key Metrics */}
        {currentAnalytics && (
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="eco-card-enhanced group hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Waste</CardTitle>
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10">
                  <BarChart3 className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {currentAnalytics.total_waste_generated?.toFixed(1) || '0'} kg
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                  {selectedPeriod} day period
                </p>
              </CardContent>
            </Card>

            <Card className="eco-card-enhanced group hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Recycling Rate</CardTitle>
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-600/10">
                  <TrendingUp className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform duration-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  {currentAnalytics.recycling_rate?.toFixed(1) || '0'}%
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                  Of total waste recycled
                </p>
              </CardContent>
            </Card>

            <Card className="eco-card-enhanced group hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">CO₂ Reduction</CardTitle>
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10">
                  <Leaf className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {currentAnalytics.carbon_footprint?.toFixed(1) || '0'} kg
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                  Carbon footprint reduced
                </p>
              </CardContent>
            </Card>

            <Card className="eco-card-enhanced group hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Cost Savings</CardTitle>
                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/10">
                  <DollarSign className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform duration-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                  ${currentAnalytics.cost_savings?.toFixed(2) || '0'}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                  Estimated savings
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Charts */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="eco-card-enhanced">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-eco-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Waste by Type
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Distribution of waste types in your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {wasteByType.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
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
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-medium">No waste data available</p>
                    <p className="text-sm mt-1">for the selected period</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="eco-card-enhanced">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-eco-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Monthly Waste Trend
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Waste generation over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280"
                        fontSize={12}
                        fontWeight={500}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        fontWeight={500}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value} kg`, 'Quantity']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Bar 
                        dataKey="quantity" 
                        fill="url(#barGradient)"
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="50%" stopColor="#059669" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-medium">No trend data available</p>
                    <p className="text-sm mt-1">for the selected period</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Historical Analytics */}
        {analytics.length > 0 && (
          <Card className="mt-8 eco-card-enhanced">
            <CardHeader>
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-eco-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Historical Analytics
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Your past analytics reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.map((report, index) => (
                  <div key={report.id} className="flex items-center justify-between p-6 border border-eco-green-200/50 rounded-xl bg-gradient-to-r from-white/50 to-eco-green-50/30 dark:from-eco-green-900/20 dark:to-emerald-900/20 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-eco-green-600 transition-colors duration-200">
                        Report #{analytics.length - index}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">Total Waste</span>
                          <span className="font-semibold text-blue-600">{report.total_waste_generated?.toFixed(1) || '0'} kg</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">Recycled</span>
                          <span className="font-semibold text-emerald-600">{report.recycling_rate?.toFixed(1) || '0'}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">CO₂ Reduced</span>
                          <span className="font-semibold text-green-600">{report.carbon_footprint?.toFixed(1) || '0'} kg</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">Savings</span>
                          <span className="font-semibold text-amber-600">${report.cost_savings?.toFixed(2) || '0'}</span>
                        </div>
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
