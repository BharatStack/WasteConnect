
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, Search, Filter, Download, Copy, Star, MapPin, Clock, Fuel } from 'lucide-react';

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
  waypoints_count?: number;
  is_template?: boolean;
}

interface RouteHistoryProps {
  routes: RouteOptimization[];
  isLoading: boolean;
  onDuplicateRoute?: (route: RouteOptimization) => void;
  onSaveAsTemplate?: (route: RouteOptimization) => void;
}

const RouteHistory: React.FC<RouteHistoryProps> = ({ 
  routes, 
  isLoading, 
  onDuplicateRoute,
  onSaveAsTemplate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

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

  const filteredRoutes = routes
    .filter(route => {
      const matchesSearch = route.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           route.start_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           route.end_location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.route_name.localeCompare(b.route_name);
        case 'distance':
          return (b.estimated_distance || 0) - (a.estimated_distance || 0);
        case 'fuel_saved':
          return (b.fuel_saved || 0) - (a.fuel_saved || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const exportRouteData = (route: RouteOptimization) => {
    const csvContent = `Route Name,Start Location,End Location,Distance (km),Time (min),Fuel Saved (L),CO2 Reduced (kg),Status,Created Date
${route.route_name},${route.start_location},${route.end_location},${route.estimated_distance || 'N/A'},${route.estimated_time || 'N/A'},${route.fuel_saved || 'N/A'},${route.carbon_reduction || 'N/A'},${route.status},${new Date(route.created_at).toLocaleDateString()}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${route.route_name.replace(/\s+/g, '_')}_route_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-eco-green-600" />
          Route History & Templates
        </CardTitle>
        <CardDescription>
          Manage your optimized routes, save templates, and track performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Latest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="fuel_saved">Fuel Saved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Routes List */}
        {filteredRoutes.length === 0 ? (
          <div className="text-center py-8">
            <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No matching routes' : 'No routes yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first optimized route to start building your history'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <Card key={route.id} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg">{route.route_name}</h3>
                        {route.is_template && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            <Star className="h-3 w-3 mr-1" />
                            Template
                          </Badge>
                        )}
                        <Badge className={getStatusColor(route.status)}>
                          {route.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{route.start_location} → {route.end_location}</span>
                        {route.waypoints_count && (
                          <span className="text-eco-green-600">
                            ({route.waypoints_count} stops)
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {route.estimated_distance && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-eco-green-600" />
                            <span>{route.estimated_distance.toFixed(1)} km</span>
                          </div>
                        )}
                        {route.estimated_time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>{route.estimated_time} min</span>
                          </div>
                        )}
                        {route.fuel_saved && (
                          <div className="flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-orange-600" />
                            <span>{route.fuel_saved.toFixed(1)}L saved</span>
                          </div>
                        )}
                        {route.carbon_reduction && (
                          <div className="flex items-center gap-2">
                            <span className="text-eco-green-600">🌱</span>
                            <span>{route.carbon_reduction.toFixed(1)} kg CO₂</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        Created: {new Date(route.created_at).toLocaleDateString()} at {new Date(route.created_at).toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDuplicateRoute?.(route)}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Duplicate
                      </Button>
                      
                      {!route.is_template && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSaveAsTemplate?.(route)}
                          className="transition-all duration-200 hover:scale-105"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Save Template
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportRouteData(route)}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {/* Performance Indicators */}
                  {(route.fuel_saved || route.carbon_reduction) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Performance Impact</span>
                        <div className="flex gap-4">
                          {route.fuel_saved && (
                            <span className="text-orange-600 font-medium">
                              {((route.fuel_saved / 10) * 100).toFixed(0)}% fuel efficiency
                            </span>
                          )}
                          {route.carbon_reduction && (
                            <span className="text-eco-green-600 font-medium">
                              {route.carbon_reduction.toFixed(1)}kg CO₂ offset
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteHistory;
