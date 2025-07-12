
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Map, 
  TrendingUp, 
  TrendingDown, 
  Building, 
  Users, 
  DollarSign,
  Leaf,
  Factory,
  Globe,
  Star,
  Eye,
  BarChart3,
  MapPin,
  Calendar,
  Award,
  Zap,
  ArrowLeft
} from 'lucide-react';

interface RecyclingCompany {
  id: string;
  name: string;
  symbol: string;
  state: string;
  city: string;
  esg_score: number;
  rating: string;
  stock_price: number;
  change: number;
  change_percent: number;
  market_cap: string;
  waste_processed: string;
  recycling_efficiency: string;
  revenue_growth: string;
  employees: number;
  established_year: number;
  category: string;
  listed: boolean;
}

interface Startup {
  id: string;
  name: string;
  stage: string;
  funding: string;
  location: string;
  focus: string;
  team_size: number;
  impact_metrics: {
    waste_processed: string;
    co2_saved: string;
    partners_connected: number;
  };
  founders: string[];
  established_year: number;
}

const IndiaRecyclingPortal = ({ onBack }: { onBack?: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<RecyclingCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [recyclingCompanies, setRecyclingCompanies] = useState<RecyclingCompany[]>([]);
  const [startupShowcase, setStartupShowcase] = useState<Startup[]>([]);

  const indianStates = [
    'Maharashtra', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh',
    'West Bengal', 'Rajasthan', 'Madhya Pradesh', 'Andhra Pradesh'
  ];

  const industryKPIs = {
    totalWasteProcessed: '125,000 tons/month',
    avgRecyclingEfficiency: '91%',
    totalEmployment: '45,000+',
    marketSize: '₹18,500 Cr',
    growthRate: '32%',
    co2Reduction: '2.5M tons/year'
  };

  useEffect(() => {
    if (user) {
      fetchRecyclingData();
    }
  }, [user]);

  const fetchRecyclingData = async () => {
    try {
      setLoading(true);
      // Simulate API calls - replace with actual backend integration
      const mockCompanies: RecyclingCompany[] = [
        {
          id: '1',
          name: 'Green India Recycling Ltd',
          symbol: 'GRECYC',
          state: 'Maharashtra',
          city: 'Mumbai',
          esg_score: 89,
          rating: 'A+',
          stock_price: 245.50,
          change: 12.30,
          change_percent: 5.26,
          market_cap: '₹1,250 Cr',
          waste_processed: '5,000 tons/month',
          recycling_efficiency: '92%',
          revenue_growth: '28%',
          employees: 850,
          established_year: 2008,
          category: 'E-Waste & Plastic',
          listed: true
        },
        {
          id: '2',
          name: 'EcoWaste Solutions',
          symbol: 'ECOWAS',
          state: 'Karnataka',
          city: 'Bangalore',
          esg_score: 85,
          rating: 'A',
          stock_price: 189.75,
          change: -8.25,
          change_percent: -4.17,
          market_cap: '₹890 Cr',
          waste_processed: '3,500 tons/month',
          recycling_efficiency: '88%',
          revenue_growth: '22%',
          employees: 620,
          established_year: 2012,
          category: 'Organic & Food Waste',
          listed: true
        },
        {
          id: '3',
          name: 'Bharti Recycling Corp',
          symbol: 'BHAREC',
          state: 'Gujarat',
          city: 'Ahmedabad',
          esg_score: 92,
          rating: 'A+',
          stock_price: 312.40,
          change: 18.90,
          change_percent: 6.44,
          market_cap: '₹1,850 Cr',
          waste_processed: '7,200 tons/month',
          recycling_efficiency: '95%',
          revenue_growth: '35%',
          employees: 1200,
          established_year: 2005,
          category: 'Metal & Construction',
          listed: true
        }
      ];

      const mockStartups: Startup[] = [
        {
          id: '1',
          name: 'WasteWise Technologies',
          stage: 'Series A',
          funding: '₹25 Cr',
          location: 'Delhi',
          focus: 'AI-powered waste sorting',
          team_size: 45,
          impact_metrics: {
            waste_processed: '500 tons/month',
            co2_saved: '200 tons/month',
            partners_connected: 150
          },
          founders: ['Priya Sharma', 'Ravi Kumar'],
          established_year: 2019
        },
        {
          id: '2',
          name: 'Circular Economy Hub',
          stage: 'Seed',
          funding: '₹8 Cr',
          location: 'Pune',
          focus: 'Marketplace for recycled materials',
          team_size: 28,
          impact_metrics: {
            waste_processed: '300 tons/month',
            co2_saved: '120 tons/month',
            partners_connected: 80
          },
          founders: ['Amit Patel', 'Sneha Gupta'],
          established_year: 2020
        }
      ];

      setRecyclingCompanies(mockCompanies);
      setStartupShowcase(mockStartups);
    } catch (error) {
      console.error('Error fetching recycling data:', error);
      toast({
        title: "Error",
        description: "Failed to load recycling data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvestment = async (companyId: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make an investment",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Investment Initiated",
        description: "Redirecting to investment portal...",
      });
      
      // Here you would integrate with your investment platform
      
    } catch (error) {
      console.error('Error processing investment:', error);
      toast({
        title: "Investment Failed",
        description: "There was an error processing your investment",
        variant: "destructive",
      });
    }
  };

  const getColorScheme = () => {
    if (darkMode) {
      return {
        bg: 'bg-gray-900',
        cardBg: 'bg-gray-800',
        text: 'text-white',
        accent: 'from-orange-600 to-green-600'
      };
    }
    return {
      bg: 'bg-gradient-to-br from-orange-50 to-green-50',
      cardBg: 'bg-white',
      text: 'text-gray-900',
      accent: 'from-orange-500 to-green-600'
    };
  };

  const colors = getColorScheme();

  const filteredCompanies = recyclingCompanies.filter(company => 
    selectedState === 'all' || company.state === selectedState
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${colors.bg} min-h-screen p-4`}>
      {/* Header with Back Button and Dark Mode Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button 
              onClick={onBack}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <div>
            <h2 className={`text-2xl font-bold ${colors.text} flex items-center gap-2`}>
              <Map className="h-6 w-6 text-orange-600" />
              India Recycling Companies Portal
            </h2>
            <p className="text-gray-600">Investment opportunities in India's growing recycling sector</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${colors.text}`}>Indian Flag Theme</span>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            className="data-[state=checked]:bg-green-600"
          />
        </div>
      </div>

      {/* Interactive India Map Placeholder */}
      <Card className={`${colors.cardBg} border-orange-200`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${colors.text}`}>
            <MapPin className="h-5 w-5 text-orange-600" />
            Recycling Companies Across India
          </CardTitle>
          <CardDescription>Click on states to filter companies by location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            <Button
              variant={selectedState === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedState('all')}
              className="text-xs"
            >
              All States
            </Button>
            {indianStates.slice(0, 9).map(state => (
              <Button
                key={state}
                variant={selectedState === state ? 'default' : 'outline'}
                onClick={() => setSelectedState(state)}
                className="text-xs"
              >
                {state}
              </Button>
            ))}
          </div>
          
          {/* Map visualization placeholder */}
          <div className="h-64 bg-gradient-to-br from-orange-100 to-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-orange-300">
            <div className="text-center">
              <Map className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <p className="text-gray-600">Interactive Map of India</p>
              <p className="text-sm text-gray-500">Showing recycling companies by state</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry KPIs Dashboard */}
      <Card className={`${colors.cardBg} bg-gradient-to-r ${colors.accent} text-white`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Industry KPIs Dashboard
          </CardTitle>
          <CardDescription className="text-white/80">Key performance indicators for India's recycling sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{industryKPIs.totalWasteProcessed}</div>
              <div className="text-sm opacity-90">Waste Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{industryKPIs.avgRecyclingEfficiency}</div>
              <div className="text-sm opacity-90">Avg Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{industryKPIs.totalEmployment}</div>
              <div className="text-sm opacity-90">Employment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{industryKPIs.marketSize}</div>
              <div className="text-sm opacity-90">Market Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{industryKPIs.growthRate}</div>
              <div className="text-sm opacity-90">Growth Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{industryKPIs.co2Reduction}</div>
              <div className="text-sm opacity-90">CO₂ Reduced</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Stock Ticker */}
      <Card className={colors.cardBg}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${colors.text}`}>
            <TrendingUp className="h-5 w-5 text-green-600" />
            Live Stock Ticker - NSE/BSE Listed Recycling Companies
          </CardTitle>
          <CardDescription>Real-time stock prices and market data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCompanies.map(company => (
              <Card key={company.id} className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{company.name}</h3>
                      <Badge className="bg-orange-100 text-orange-800">{company.symbol}</Badge>
                      <Badge className={`${
                        company.rating === 'A+' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        ESG: {company.rating}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Current Price</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">₹{company.stock_price}</span>
                          <span className={`text-sm flex items-center gap-1 ${
                            company.change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {company.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {company.change_percent}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Market Cap</p>
                        <p className="text-lg font-semibold">{company.market_cap}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Waste Processed</p>
                        <p className="text-lg font-semibold text-green-600">{company.waste_processed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Efficiency</p>
                        <p className="text-lg font-semibold text-blue-600">{company.recycling_efficiency}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{company.city}, {company.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Factory className="h-4 w-4 text-gray-400" />
                        <span>{company.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{company.employees} employees</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Est. {company.established_year}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleInvestment(company.id)}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Invest Now
                    </Button>
                    <Button variant="outline">
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

      {/* Startup Showcase */}
      <Card className={colors.cardBg}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${colors.text}`}>
            <Zap className="h-5 w-5 text-purple-600" />
            Startup Showcase - Emerging Recycling Innovators
          </CardTitle>
          <CardDescription>Early-stage companies revolutionizing waste management in India</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {startupShowcase.map(startup => (
              <Card key={startup.id} className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{startup.name}</h3>
                    <p className="text-gray-600">{startup.focus}</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">{startup.stage}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Funding</p>
                    <p className="text-lg font-bold text-green-600">{startup.funding}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Team Size</p>
                    <p className="text-lg font-bold">{startup.team_size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{startup.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Founded</p>
                    <p className="font-medium">{startup.established_year}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Impact Metrics</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center p-2 bg-white rounded">
                      <div className="font-bold text-green-600">{startup.impact_metrics.waste_processed}</div>
                      <div className="text-gray-500">Waste Processed</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="font-bold text-blue-600">{startup.impact_metrics.co2_saved}</div>
                      <div className="text-gray-500">CO₂ Saved</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="font-bold text-purple-600">{startup.impact_metrics.partners_connected}</div>
                      <div className="text-gray-500">Partners</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Founders</h4>
                  <div className="flex gap-2">
                    {startup.founders.map((founder, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {founder}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleInvestment(startup.id)}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Invest
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Comparison Tool */}
      <Card className={colors.cardBg}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${colors.text}`}>
            <BarChart3 className="h-5 w-5 text-teal-600" />
            Company Comparison Tool
          </CardTitle>
          <CardDescription>Compare recycling companies performance and ESG ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Company</th>
                  <th className="text-left p-2">ESG Score</th>
                  <th className="text-left p-2">Stock Price</th>
                  <th className="text-left p-2">Market Cap</th>
                  <th className="text-left p-2">Efficiency</th>
                  <th className="text-left p-2">Revenue Growth</th>
                  <th className="text-left p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {recyclingCompanies.slice(0, 3).map(company => (
                  <tr key={company.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-gray-500 text-xs">{company.symbol}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className="bg-green-100 text-green-800">{company.esg_score}</Badge>
                    </td>
                    <td className="p-2">₹{company.stock_price}</td>
                    <td className="p-2">{company.market_cap}</td>
                    <td className="p-2">{company.recycling_efficiency}</td>
                    <td className="p-2 text-green-600 font-medium">{company.revenue_growth}</td>
                    <td className="p-2">
                      <Button size="sm" variant="outline">Compare</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndiaRecyclingPortal;
