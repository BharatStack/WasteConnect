
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, Fuel, Route as RouteIcon } from 'lucide-react';

interface MapLocation {
  id: string;
  address: string;
  type: 'start' | 'waypoint' | 'end';
  wasteType?: string;
  estimatedVolume?: number;
  timeWindow?: string;
}

interface RouteMapProps {
  startLocation: string;
  endLocation: string;
  waypoints: Array<{
    id: string;
    address: string;
    wasteType: string;
    estimatedVolume: number;
    timeWindow: string;
  }>;
  optimizedData?: {
    estimated_distance: number;
    estimated_time: number;
    fuel_saved: number;
    carbon_reduction: number;
  };
}

const RouteMap: React.FC<RouteMapProps> = ({ 
  startLocation, 
  endLocation, 
  waypoints,
  optimizedData 
}) => {
  const [locations, setLocations] = useState<MapLocation[]>([]);

  useEffect(() => {
    const newLocations: MapLocation[] = [];
    
    if (startLocation) {
      newLocations.push({
        id: 'start',
        address: startLocation,
        type: 'start'
      });
    }
    
    waypoints.forEach((waypoint, index) => {
      newLocations.push({
        id: waypoint.id,
        address: waypoint.address,
        type: 'waypoint',
        wasteType: waypoint.wasteType,
        estimatedVolume: waypoint.estimatedVolume,
        timeWindow: waypoint.timeWindow
      });
    });
    
    if (endLocation) {
      newLocations.push({
        id: 'end',
        address: endLocation,
        type: 'end'
      });
    }
    
    setLocations(newLocations);
  }, [startLocation, endLocation, waypoints]);

  const getMarkerColor = (type: string, wasteType?: string) => {
    switch (type) {
      case 'start':
        return 'bg-green-500';
      case 'end':
        return 'bg-red-500';
      case 'waypoint':
        switch (wasteType) {
          case 'recycling':
            return 'bg-blue-500';
          case 'organic':
            return 'bg-green-400';
          case 'hazardous':
            return 'bg-orange-500';
          default:
            return 'bg-gray-500';
        }
      default:
        return 'bg-gray-400';
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'start':
        return '🏁';
      case 'end':
        return '🏁';
      case 'waypoint':
        return '📍';
      default:
        return '📍';
    }
  };

  return (
    <div className="space-y-6">
      {/* Interactive Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-eco-green-600" />
            Route Visualization
          </CardTitle>
          <CardDescription>
            Interactive map showing optimized route with all collection points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-96 overflow-hidden border-2 border-dashed border-gray-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-eco-green-100 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="h-8 w-8 text-eco-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Interactive Map</h3>
                  <p className="text-gray-500">Map integration would display route visualization here</p>
                </div>
              </div>
            </div>
            
            {/* Route Points Overlay */}
            {locations.length > 0 && (
              <div className="absolute top-4 left-4 space-y-2 max-w-xs">
                {locations.map((location, index) => (
                  <div key={location.id} className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${getMarkerColor(location.type, location.wasteType)}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{location.address}</div>
                      {location.wasteType && (
                        <div className="text-gray-500">{location.wasteType}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Route Analytics */}
      {optimizedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RouteIcon className="h-5 w-5 text-eco-green-600" />
              Route Analytics
            </CardTitle>
            <CardDescription>
              Optimization results and efficiency metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-eco-green-50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-eco-green-100 rounded-full mx-auto mb-2">
                  <RouteIcon className="h-6 w-6 text-eco-green-600" />
                </div>
                <div className="text-2xl font-bold text-eco-green-700">
                  {optimizedData.estimated_distance.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">km distance</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {optimizedData.estimated_time}
                </div>
                <div className="text-sm text-gray-600">minutes</div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                  <Fuel className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {optimizedData.fuel_saved.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">L saved</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {optimizedData.carbon_reduction.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">kg CO₂ reduced</div>
              </div>
            </div>

            {/* Efficiency Indicators */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Route Efficiency</span>
                <Badge variant="default" className="bg-eco-green-600">
                  Optimized
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fuel Efficiency</span>
                  <span className="text-eco-green-600 font-medium">
                    +{((optimizedData.fuel_saved / 10) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-eco-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((optimizedData.fuel_saved / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Time Savings</span>
                  <span className="text-blue-600 font-medium">
                    +{Math.round((optimizedData.estimated_time / 60) * 10)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((optimizedData.estimated_time / 60) * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route Instructions Preview */}
      {locations.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-eco-green-600" />
              Route Instructions
            </CardTitle>
            <CardDescription>
              Turn-by-turn directions for the optimized route
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {locations.map((location, index) => (
                <div key={location.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getMarkerColor(location.type, location.wasteType)}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{location.address}</div>
                    <div className="text-sm text-gray-500">
                      {location.type === 'start' && 'Start location - Begin route'}
                      {location.type === 'waypoint' && `Collect ${location.wasteType} waste (${location.estimatedVolume}t)`}
                      {location.type === 'end' && 'End location - Complete route'}
                    </div>
                    {location.timeWindow && (
                      <div className="text-xs text-blue-600 mt-1">
                        Preferred time: {location.timeWindow}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RouteMap;
