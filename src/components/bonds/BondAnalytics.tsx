
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, PieChart, DollarSign } from 'lucide-react';

const BondAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Market Performance
            </CardTitle>
            <CardDescription>
              Green bond market trends and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Market Size</span>
                <span className="font-medium">₹800 Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Bonds</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Yield</span>
                <span className="font-medium text-green-600">7.2%</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                The green bond market is showing steady growth with increasing investor interest in sustainable investments.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              Category Distribution
            </CardTitle>
            <CardDescription>
              Investment distribution across green categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Renewable Energy</span>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Water Infrastructure</span>
                </div>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Waste Management</span>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Performance Insights
          </CardTitle>
          <CardDescription>
            Key metrics and trends in the green bond market
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">₹125 Cr</div>
              <div className="text-sm text-gray-600">Total Funds Raised</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">2,450</div>
              <div className="text-sm text-gray-600">Active Investors</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-purple-600">15</div>
              <div className="text-sm text-gray-600">Completed Projects</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BondAnalytics;
