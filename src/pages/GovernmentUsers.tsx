
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Shield, FileText, BarChart3, Users, MapPin, Scale } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const GovernmentUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Government & Regulatory Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive oversight and regulatory management tools for government agencies and environmental authorities.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>Regulatory Oversight</span>
              </CardTitle>
              <CardDescription>
                Monitor compliance across all sectors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Comprehensive oversight of waste management compliance across industries and municipalities.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                View Compliance
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span>Policy Management</span>
              </CardTitle>
              <CardDescription>
                Create and manage environmental policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Develop, implement, and track the effectiveness of waste management policies and regulations.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Manage Policies
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span>National Analytics</span>
              </CardTitle>
              <CardDescription>
                Comprehensive waste management insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Access national and regional waste management statistics, trends, and environmental impact data.
              </p>
              <Link to="/analytics">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Stakeholder Management</span>
              </CardTitle>
              <CardDescription>
                Coordinate with various stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage relationships with municipalities, industries, and waste management companies.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                View Stakeholders
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                <span>Regional Monitoring</span>
              </CardTitle>
              <CardDescription>
                Monitor waste management by region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track performance metrics and environmental impact across different geographical regions.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Regional View
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="h-5 w-5 text-purple-600" />
                <span>Enforcement Tools</span>
              </CardTitle>
              <CardDescription>
                Manage enforcement and penalties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track violations, issue penalties, and manage enforcement actions for non-compliance.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Enforcement Center
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Special Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Exclusive Government Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-700">Advanced Features Access</CardTitle>
                <CardDescription>
                  Access to comprehensive platform features and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/features">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Access All Features
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-700">Enhanced Dashboard</CardTitle>
                <CardDescription>
                  Special government dashboard with extended capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/enhanced-auth">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Government Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentUsers;
