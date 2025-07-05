
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Building, 
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  Target,
  Briefcase,
  Globe,
  Star,
  Upload,
  Download,
  Send,
  Eye,
  Award,
  Handshake
} from 'lucide-react';

const CircularEconomyNetwork = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [pitchDeck, setPitchDeck] = useState(null);

  // Mock data for VC firms
  const vcFirms = [
    {
      id: 1,
      name: 'Green Capital Partners',
      focus: 'Circular Economy & Sustainability',
      minInvestment: '₹5 Cr',
      maxInvestment: '₹50 Cr',
      stage: ['Series A', 'Series B'],
      portfolioSize: 45,
      totalAUM: '₹2,500 Cr',
      successRate: '78%',
      avgTicketSize: '₹15 Cr',
      sectors: ['CleanTech', 'Waste Management', 'Renewable Energy'],
      portfolioCompanies: ['EcoWaste Ltd', 'GreenTech Solutions', 'Circular Materials'],
      contactPerson: 'Ravi Sharma',
      email: 'ravi@greencapital.com',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Sustainable Ventures Fund',
      focus: 'ESG & Impact Investing',
      minInvestment: '₹2 Cr',
      maxInvestment: '₹25 Cr',
      stage: ['Seed', 'Series A'],
      portfolioSize: 32,
      totalAUM: '₹1,200 Cr',
      successRate: '82%',
      avgTicketSize: '₹8 Cr',
      sectors: ['Social Impact', 'AgriTech', 'Water Technology'],
      portfolioCompanies: ['AquaClean', 'FarmCircle', 'EduImpact'],
      contactPerson: 'Priya Patel',
      email: 'priya@sustainableventures.com',
      rating: 4.9
    }
  ];

  // Mock data for funding pipeline
  const fundingPipeline = [
    {
      id: 1,
      startupName: 'WasteWise Tech',
      stage: 'Due Diligence',
      progress: 75,
      amountSought: '₹20 Cr',
      leadInvestor: 'Green Capital Partners',
      timeline: '2 weeks remaining',
      sector: 'Waste Management'
    },
    {
      id: 2,
      startupName: 'Circular Materials Inc',
      stage: 'Term Sheet',
      progress: 90,
      amountSought: '₹35 Cr',
      leadInvestor: 'Sustainable Ventures Fund',
      timeline: '1 week remaining',
      sector: 'Materials Technology'
    }
  ];

  // Mock data for investment opportunities
  const investmentOpportunities = [
    {
      id: 1,
      title: 'AI-Powered Waste Sorting Platform',
      company: 'SortSmart Technologies',
      sector: 'CleanTech',
      stage: 'Series A',
      amountSought: '₹15 Cr',
      valuation: '₹75 Cr',
      traction: {
        revenue: '₹2.5 Cr ARR',
        growth: '180% YoY',
        customers: '150+ enterprises'
      },
      team: ['IIT/IIM Alumni', '15+ years experience'],
      highlights: ['Patent-pending technology', 'Government contracts', 'Break-even next quarter'],
      compatibilityScore: 92
    },
    {
      id: 2,
      title: 'Biodegradable Packaging Solutions',
      company: 'EcoPack Innovations',
      sector: 'Sustainable Materials',
      stage: 'Seed',
      amountSought: '₹8 Cr',
      valuation: '₹32 Cr',
      traction: {
        revenue: '₹80 L ARR',
        growth: '220% YoY',
        customers: '50+ brands'
      },
      team: ['Stanford PhD', 'McKinsey Alumni'],
      highlights: ['FDA approved', 'Major retailer partnerships', 'Carbon negative impact'],
      compatibilityScore: 87
    }
  ];

  const portfolioTracking = [
    {
      id: 1,
      company: 'GreenTech Solutions',
      investmentAmount: '₹12 Cr',
      currentValuation: '₹48 Cr',
      multiple: '4.0x',
      status: 'Growing',
      milestones: [
        { title: 'Product Launch', completed: true, date: '2022-03-15' },
        { title: 'Break-even', completed: true, date: '2023-06-20' },
        { title: 'Series B Funding', completed: false, targetDate: '2024-09-30' }
      ],
      metrics: {
        revenue: '₹25 Cr',
        growth: '150%',
        employees: 125
      }
    }
  ];

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Seed': return 'bg-blue-100 text-blue-800';
      case 'Series A': return 'bg-green-100 text-green-800';
      case 'Series B': return 'bg-purple-100 text-purple-800';
      case 'Due Diligence': return 'bg-yellow-100 text-yellow-800';
      case 'Term Sheet': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'directory', label: 'VC Directory', icon: Building },
          { id: 'opportunities', label: 'Investment Opportunities', icon: Target },
          { id: 'pipeline', label: 'Funding Pipeline', icon: TrendingUp },
          { id: 'networking', label: 'Networking', icon: Users },
          { id: 'portfolio', label: 'Portfolio Tracking', icon: Briefcase },
          { id: 'documents', label: 'Documents', icon: FileText }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* VC Firm Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                Venture Capital Firm Directory
              </CardTitle>
              <CardDescription>Connect with VCs focused on circular economy and sustainability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vcFirms.map(firm => (
                  <Card key={firm.id} className="p-6 border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">{firm.name}</h3>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{firm.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{firm.focus}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Investment Range</p>
                            <p className="font-semibold">{firm.minInvestment} - {firm.maxInvestment}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total AUM</p>
                            <p className="font-semibold text-green-600">{firm.totalAUM}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Portfolio Size</p>
                            <p className="font-semibold">{firm.portfolioSize} companies</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Success Rate</p>
                            <p className="font-semibold text-blue-600">{firm.successRate}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-2">Investment Stages</p>
                          <div className="flex gap-2">
                            {firm.stage.map(stage => (
                              <Badge key={stage} className={getStageColor(stage)}>{stage}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-2">Focus Sectors</p>
                          <div className="flex flex-wrap gap-2">
                            {firm.sectors.map(sector => (
                              <Badge key={sector} variant="outline">{sector}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-2">Notable Portfolio Companies</p>
                          <p className="text-sm text-gray-700">{firm.portfolioCompanies.join(', ')}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                          <p className="text-sm text-gray-600 mb-1">{firm.contactPerson}</p>
                          <p className="text-sm text-blue-600">{firm.email}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Button className="w-full bg-purple-600 hover:bg-purple-700">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Star className="h-4 w-4 mr-2" />
                            Save Firm
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Investment Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Investment Opportunities
              </CardTitle>
              <CardDescription>Discover high-potential startups seeking funding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {investmentOpportunities.map(opportunity => (
                  <Card key={opportunity.id} className="p-6 border-l-4 border-l-green-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{opportunity.title}</h3>
                        <p className="text-gray-600">{opportunity.company}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800 mb-2">
                          {opportunity.compatibilityScore}% Match
                        </Badge>
                        <Badge className={getStageColor(opportunity.stage)}>
                          {opportunity.stage}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Funding Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Amount Sought:</span>
                            <span className="font-medium">{opportunity.amountSought}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Valuation:</span>
                            <span className="font-medium">{opportunity.valuation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Sector:</span>
                            <span className="font-medium">{opportunity.sector}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Traction</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Revenue:</span>
                            <span className="font-medium text-green-600">{opportunity.traction.revenue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Growth:</span>
                            <span className="font-medium text-blue-600">{opportunity.traction.growth}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Customers:</span>
                            <span className="font-medium">{opportunity.traction.customers}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Key Highlights</h4>
                        <ul className="space-y-1 text-sm">
                          {opportunity.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Express Interest
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Request Pitch Deck
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Founder
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Funding Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Funding Pipeline Visualization
              </CardTitle>
              <CardDescription>Track investment opportunities through various stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {fundingPipeline.map(deal => (
                  <Card key={deal.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{deal.startupName}</h3>
                        <p className="text-gray-600">{deal.sector}</p>
                      </div>
                      <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Amount Sought</p>
                        <p className="text-lg font-semibold text-green-600">{deal.amountSought}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lead Investor</p>
                        <p className="font-medium">{deal.leadInvestor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Timeline</p>
                        <p className="font-medium text-orange-600">{deal.timeline}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-500">{deal.progress}%</span>
                      </div>
                      <Progress value={deal.progress} className="h-2" />
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Update Status
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Document Management */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Document Management System
              </CardTitle>
              <CardDescription>Upload, review, and manage investment documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Upload Pitch Deck</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop your files here</p>
                    <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Document Templates</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Term Sheet Template</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Due Diligence Checklist</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Investment Agreement</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Portfolio Tracking */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Portfolio Company Performance
              </CardTitle>
              <CardDescription>Monitor your portfolio companies and track milestones</CardDescription>
            </CardHeader>
            <CardContent>
              {portfolioTracking.map(company => (
                <Card key={company.id} className="p-6 mb-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{company.company}</h3>
                      <p className="text-gray-600">Investment: {company.investmentAmount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{company.multiple}</p>
                      <p className="text-sm text-gray-500">Current Multiple</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Current Valuation:</span>
                          <span className="font-medium">{company.currentValuation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Revenue:</span>
                          <span className="font-medium">{company.metrics.revenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Growth Rate:</span>
                          <span className="font-medium text-green-600">{company.metrics.growth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Employees:</span>
                          <span className="font-medium">{company.metrics.employees}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-3">Milestone Tracking</h4>
                      <div className="space-y-3">
                        {company.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center gap-3">
                            {milestone.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-orange-500" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{milestone.title}</p>
                              <p className="text-sm text-gray-500">
                                {milestone.completed ? 
                                  `Completed: ${milestone.date}` : 
                                  `Target: ${milestone.targetDate}`
                                }
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Eye className="h-4 w-4 mr-1" />
                      View Report
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Request Update
                    </Button>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Networking Interface */}
      {activeTab === 'networking' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Professional Networking
              </CardTitle>
              <CardDescription>Connect with investors, founders, and industry experts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-4 lg:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-4">Messages</h3>
                  <div className="space-y-4 h-64 overflow-y-auto">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        RS
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Ravi Sharma</p>
                        <p className="text-sm text-gray-600">Thanks for your interest in our Series A round. Would you like to schedule a call?</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        PP
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Priya Patel</p>
                        <p className="text-sm text-gray-600">Your portfolio looks impressive. Let's discuss potential synergies.</p>
                        <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Input placeholder="Type your message..." className="flex-1" />
                    <Button>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Connection Suggestions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        AK
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Amit Kumar</p>
                        <p className="text-sm text-gray-600">Partner at TechVentures</p>
                        <Button size="sm" className="mt-2 w-full">
                          <Handshake className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium">
                        SG
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Sneha Gupta</p>
                        <p className="text-sm text-gray-600">Founder at EcoStartup</p>
                        <Button size="sm" className="mt-2 w-full">
                          <Handshake className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CircularEconomyNetwork;
