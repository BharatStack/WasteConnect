
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, Cell } from 'recharts';
import { AlertCircle, ArrowDown, ArrowUp, ClipboardList, Clock, Info, Leaf, Recycle, Trash2 } from 'lucide-react';

const Dashboard = () => {
  // Sample data for charts
  const wasteData = [
    { name: 'Jan', organic: 400, plastic: 240, paper: 200, glass: 120 },
    { name: 'Feb', organic: 300, plastic: 230, paper: 220, glass: 110 },
    { name: 'Mar', organic: 320, plastic: 250, paper: 210, glass: 130 },
    { name: 'Apr', organic: 380, plastic: 260, paper: 230, glass: 140 },
    { name: 'May', organic: 400, plastic: 270, paper: 250, glass: 150 },
    { name: 'Jun', organic: 420, plastic: 280, paper: 260, glass: 160 },
  ];

  const pieData = [
    { name: 'Organic', value: 420, color: '#22c55e' },
    { name: 'Plastic', value: 280, color: '#3b82f6' },
    { name: 'Paper', value: 260, color: '#eab308' },
    { name: 'Glass', value: 160, color: '#8b5cf6' },
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#8b5cf6'];
  
  // Stats cards data
  const statsCards = [
    {
      title: 'Total Waste',
      value: '2,543 kg',
      change: '+12.5%',
      trend: 'up',
      icon: Trash2,
      description: 'from last month'
    },
    {
      title: 'Recycling Rate',
      value: '78%',
      change: '+5.2%',
      trend: 'up',
      icon: Recycle,
      description: 'from last month'
    },
    {
      title: 'Carbon Offset',
      value: '315 kg',
      change: '+18.2%',
      trend: 'up',
      icon: Leaf,
      description: 'from last month'
    },
    {
      title: 'Next Pickup',
      value: '2 days',
      icon: Clock,
      description: 'Monday, 10:00 AM'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-eco-green-50/50 dark:bg-eco-green-900/10 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-eco-green-800 dark:text-eco-green-100">Dashboard</h1>
              <p className="text-eco-green-600 dark:text-eco-green-300">Track and manage your waste data efficiently.</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Button className="bg-eco-green-600 hover:bg-eco-green-700 text-white">
                <ClipboardList className="mr-2 h-4 w-4" />
                Log New Waste
              </Button>
              <Button variant="outline" className="border-eco-green-600 text-eco-green-600 hover:bg-eco-green-50 dark:border-eco-green-500 dark:text-eco-green-400">
                Export Data
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <Card key={index} className="bg-white dark:bg-eco-green-900/20 border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-eco-green-600 dark:text-eco-green-300">{card.title}</CardTitle>
                  <div className={`p-2 rounded-md ${index % 2 === 0 ? 'bg-eco-green-100 dark:bg-eco-green-800/30 text-eco-green-600 dark:text-eco-green-400' : 'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400'}`}>
                    <card.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-eco-green-800 dark:text-white">{card.value}</div>
                  <p className="text-xs text-eco-green-600 dark:text-eco-green-400 mt-1 flex items-center">
                    {card.change && (
                      <>
                        {card.trend === 'up' ? (
                          <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={card.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                          {card.change}
                        </span>
                        <span className="text-eco-green-600 dark:text-eco-green-400 ml-1">{card.description}</span>
                      </>
                    )}
                    {!card.change && card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="bg-eco-green-100 dark:bg-eco-green-800/30">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Detailed Analytics</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2 bg-white dark:bg-eco-green-900/20 border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-eco-green-800 dark:text-eco-green-100">Waste Trend</CardTitle>
                    <CardDescription className="text-eco-green-600 dark:text-eco-green-400">
                      Waste generation by category over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={wasteData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 0,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#ecfdf5" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="organic" stackId="a" fill="#22c55e" />
                          <Bar dataKey="plastic" stackId="a" fill="#3b82f6" />
                          <Bar dataKey="paper" stackId="a" fill="#eab308" />
                          <Bar dataKey="glass" stackId="a" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-eco-green-900/20 border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-eco-green-800 dark:text-eco-green-100">Waste Composition</CardTitle>
                    <CardDescription className="text-eco-green-600 dark:text-eco-green-400">
                      Current month distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="bg-white dark:bg-eco-green-900/20 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-eco-green-800 dark:text-eco-green-100">Detailed Analytics</CardTitle>
                      <CardDescription className="text-eco-green-600 dark:text-eco-green-400">
                        In-depth analysis of your waste management data
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border-eco-green-600 text-eco-green-600">
                      <Info className="h-4 w-4 mr-1" /> Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={wasteData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ecfdf5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="organic" stroke="#22c55e" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="plastic" stroke="#3b82f6" />
                        <Line type="monotone" dataKey="paper" stroke="#eab308" />
                        <Line type="monotone" dataKey="glass" stroke="#8b5cf6" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 bg-eco-green-50 dark:bg-eco-green-800/10 p-4 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-eco-green-600 dark:text-eco-green-400 mr-2" />
                      <p className="text-eco-green-700 dark:text-eco-green-300 text-sm">Please note that this data is based on your logged waste entries. Regular logging improves the accuracy of these insights.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card className="bg-white dark:bg-eco-green-900/20 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-eco-green-800 dark:text-eco-green-100">Waste Insights</CardTitle>
                  <CardDescription className="text-eco-green-600 dark:text-eco-green-400">
                    Recommendations and insights based on your waste data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-eco-green-50 dark:bg-eco-green-800/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-eco-green-700 dark:text-eco-green-200 mb-2">Plastic Reduction Opportunity</h3>
                    <p className="text-eco-green-600 dark:text-eco-green-300 mb-2">
                      Your plastic waste has increased by 15% compared to last month. Consider these reduction strategies:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-eco-green-600 dark:text-eco-green-300">
                      <li>Switch to reusable containers for grocery shopping</li>
                      <li>Use refillable water bottles instead of disposable ones</li>
                      <li>Buy bulk items to reduce packaging waste</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Collection Efficiency</h3>
                    <p className="text-blue-600 dark:text-blue-400">
                      Scheduling your collections on Tuesdays instead of Mondays could reduce your carbon footprint by using optimized routes already in your area.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Marketplace Opportunity</h3>
                    <p className="text-amber-600 dark:text-amber-400">
                      There's a high demand for cardboard in your area. Consider selling your cardboard waste through our marketplace for additional income.
                    </p>
                    <Button className="mt-2 bg-amber-600 hover:bg-amber-700 text-white">
                      View Marketplace
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
