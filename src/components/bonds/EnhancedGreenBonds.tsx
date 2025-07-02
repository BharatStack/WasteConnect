
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, TrendingUp, AlertTriangle, DollarSign, BarChart3, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EnhancedGreenBonds = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch active green bonds
  const { data: bonds = [] } = useQuery({
    queryKey: ['green-bonds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('green_bonds')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's bond investments
  const { data: investments = [] } = useQuery({
    queryKey: ['bond-investments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('bond_investments')
        .select(`
          *,
          green_bonds (*)
        `)
        .eq('investor_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch environmental impact data - using type assertion
  const { data: impactData = [] } = useQuery({
    queryKey: ['environmental-impact'],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('environmental_impact_tracking')
          .select(`
            *,
            green_bonds (bond_name, category)
          `)
          .eq('verification_status', 'verified')
          .order('reporting_period_end', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.log('Error fetching impact data:', error);
        return [];
      }
    },
  });

  // Fetch greenwashing alerts - using type assertion
  const { data: greenwashingAlerts = [] } = useQuery({
    queryKey: ['greenwashing-alerts'],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('greenwashing_alerts')
          .select(`
            *,
            green_bonds (bond_name, issuer_name)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.log('Error fetching greenwashing alerts:', error);
        return [];
      }
    },
  });

  // Fetch bond pricing history - using type assertion
  const { data: pricingData = [] } = useQuery({
    queryKey: ['bond-pricing'],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('bond_pricing_history')
          .select(`
            *,
            green_bonds (bond_name, bond_symbol)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.log('Error fetching pricing data:', error);
        return [];
      }
    },
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      renewable_energy: 'bg-green-100 text-green-800',
      waste_management: 'bg-blue-100 text-blue-800',
      water_treatment: 'bg-cyan-100 text-cyan-800',
      sustainable_transport: 'bg-purple-100 text-purple-800',
      green_buildings: 'bg-yellow-100 text-yellow-800',
      biodiversity: 'bg-emerald-100 text-emerald-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getRatingColor = (rating: string) => {
    if (rating.startsWith('AA')) return 'text-green-600';
    if (rating.startsWith('A')) return 'text-blue-600';
    if (rating.startsWith('BBB')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      very_low: 'bg-green-100 text-green-800',
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      very_high: 'bg-red-100 text-red-800',
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Green Bonds Platform</h1>
          <p className="text-gray-600">AI-powered sustainable finance with real-time impact tracking</p>
        </div>

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            <TabsTrigger value="impact">Impact Tracking</TabsTrigger>
            <TabsTrigger value="alerts">Risk Alerts</TabsTrigger>
            <TabsTrigger value="pricing">AI Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid gap-6">
              {bonds.map((bond: any) => (
                <Card key={bond.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Leaf className="h-5 w-5 text-green-600" />
                          {bond.bond_name}
                        </CardTitle>
                        <CardDescription>{bond.issuer_name}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className={getCategoryColor(bond.category)}>
                          {bond.category?.replace('_', ' ')}
                        </Badge>
                        {bond.bond_rating && (
                          <p className={`text-sm font-medium mt-1 ${getRatingColor(bond.bond_rating)}`}>
                            {bond.bond_rating}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Interest Rate</p>
                        <p className="font-medium">{(bond.interest_rate * 100).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Min Investment</p>
                        <p className="font-medium">₹{bond.minimum_investment?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Maturity</p>
                        <p className="font-medium">{new Date(bond.maturity_date).getFullYear()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Available</p>
                        <p className="font-medium">₹{bond.available_amount?.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Funding Progress</span>
                        <span>{Math.round(((bond.total_amount - bond.available_amount) / bond.total_amount) * 100)}%</span>
                      </div>
                      <Progress 
                        value={((bond.total_amount - bond.available_amount) / bond.total_amount) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">{bond.description}</p>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Invest Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid gap-6">
              {investments.length > 0 ? (
                investments.map((investment: any) => (
                  <Card key={investment.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{investment.green_bonds?.bond_name}</CardTitle>
                        <Badge variant="outline">{investment.status}</Badge>
                      </div>
                      <CardDescription>{investment.green_bonds?.issuer_name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Investment Amount</p>
                          <p className="font-medium">₹{investment.investment_amount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Expected Return</p>
                          <p className="font-medium">₹{investment.expected_return?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Purchase Date</p>
                          <p className="font-medium">{new Date(investment.purchase_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Maturity Date</p>
                          <p className="font-medium">{new Date(investment.maturity_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No investments yet</p>
                    <Button>Start Investing</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="grid gap-6">
              {impactData.map((impact: any) => (
                <Card key={impact?.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      {impact?.green_bonds?.bond_name}
                    </CardTitle>
                    <CardDescription>
                      Impact Report: {new Date(impact?.reporting_period_start).toLocaleDateString()} - {new Date(impact?.reporting_period_end).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{impact?.carbon_reduction_tons || 0}</p>
                        <p className="text-sm text-gray-600">CO₂ Reduced (tons)</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{impact?.renewable_energy_mwh || 0}</p>
                        <p className="text-sm text-gray-600">Clean Energy (MWh)</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{impact?.jobs_created || 0}</p>
                        <p className="text-sm text-gray-600">Jobs Created</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">{impact?.communities_benefited || 0}</p>
                        <p className="text-sm text-gray-600">Communities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid gap-6">
              {greenwashingAlerts.length > 0 ? (
                greenwashingAlerts.map((alert: any) => (
                  <Card key={alert?.id} className="border-l-4 border-l-yellow-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            {alert?.alert_type}
                          </CardTitle>
                          <CardDescription>{alert?.green_bonds?.bond_name} - {alert?.green_bonds?.issuer_name}</CardDescription>
                        </div>
                        <Badge className={getSeverityColor(alert?.severity)}>
                          {alert?.severity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-2">{alert?.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          AI Confidence: {(alert?.ai_confidence_score * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(alert?.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No active risk alerts</p>
                    <p className="text-sm text-gray-400 mt-2">Our AI monitoring system keeps you protected</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <div className="grid gap-6">
              {pricingData.map((pricing: any) => (
                <Card key={pricing?.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      {pricing?.green_bonds?.bond_name} ({pricing?.green_bonds?.bond_symbol})
                    </CardTitle>
                    <CardDescription>AI Dynamic Pricing Update</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Price</p>
                        <p className="text-xl font-bold">₹{pricing?.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Environmental Score</p>
                        <p className="font-medium">{pricing?.environmental_performance_score || 'N/A'}/5.0</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Model Version</p>
                        <p className="font-medium">{pricing?.ai_pricing_model_version || 'v1.0'}</p>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Last updated: {new Date(pricing?.created_at).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedGreenBonds;
