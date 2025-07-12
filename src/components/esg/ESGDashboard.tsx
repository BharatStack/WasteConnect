
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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
  Zap,
  ArrowLeft,
  DollarSign,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Cell, LineChart, Line, AreaChart, Area, Pie } from 'recharts';

interface InvestmentOpportunity {
  id: string;
  name: string;
  company: string;
  esg_score: number;
  rating: string;
  sector: string;
  min_investment: number;
  expected_return: number;
  risk_level: string;
  impact_metrics: {
    co2_reduction: string;
    jobs_created: number;
    energy_generated?: string;
    farmers_supported?: number;
    waste_processed?: string;
    communities_served?: number;
    pollution_reduced?: string;
    students_reached?: string;
    schools_connected?: number;
    rural_access?: string;
  };
  created_at: string;
}

interface UserPortfolio {
  id: string;
  user_id: string;
  total_invested: number;
  current_value: number;
  total_returns: number;
  esg_score: number;
  impact_metrics: {
    total_co2_reduced: number;
    total_jobs_created: number;
    communities_impacted: number;
    clean_energy_generated: number;
  };
}

const ESGDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [loading, setLoading] = useState(true);
  const [investmentOpportunities, setInvestmentOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [userPortfolio, setUserPortfolio] = useState<UserPortfolio | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentOpportunity | null>(null);
  const [showInvestmentDetails, setShowInvestmentDetails] = useState(false);

  // Mock data for charts (will be replaced with real data)
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

  useEffect(() => {
    if (user) {
      fetchInvestmentOpportunities();
      fetchUserPortfolio();
    }
  }, [user]);

  const fetchInvestmentOpportunities = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual Supabase query
      const mockOpportunities: InvestmentOpportunity[] = [
        {
          id: '1',
          name: 'Solar Power Infrastructure',
          company: 'GreenTech Solutions',
          esg_score: 92,
          rating: 'A+',
          sector: 'Renewable Energy',
          min_investment: 50000,
          expected_return: 12.5,
          risk_level: 'Medium',
          impact_metrics: {
            co2_reduction: '2,500 tons/year',
            jobs_created: 150,
            energy_generated: '50 MW'
          },
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Organic Farming Initiative',
          company: 'AgriSustain Ltd',
          esg_score: 88,
          rating: 'A',
          sector: 'Sustainable Agriculture',
          min_investment: 25000,
          expected_return: 10.8,
          risk_level: 'Low',
          impact_metrics: {
            co2_reduction: '800 tons/year',
            jobs_created: 200,
            farmers_supported: 500
          },
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Water Treatment Technology',
          company: 'AquaClean Innovations',
          esg_score: 85,
          rating: 'A-',
          sector: 'Clean Technology',
          min_investment: 75000,
          expected_return: 14.2,
          risk_level: 'Medium-High',
          impact_metrics: {
            co2_reduction: '1,200 tons/year',
            jobs_created: 180,
            waste_processed: '1M liters/day',
            communities_served: 50,
            pollution_reduced: '95%'
          },
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Education Technology Platform',
          company: 'EduImpact Global',
          esg_score: 90,
          rating: 'A+',
          sector: 'Social Impact',
          min_investment: 30000,
          expected_return: 11.5,
          risk_level: 'Low-Medium',
          impact_metrics: {
            co2_reduction: '500 tons/year',
            jobs_created: 120,
            students_reached: '10,000+',
            schools_connected: 250,
            rural_access: '70%'
          },
          created_at: new Date().toISOString()
        }
      ];
      
      setInvestmentOpportunities(mockOpportunities);
    } catch (error) {
      console.error('Error fetching investment opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load investment opportunities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPortfolio = async () => {
    try {
      // Simulate API call - replace with actual Supabase query
      const mockPortfolio: UserPortfolio = {
        id: '1',
        user_id: user?.id || '',
        total_invested: 2500000,
        current_value: 2812500,
        total_returns: 312500,
        esg_score: 89.5,
        impact_metrics: {
          total_co2_reduced: 15250,
          total_jobs_created: 2450,
          communities_impacted: 125,
          clean_energy_generated: 250
        }
      };
      
      setUserPortfolio(mockPortfolio);
    } catch (error) {
      console.error('Error fetching user portfolio:', error);
    }
  };

  const handleInvestNow = async (opportunityId: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make an investment",
          variant: "destructive",
        });
        return;
      }

      // Here you would integrate with your payment gateway
      toast({
        title: "Investment Initiated",
        description: "Redirecting to secure payment gateway...",
      });
      
      // Simulate investment process
      setTimeout(() => {
        toast({
          title: "Investment Successful",
          description: "Your investment has been processed successfully!",
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error processing investment:', error);
      toast({
        title: "Investment Failed",
        description: "There was an error processing your investment",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (opportunity: InvestmentOpportunity) => {
    setSelectedInvestment(opportunity);
    setShowInvestmentDetails(true);
  };

  const handleBackToList = () => {
    setShowInvestmentDetails(false);
    setSelectedInvestment(null);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A+': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-green-100 text-green-700';
      case 'A-': return 'bg-yellow-100 text-yellow-800';
      case 'B+': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
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

  const impactMetrics = userPortfolio ? [
    { label: 'Carbon Footprint Reduced', value: `${userPortfolio.impact_metrics.total_co2_reduced.toLocaleString()} tons CO₂`, icon: Leaf, color: 'text-green-600' },
    { label: 'Jobs Created', value: userPortfolio.impact_metrics.total_jobs_created.toLocaleString(), icon: Users, color: 'text-blue-600' },
    { label: 'Communities Impacted', value: userPortfolio.impact_metrics.communities_impacted.toString(), icon: Building, color: 'text-purple-600' },
    { label: 'Clean Energy Generated', value: `${userPortfolio.impact_metrics.clean_energy_generated} MW`, icon: Zap, color: 'text-yellow-600' },
  ] : [];

  if (showInvestmentDetails && selectedInvestment) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          onClick={handleBackToList}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Investment Opportunities
        </Button>

        {/* Investment Details */}
        <Card className="bg-white/70 backdrop-blur-md">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">{selectedInvestment.name}</CardTitle>
                <CardDescription className="text-lg">{selectedInvestment.company}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getRatingColor(selectedInvestment.rating)}>{selectedInvestment.rating}</Badge>
                <Badge className={getRiskColor(selectedInvestment.risk_level)}>{selectedInvestment.risk_level}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedInvestment.esg_score}/100</div>
                <div className="text-sm text-gray-600">ESG Score</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">₹{selectedInvestment.min_investment.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Min Investment</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{selectedInvestment.expected_return}%</div>
                <div className="text-sm text-gray-600">Expected Return</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{selectedInvestment.sector}</div>
                <div className="text-sm text-gray-600">Sector</div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Impact Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(selectedInvestment.impact_metrics).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                    <Leaf className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">{value}</p>
                      <p className="text-sm text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                className="bg-green-600 hover:bg-green-700 flex-1"
                onClick={() => handleInvestNow(selectedInvestment.id)}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Invest Now
              </Button>
              <Button variant="outline" className="flex-1">
                Download Prospectus
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

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
            <div className="text-2xl font-bold">
              ₹{userPortfolio ? (userPortfolio.current_value / 100000).toFixed(1) : '25.0'}L
            </div>
            <p className="text-xs opacity-90">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ESG Score</CardTitle>
            <Star className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userPortfolio ? userPortfolio.esg_score : '89.5'}
            </div>
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
      {userPortfolio && (
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
      )}

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
                      <Badge className={getRiskColor(opportunity.risk_level)}>{opportunity.risk_level}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{opportunity.company} • {opportunity.sector}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">ESG Score</p>
                        <p className="text-lg font-semibold text-green-600">{opportunity.esg_score}/100</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Min Investment</p>
                        <p className="text-lg font-semibold">₹{opportunity.min_investment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Expected Return</p>
                        <p className="text-lg font-semibold text-blue-600">{opportunity.expected_return}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Impact Score</p>
                        <p className="text-lg font-semibold text-purple-600">High</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      {Object.entries(opportunity.impact_metrics).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleInvestNow(opportunity.id)}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Invest Now
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleViewDetails(opportunity)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
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
