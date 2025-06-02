
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Recycle, Calendar, BarChart3, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const HouseholdUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-white">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-eco-green-600 to-eco-green-400 bg-clip-text text-transparent">
              Household Users Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your household waste efficiently and contribute to a sustainable future with our comprehensive tools.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Recycle className="h-5 w-5 text-eco-green-600" />
                <span>Waste Tracking</span>
              </CardTitle>
              <CardDescription>
                Log and track your household waste generation patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Monitor your daily waste output, categorize materials, and get insights on reduction opportunities.
              </p>
              <Link to="/waste-entry">
                <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                  Start Tracking
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-eco-green-600" />
                <span>Collection Schedule</span>
              </CardTitle>
              <CardDescription>
                View and manage your waste collection calendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Never miss a pickup day. Get reminders and schedule special collections.
              </p>
              <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                View Schedule
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-eco-green-600" />
                <span>Impact Analytics</span>
              </CardTitle>
              <CardDescription>
                See your environmental impact and savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track your carbon footprint reduction and cost savings from proper waste management.
              </p>
              <Link to="/analytics">
                <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-eco-green-600" />
                <span>Marketplace</span>
              </CardTitle>
              <CardDescription>
                Buy and sell recyclable materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Connect with local buyers and sellers for recyclable waste materials.
              </p>
              <Link to="/marketplace">
                <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                  Visit Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-eco-green-600" />
                <span>Citizen Reports</span>
              </CardTitle>
              <CardDescription>
                Report waste-related issues in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Help keep your community clean by reporting illegal dumping or collection issues.
              </p>
              <Link to="/citizen-reports">
                <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                  Report Issue
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Recycle className="h-5 w-5 text-eco-green-600" />
                <span>Sustainability Tips</span>
              </CardTitle>
              <CardDescription>
                Learn eco-friendly practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Discover new ways to reduce, reuse, and recycle in your daily life.
              </p>
              <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HouseholdUsers;
