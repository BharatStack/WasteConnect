
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, X, Truck, Clock, Package } from 'lucide-react';

interface Waypoint {
  id: string;
  address: string;
  wasteType: string;
  estimatedVolume: number;
  timeWindow: string;
}

interface RouteFormData {
  route_name: string;
  start_location: string;
  end_location: string;
  waypoints: Waypoint[];
  vehicle_type: string;
  vehicle_capacity: number;
  fuel_type: string;
  driver_id: string;
  collection_types: string[];
  time_constraints: string;
}

interface RouteFormProps {
  onSubmit: (data: RouteFormData) => void;
  isLoading: boolean;
}

const RouteForm: React.FC<RouteFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<RouteFormData>({
    route_name: '',
    start_location: '',
    end_location: '',
    waypoints: [],
    vehicle_type: '',
    vehicle_capacity: 0,
    fuel_type: '',
    driver_id: '',
    collection_types: [],
    time_constraints: ''
  });

  const [currentWaypoint, setCurrentWaypoint] = useState({
    address: '',
    wasteType: 'general',
    estimatedVolume: 0,
    timeWindow: ''
  });

  const drivers = [
    { id: 'driver1', name: 'John Smith' },
    { id: 'driver2', name: 'Sarah Johnson' },
    { id: 'driver3', name: 'Mike Wilson' }
  ];

  const wasteTypes = ['general', 'recycling', 'organic', 'hazardous'];
  const vehicleTypes = ['small_truck', 'medium_truck', 'large_truck', 'compactor'];
  const fuelTypes = ['diesel', 'electric', 'hybrid', 'cng'];

  const addWaypoint = () => {
    if (currentWaypoint.address) {
      const newWaypoint: Waypoint = {
        id: Date.now().toString(),
        ...currentWaypoint
      };
      setFormData(prev => ({
        ...prev,
        waypoints: [...prev.waypoints, newWaypoint]
      }));
      setCurrentWaypoint({
        address: '',
        wasteType: 'general',
        estimatedVolume: 0,
        timeWindow: ''
      });
    }
  };

  const removeWaypoint = (id: string) => {
    setFormData(prev => ({
      ...prev,
      waypoints: prev.waypoints.filter(wp => wp.id !== id)
    }));
  };

  const toggleCollectionType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      collection_types: prev.collection_types.includes(type)
        ? prev.collection_types.filter(t => t !== type)
        : [...prev.collection_types, type]
    }));
  };

  const calculateTotalVolume = () => {
    return formData.waypoints.reduce((total, wp) => total + wp.estimatedVolume, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-eco-green-600" />
          Enhanced Route Planning
        </CardTitle>
        <CardDescription>
          Create optimized waste collection routes with advanced planning features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Route Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Route Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="route_name">Route Name *</Label>
              <Input
                id="route_name"
                value={formData.route_name}
                onChange={(e) => setFormData(prev => ({ ...prev, route_name: e.target.value }))}
                placeholder="e.g., Downtown Collection Route"
                className="transition-all duration-200 focus:ring-2 focus:ring-eco-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>

          {/* Vehicle Specifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Vehicle Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_capacity">Vehicle Capacity (tons)</Label>
                <Input
                  id="vehicle_capacity"
                  type="number"
                  value={formData.vehicle_capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_capacity: parseFloat(e.target.value) || 0 }))}
                  placeholder="e.g., 15"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver_id">Assign Driver</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, driver_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map(driver => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Collection Types */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Collection Types</h3>
            <div className="flex flex-wrap gap-2">
              {wasteTypes.map(type => (
                <Badge
                  key={type}
                  variant={formData.collection_types.includes(type) ? "default" : "outline"}
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                  onClick={() => toggleCollectionType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Waypoints Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Collection Waypoints</h3>
            
            {/* Add Waypoint Form */}
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Collection point address"
                  value={currentWaypoint.address}
                  onChange={(e) => setCurrentWaypoint(prev => ({ ...prev, address: e.target.value }))}
                />
                <Select 
                  value={currentWaypoint.wasteType}
                  onValueChange={(value) => setCurrentWaypoint(prev => ({ ...prev, wasteType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Estimated volume (tons)"
                  value={currentWaypoint.estimatedVolume || ''}
                  onChange={(e) => setCurrentWaypoint(prev => ({ ...prev, estimatedVolume: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  step="0.1"
                />
                <Input
                  placeholder="Preferred time window"
                  value={currentWaypoint.timeWindow}
                  onChange={(e) => setCurrentWaypoint(prev => ({ ...prev, timeWindow: e.target.value }))}
                />
              </div>
              
              <Button
                type="button"
                onClick={addWaypoint}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={!currentWaypoint.address}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Waypoint
              </Button>
            </div>

            {/* Waypoints List */}
            {formData.waypoints.length > 0 && (
              <div className="space-y-2">
                {formData.waypoints.map((waypoint, index) => (
                  <div key={waypoint.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-eco-green-100 text-eco-green-700 rounded-full text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{waypoint.address}</div>
                        <div className="text-xs text-gray-500">
                          {waypoint.wasteType} • {waypoint.estimatedVolume}t • {waypoint.timeWindow}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeWaypoint(waypoint.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {/* Load Capacity Summary */}
                <div className="p-3 bg-eco-green-50 rounded-lg border border-eco-green-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-eco-green-600" />
                      Total Load Capacity
                    </span>
                    <span className="font-medium">
                      {calculateTotalVolume().toFixed(1)}t / {formData.vehicle_capacity}t
                    </span>
                  </div>
                  {formData.vehicle_capacity > 0 && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-eco-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((calculateTotalVolume() / formData.vehicle_capacity) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Time Constraints */}
          <div className="space-y-2">
            <Label htmlFor="time_constraints">Time Constraints</Label>
            <Input
              id="time_constraints"
              value={formData.time_constraints}
              onChange={(e) => setFormData(prev => ({ ...prev, time_constraints: e.target.value }))}
              placeholder="e.g., Complete route by 3 PM, avoid rush hours"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-eco-green-600 hover:bg-eco-green-700 transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Optimizing Route...
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Optimize Route
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RouteForm;
