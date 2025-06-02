
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Truck, Users, BarChart3, MapPin, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MunicipalityUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Municipality Management Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive waste management tools for municipal authorities to monitor, manage, and optimize city-wide waste operations.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span>Route Optimization</span>
              </CardTitle>
              <CardDescription>
                Optimize collection routes for maximum efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Plan and optimize waste collection routes to reduce fuel costs and improve service delivery.
              </p>
              <Link to="/route-optimization">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Optimize Routes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <span>Citizen Reports</span>
              </CardTitle>
              <CardDescription>
                Monitor and respond to citizen waste reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track and manage citizen-reported waste issues across the municipality.
              </p>
              <Link to="/citizen-reports">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>City Analytics</span>
              </CardTitle>
              <CardDescription>
                Comprehensive waste management analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Monitor city-wide waste generation patterns, collection efficiency, and environmental impact.
              </p>
              <Link to="/analytics">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Contractor Management</span>
              </CardTitle>
              <CardDescription>
                Manage waste collection contractors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track contractor performance, manage contracts, and ensure service quality.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Manage Contractors
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Facility Monitoring</span>
              </CardTitle>
              <CardDescription>
                Monitor waste processing facilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track capacity, performance, and compliance of waste processing facilities.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Facilities
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Budget Planning</span>
              </CardTitle>
              <CardDescription>
                Plan and track waste management budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Monitor spending, forecast costs, and optimize budget allocation for waste management.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Budget
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MunicipalityUsers;
