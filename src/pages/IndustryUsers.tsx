
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Factory, Recycle, BarChart3, FileText, Truck, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const IndustryUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              Industry & MSME Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Streamline industrial waste management, ensure compliance, and optimize resource recovery for your business operations.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Factory className="h-5 w-5 text-orange-600" />
                <span>Waste Generation Tracking</span>
              </CardTitle>
              <CardDescription>
                Monitor industrial waste output and composition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track production waste, categorize materials, and identify reduction opportunities.
              </p>
              <Link to="/waste-entry">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Track Waste
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <span>Compliance Reporting</span>
              </CardTitle>
              <CardDescription>
                Generate and submit regulatory compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Automated compliance reporting for environmental regulations and waste management standards.
              </p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Generate Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Recycle className="h-5 w-5 text-orange-600" />
                <span>Resource Recovery</span>
              </CardTitle>
              <CardDescription>
                Identify and monetize recyclable materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Connect with processors and buyers to maximize value from industrial waste streams.
              </p>
              <Link to="/marketplace">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Access Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-orange-600" />
                <span>Logistics Management</span>
              </CardTitle>
              <CardDescription>
                Schedule and track waste collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Coordinate with certified collectors for safe and efficient waste transportation.
              </p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Schedule Collection
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <span>Performance Analytics</span>
              </CardTitle>
              <CardDescription>
                Monitor waste management KPIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track costs, environmental impact, and operational efficiency metrics.
              </p>
              <Link to="/analytics">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-orange-600" />
                <span>Safety Management</span>
              </CardTitle>
              <CardDescription>
                Ensure safe handling of hazardous materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track safety protocols, training records, and incident management for hazardous waste.
              </p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Safety Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IndustryUsers;
