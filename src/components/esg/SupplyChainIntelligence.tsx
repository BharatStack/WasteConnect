
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Network, 
  MapPin, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Eye,
  MessageSquare,
  FileText,
  Users,
  Globe,
  Truck,
  Factory,
  Leaf,
  Shield,
  Zap
} from 'lucide-react';

const SupplyChainIntelligence = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');

  const suppliers = [
    {
      id: 1,
      name: 'Green Manufacturing Corp',
      tier: 1,
      location: 'Shanghai, China',
      esgScore: 85,
      riskLevel: 'low',
      category: 'Electronics',
      certifications: ['ISO 14001', 'SA 8000'],
      carbonFootprint: 2.3,
      waterUsage: 1.2,
      wasteReduction: 78,
      lastAssessment: '2024-01-15',
      trend: 'up'
    },
    {
      id: 2,
      name: 'Sustainable Materials Ltd',
      tier: 2,
      location: 'Mumbai, India',
      esgScore: 67,
      riskLevel: 'medium',
      category: 'Raw Materials',
      certifications: ['FSC', 'OEKO-TEX'],
      carbonFootprint: 4.1,
      waterUsage: 2.8,
      wasteReduction: 45,
      lastAssessment: '2024-01-10',
      trend: 'down'
    },
    {
      id: 3,
      name: 'EcoLogistics Solutions',
      tier: 1,
      location: 'Hamburg, Germany',
      esgScore: 92,
      riskLevel: 'low',
      category: 'Logistics',
      certifications: ['ISO 14001', 'SmartWay'],
      carbonFootprint: 1.8,
      waterUsage: 0.5,
      wasteReduction: 89,
      lastAssessment: '2024-01-18',
      trend: 'up'
    },
    {
      id: 4,
      name: 'Traditional Textiles Co',
      tier: 3,
      location: 'Dhaka, Bangladesh',
      esgScore: 42,
      riskLevel: 'high',
      category: 'Textiles',
      certifications: [],
      carbonFootprint: 6.7,
      waterUsage: 4.2,
      wasteReduction: 23,
      lastAssessment: '2024-01-05',
      trend: 'down'
    }
  ];

  const riskAlerts = [
    {
      id: 1,
      severity: 'high',
      supplier: 'Traditional Textiles Co',
      message: 'Child labor allegations reported by NGO',
      impact: 'Reputational risk, potential contract termination',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      severity: 'medium',
      supplier: 'Sustainable Materials Ltd',
      message: 'Carbon emissions increased by 15% this quarter',
      impact: 'Climate targets at risk, additional offset costs',
      timestamp: '1 day ago'
    },
    {
      id: 3,
      severity: 'low',
      supplier: 'Green Manufacturing Corp',
      message: 'New environmental certification achieved',
      impact: 'Positive ESG score improvement',
      timestamp: '3 days ago'
    }
  ];

  const alternativeSuppliers = [
    {
      name: 'Ethical Textiles International',
      location: 'Fair Trade Certified',
      esgScore: 88,
      estimatedCost: '+12%',
      timeline: '6 months',
      strengths: ['Fair labor practices', 'Organic materials', 'Water conservation']
    },
    {
      name: 'CleanTech Manufacturing',
      location: 'Vietnam',
      esgScore: 79,
      estimatedCost: '+8%',
      timeline: '4 months',
      strengths: ['Renewable energy', 'Waste reduction', 'Local sourcing']
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || supplier.tier.toString() === filterTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Supply Chain Intelligence</h2>
          <p className="text-gray-600 mt-1">Comprehensive ESG tracking across your entire supply network</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="risks">Risk Monitoring</TabsTrigger>
          <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Supply Chain Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">247</span>
                  <Network className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 mt-2">Across 23 countries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Average ESG Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">73</span>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-sm text-green-600 mt-2">+5% from last quarter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">High Risk Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">12</span>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-sm text-red-600 mt-2">Immediate attention needed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">89%</span>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-sm text-green-600 mt-2">Above industry average</p>
              </CardContent>
            </Card>
          </div>

          {/* Supply Chain Map Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Global Supply Chain Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive supply chain map would be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">Showing supplier locations, tier levels, and risk indicators</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Tiers</option>
              <option value="1">Tier 1</option>
              <option value="2">Tier 2</option>
              <option value="3">Tier 3</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Suppliers List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <Badge variant="outline">Tier {supplier.tier}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {supplier.location}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">ESG Score</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{supplier.esgScore}</span>
                      {supplier.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={supplier.esgScore} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Risk Level</span>
                    <Badge className={getRiskColor(supplier.riskLevel)}>
                      {supplier.riskLevel}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Carbon Footprint</span>
                      <span>{supplier.carbonFootprint}t CO2e</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Water Usage</span>
                      <span>{supplier.waterUsage}M liters</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Waste Reduction</span>
                      <span>{supplier.wasteReduction}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Last assessment: {new Date(supplier.lastAssessment).toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-1">
                      {supplier.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{alert.supplier}</Badge>
                            <Badge className={getRiskColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="font-medium text-sm mb-1">{alert.message}</p>
                          <p className="text-xs text-gray-600 mb-2">{alert.impact}</p>
                          <p className="text-xs text-gray-500">{alert.timestamp}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Investigate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Propagation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Risk Propagation Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">High Impact Scenario</h4>
                    <p className="text-sm text-red-700 mb-3">
                      Traditional Textiles Co disruption could affect 3 downstream suppliers
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Production delay: 2-3 weeks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Revenue impact: $2.3M</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Reputational damage: High</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Medium Impact Scenario</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Sustainable Materials Ltd carbon increase affects climate targets
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Additional offset costs: $450K</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Target achievement: At risk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alternatives" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Alternative Supplier Recommendations
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                AI-powered suggestions for replacing high-risk suppliers
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Replace: Traditional Textiles Co</h4>
                  <p className="text-sm text-red-700 mb-4">High social and environmental risks identified</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alternativeSuppliers.map((alt, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border">
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-medium">{alt.name}</h5>
                          <Badge variant="default">ESG: {alt.esgScore}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{alt.location}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Cost Impact:</span>
                            <span className="font-medium">{alt.estimatedCost}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Transition Time:</span>
                            <span className="font-medium">{alt.timeline}</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Key Strengths:</p>
                          <div className="flex flex-wrap gap-1">
                            {alt.strengths.map((strength, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Button size="sm">
                            Initiate Contact
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Supplier Improvement Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Carbon Reduction Initiative</h4>
                    <p className="text-sm text-green-700 mb-3">15 suppliers participating</p>
                    <Progress value={67} className="h-2 mb-2" />
                    <p className="text-xs text-green-600">67% progress toward 25% reduction target</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Water Efficiency Program</h4>
                    <p className="text-sm text-blue-700 mb-3">8 suppliers participating</p>
                    <Progress value={43} className="h-2 mb-2" />
                    <p className="text-xs text-blue-600">43% progress toward efficiency targets</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">GM</span>
                      </div>
                      <span className="text-sm font-medium">Green Manufacturing Corp</span>
                    </div>
                    <p className="text-sm text-gray-700">New ISO 14001 certification achieved</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">SM</span>
                      </div>
                      <span className="text-sm font-medium">Sustainable Materials Ltd</span>
                    </div>
                    <p className="text-sm text-gray-700">Quarterly ESG report submitted</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplyChainIntelligence;
