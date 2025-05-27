
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, FileText, MessageSquare } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your waste data and environmental impact</p>
          </div>

          <DashboardStats />

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trash2 className="h-5 w-5 text-eco-green-600" />
                    Waste Entry
                  </CardTitle>
                  <CardDescription>
                    Record new waste data and calculate environmental impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/waste-entry">
                    <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                      Add Waste Data
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="h-5 w-5 text-eco-green-600" />
                    Citizen Reports
                  </CardTitle>
                  <CardDescription>
                    Report environmental issues and track municipality responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/citizen-reports">
                    <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700">
                      View Reports
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-eco-green-600" />
                    Analytics
                  </CardTitle>
                  <CardDescription>
                    View detailed reports and environmental impact metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
