
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recycle, Truck, Users, IndianRupee } from 'lucide-react';

const DashboardStats = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return num.toFixed(2);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Waste Items</CardTitle>
          <Recycle className="h-4 w-4 text-eco-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(24)}</div>
          <p className="text-xs text-muted-foreground">+{formatNumber(2)} from last week</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Pickups</CardTitle>
          <Truck className="h-4 w-4 text-eco-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(3)}</div>
          <p className="text-xs text-muted-foreground">Scheduled this week</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Connections</CardTitle>
          <Users className="h-4 w-4 text-eco-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(12)}</div>
          <p className="text-xs text-muted-foreground">Active processors</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <IndianRupee className="h-4 w-4 text-eco-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(91234.56)}</div>
          <p className="text-xs text-muted-foreground">+{formatNumber(12.34)}% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
