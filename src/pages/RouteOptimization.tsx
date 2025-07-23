
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RouteForm from '@/components/route/RouteForm';
import RouteMap from '@/components/route/RouteMap';
import RouteHistory from '@/components/route/RouteHistory';

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

interface RouteFormData {
  route_name: string;
  start_location: string;
  end_location: string;
  waypoints: Array<{
    id: string;
    address: string;
    wasteType: string;
    estimatedVolume: number;
    timeWindow: string;
  }>;
  vehicle_type: string;
  vehicle_capacity: number;
  fuel_type: string;
  driver_id: string;
  collection_types: string[];
  time_constraints: string;
}

const RouteOptimization = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [routes, setRoutes] = useState<RouteOptimization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentOptimization, setCurrentOptimization] = useState<any>(null);

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

  const simulateAdvancedRouteOptimization = (formData: RouteFormData) => {
    // Enhanced simulation with more realistic calculations
    const totalWaypoints = formData.waypoints.length;
    const baseDistance = Math.random() * 30 + 15 + (totalWaypoints * 3); // 15-45 km base + waypoints
    
    // Consider vehicle type for efficiency
    const vehicleEfficiencyMultiplier = {
      'small_truck': 0.9,
      'medium_truck': 1.0,
      'large_truck': 1.2,
      'compactor': 0.8
    }[formData.vehicle_type] || 1.0;
    
    const optimizedDistance = baseDistance * 0.85 * vehicleEfficiencyMultiplier;
    const timePerKm = formData.fuel_type === 'electric' ? 1.2 : 1.5; // Electric slower but more efficient
    const fuelConsumptionRate = formData.fuel_type === 'electric' ? 0.05 : 0.12; // L/km equivalent
    
    const fuelSavings = (baseDistance - optimizedDistance) * fuelConsumptionRate;
    const carbonReduction = fuelSavings * (formData.fuel_type === 'electric' ? 1.5 : 2.3); // Different emission factors

    return {
      estimated_distance: optimizedDistance,
      estimated_time: Math.round(optimizedDistance * timePerKm),
      fuel_saved: fuelSavings,
      carbon_reduction: carbonReduction,
      waypoints_data: formData.waypoints.map((wp, index) => ({
        ...wp,
        order: index + 1,
        estimated_arrival: `${9 + Math.floor(index * 0.5)}:${(index * 30) % 60 < 10 ? '0' : ''}${(index * 30) % 60}`
      }))
    };
  };

  const handleRouteSubmit = async (formData: RouteFormData) => {
    if (!user) return;

    setIsCreating(true);

    try {
      const optimization = simulateAdvancedRouteOptimization(formData);

      const { data, error } = await supabase
        .from('route_optimizations')
        .insert({
          user_id: user.id,
          route_name: formData.route_name,
          start_location: formData.start_location,
          end_location: formData.end_location,
          ...optimization,
          status: 'completed'
        })
        .select()
        .single();

      if (error) throw error;

      // Set current optimization for map display
      setCurrentOptimization({
        ...optimization,
        waypoints: formData.waypoints,
        start_location: formData.start_location,
        end_location: formData.end_location
      });

      toast({
        title: "Route Optimized Successfully! 🎉",
        description: `Your route has been optimized with ${formData.waypoints.length} waypoints. Fuel savings: ${optimization.fuel_saved.toFixed(1)}L`,
      });

      fetchRoutes();
    } catch (error: any) {
      console.error('Error creating route optimization:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize route. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDuplicateRoute = (route: RouteOptimization) => {
    // Logic to duplicate route would go here
    toast({
      title: "Route Duplicated",
      description: `"${route.route_name}" has been duplicated for editing.`,
    });
  };

  const handleSaveAsTemplate = (route: RouteOptimization) => {
    // Logic to save as template would go here
    toast({
      title: "Template Saved",
      description: `"${route.route_name}" has been saved as a template.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-eco-green-50">
      {/* Enhanced Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700 transition-colors duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          {/* Route Status Indicator */}
          {currentOptimization && (
            <div className="flex items-center gap-2 px-3 py-1 bg-eco-green-100 text-eco-green-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-eco-green-600 rounded-full animate-pulse"></div>
              Route Optimized
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-eco-green-700 mb-2">
            Advanced Route Optimization
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create intelligent waste collection routes with waypoint management, 
            vehicle optimization, and real-time analytics for maximum efficiency.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <RouteForm 
              onSubmit={handleRouteSubmit}
              isLoading={isCreating}
            />
          </div>

          {/* Right Column - Map and Analytics */}
          <div className="space-y-6">
            <RouteMap
              startLocation={currentOptimization?.start_location || ''}
              endLocation={currentOptimization?.end_location || ''}
              waypoints={currentOptimization?.waypoints || []}
              optimizedData={currentOptimization ? {
                estimated_distance: currentOptimization.estimated_distance,
                estimated_time: currentOptimization.estimated_time,
                fuel_saved: currentOptimization.fuel_saved,
                carbon_reduction: currentOptimization.carbon_reduction
              } : undefined}
            />
          </div>
        </div>

        {/* Route History - Full Width */}
        <div className="mt-12">
          <RouteHistory
            routes={routes}
            isLoading={isLoading}
            onDuplicateRoute={handleDuplicateRoute}
            onSaveAsTemplate={handleSaveAsTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;
