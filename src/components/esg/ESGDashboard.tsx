
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Leaf, 
  Building, 
  Users, 
  Target, 
  Search,
  Filter,
  Star,
  BarChart3,
  PieChart,
  Globe,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const ESGDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');

  // Mock data for ESG performance
  const esgPerformanceData = [
    { month: 'Jan', Environmental: 85, Social: 78, Governance: 82 },
    { month: 'Feb', Environmental: 87, Social: 80, Governance: 84 },
    { month: 'Mar', Environmental: 90, Social: 82, Governance: 86 },
    { month: 'Apr', Environmental: 88, Social: 85, Governance: 88 },
    { month: 'May', Environmental: 92, Social: 87, Governance: 90 },
    { month: 'Jun', Environmental: 94, Social: 89, Governance: 92 },
  ];

  const portfolioAllocation = [
    { name: 'Renewable Energy', value: 35, color: '#10b981' },
    { name: 'Sustainable Agriculture', value: 25, color: '#059669' },
    { name: 'Clean Technology', value: 20, color: '#047857' },
    { name: 'Social Impact', value: 15, color: '#065f46' },
    { name: 'Green Bonds', value: 5, color: '#064e3b' },
  ];

  const investmentOpportunities = [
    {
      id: 1,
      name: 'Solar Power Infrastructure',
      company: 'GreenTech Solutions',
      esgScore: 92,
      rating: 'A+',
      sector: 'Renewable Energy',
      minInvestment: 50000,
      expectedReturn: 12.5,
      riskLevel: 'Medium',
      impactMetrics: {
        co2Reduction: '2,500 tons/year',
        jobsCreated: 150,
        energyGenerated: '50 MW'
      }
    },
    {
      id: 2,
      name: 'Organic Farming Initiative',
      company: 'AgriSustain Ltd',
      esgScore: 88,
      rating: 'A',
      sector: 'Sustainable Agriculture',
      minInvestment: 25000,
      expectedReturn: 10.8,
      riskLevel: 'Low',
      impactMetrics: {
        co2Reduction: '800 tons/year',
        jobsCreated: 200,
        farmersSupported: 500
      }
    },
    {
      id: 3,
      name: 'Water Treatment Technology',
      company: 'AquaClean Innovations',
      esgScore: 85,
      rating: 'A-',
      sector: 'Clean Technology',
      minInvestment: 75000,
      expectedReturn: 14.2,
      riskLevel: 'Medium-High',
      impactMetrics: {
        waterTreated: '1M liters/day',
        communitiesServed: 50,
        pollutionReduced: '95%'
      }
    },
    {
      id: 4,
      name: 'Education Technology Platform',
      company: 'EduImpact Global',
      esgScore: 90,
      rating: 'A+',
      sector: 'Social Impact',
      minInvestment: 30000,
      expectedReturn: 11.5,
      riskLevel: 'Low-Medium',
      impactMetrics: {
        studentsReached: '10,000+',
        schoolsConnected: 250,
        ruralAccess: '70%'
      }
    }
  ];

  const impactMetrics = [
    { label: 'Carbon Footprint Reduced', value: '15,250 tons CO₂', icon: Leaf, color: 'text-green-600' },
    { label: 'Jobs Created', value: '2,450', icon: Users, color: 'text-blue-600' },
    { label: 'Communities Impacted', value: '125', icon: Building, color: 'text-purple-600' },
    { label: 'Clean Energy Generated', value: '250 MW', icon: Zap, color: 'text-yellow-600' },
  ];

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'A+': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-green-100 text-green-700';
      case 'A-': return 'bg-yellow-100 text-yellow-800';
      case 'B+': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Low-Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Medium-High': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOpportunities = investmentOpportunities.filter(opportunity => {
    const matchesSearch = opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || opportunity.sector === selectedSector;
    const matchesRating = selectedRating === 'all' || opportunity.rating === selectedRating;
    
    return matchesSearch && matchesSector && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,50,00,000</div>
            <p className="text-xs opacity-90">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ESG Score</CardTitle>
            <Star className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.5</div>
            <p className="text-xs opacity-90">A+ Rating</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Return</CardTitle>
            <BarChart3 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8%</div>
            <p className="text-xs opacity-90">Above market average</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <Target className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2</div>
            <p className="text-xs opacity-90">High positive impact</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              ESG Performance Trends
            </CardTitle>
            <CardDescription>Monthly ESG scores across Environmental, Social, and Governance factors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={esgPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Environmental" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="Social" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Governance" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-teal-600" />
              Portfolio Allocation
            </CardTitle>
            <CardDescription>ESG investment distribution by sector</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={portfolioAllocation}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {portfolioAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Impact Metrics */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Environmental & Social Impact
          </CardTitle>
          <CardDescription>Measuring the positive impact of your ESG investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Opportunities */}
      <Card className="bg-white/70 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Investment Opportunities
          </CardTitle>
          <CardDescription>Discover high-impact ESG investment opportunities</CardDescription>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search investments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                <SelectItem value="Sustainable Agriculture">Sustainable Agriculture</SelectItem>
                <SelectItem value="Clean Technology">Clean Technology</SelectItem>
                <SelectItem value="Social Impact">Social Impact</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{opportunity.name}</h3>
                      <Badge className={getRatingColor(opportunity.rating)}>{opportunity.rating}</Badge>
                      <Badge className={getRiskColor(opportunity.riskLevel)}>{opportunity.riskLevel}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{opportunity.company} • {opportunity.sector}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">ESG Score</p>
                        <p className="text-lg font-semibold text-green-600">{opportunity.esgScore}/100</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Min Investment</p>
                        <p className="text-lg font-semibold">₹{opportunity.minInvestment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Expected Return</p>
                        <p className="text-lg font-semibold text-blue-600">{opportunity.expectedReturn}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Impact Score</p>
                        <p className="text-lg font-semibold text-purple-600">High</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      {Object.entries(opportunity.impactMetrics).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Invest Now
                    </Button>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ESGDashboard;
