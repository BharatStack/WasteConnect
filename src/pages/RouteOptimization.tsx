
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Route, MapPin, Clock, Fuel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RouteOptimization {
  id: string;
  route_name: string;
  start_location: string;
  end_location: string;
  estimated_distance: number | null;
  estimated_time: number | null;
  fuel_saved: number | null;
  carbon_reduction: number | null;
  status: string;
  created_at: string;
}

const RouteOptimization = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [routes, setRoutes] = useState<RouteOptimization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    route_name: '',
    start_location: '',
    end_location: ''
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('route_optimizations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoutes(data || []);
    } catch (error: any) {
      console.error('Error fetching routes:', error);
      toast({
        title: "Error",
        description: "Failed to load route optimizations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateRouteOptimization = (startLocation: string, endLocation: string) => {
    // Simple simulation - in real app, this would integrate with mapping APIs
    const baseDistance = Math.random() * 50 + 10; // 10-60 km
    const optimizedDistance = baseDistance * 0.85; // 15% improvement
    const fuelSavings = (baseDistance - optimizedDistance) * 0.1; // Rough fuel consumption
    const carbonReduction = fuelSavings * 2.3; // CO2 per liter of fuel

    return {
      estimated_distance: optimizedDistance,
      estimated_time: Math.round(optimizedDistance * 1.5), // minutes
      fuel_saved: fuelSavings,
      carbon_reduction: carbonReduction
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsCreating(true);

    try {
      const optimization = simulateRouteOptimization(formData.start_location, formData.end_location);

      const { error } = await supabase
        .from('route_optimizations')
        .insert({
          user_id: user.id,
          route_name: formData.route_name,
          start_location: formData.start_location,
          end_location: formData.end_location,
          ...optimization,
          status: 'completed'
        });

      if (error) throw error;

      toast({
        title: "Route Optimized",
        description: "Your route has been optimized successfully!",
      });

      setFormData({
        route_name: '',
        start_location: '',
        end_location: ''
      });

      fetchRoutes();
    } catch (error: any) {
      console.error('Error creating route optimization:', error);
      toast({
        title: "Error",
        description: "Failed to optimize route. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/dashboard" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-eco-green-700">Route Optimization</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-eco-green-600" />
                Create New Route
              </CardTitle>
              <CardDescription>
                Optimize your waste collection routes to save fuel and reduce emissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="route_name">Route Name *</Label>
                  <Input
                    id="route_name"
                    value={formData.route_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, route_name: e.target.value }))}
                    placeholder="e.g., Downtown Collection Route"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_location">Start Location *</Label>
                  <Input
                    id="start_location"
                    value={formData.start_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_location: e.target.value }))}
                    placeholder="e.g., Main Depot, 123 Main St"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_location">End Location *</Label>
                  <Input
                    id="end_location"
                    value={formData.end_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_location: e.target.value }))}
                    placeholder="e.g., Processing Center, 456 Industrial Ave"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                  disabled={isCreating}
                >
                  {isCreating ? "Optimizing..." : "Optimize Route"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Optimized Routes</h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green-600"></div>
              </div>
            ) : routes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Route className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No routes yet</h3>
                  <p className="text-gray-500">Create your first optimized route to start saving fuel and reducing emissions.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {routes.map((route) => (
                  <Card key={route.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{route.route_name}</CardTitle>
                        <Badge className={getStatusColor(route.status)}>
                          {route.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{route.start_location} → {route.end_location}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {route.estimated_distance && (
                          <div className="flex items-center gap-2">
                            <Route className="h-4 w-4 text-eco-green-600" />
                            <span>{route.estimated_distance.toFixed(1)} km</span>
                          </div>
                        )}
                        {route.estimated_time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-eco-green-600" />
                            <span>{route.estimated_time} min</span>
                          </div>
                        )}
                        {route.fuel_saved && (
                          <div className="flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-eco-green-600" />
                            <span>{route.fuel_saved.toFixed(1)}L saved</span>
                          </div>
                        )}
                        {route.carbon_reduction && (
                          <div className="flex items-center gap-2">
                            <span className="text-eco-green-600">🌱</span>
                            <span>{route.carbon_reduction.toFixed(1)} kg CO₂ reduced</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;
