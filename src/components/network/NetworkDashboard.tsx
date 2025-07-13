
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Network,
  Users,
  MapPin,
  Handshake,
  Factory,
  Recycle,
  Shield,
  TrendingUp,
  BarChart3,
  FileCheck,
  Coins,
  Globe,
  Zap,
  Leaf,
  Award,
  Search,
  Plus,
  Settings,
  Calendar,
  Truck,
  Package,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

const NetworkDashboard = () => {
  const [activeTab, setActiveTab] = useState('communities');

  const supplyChainFeatures = [
    {
      title: "Company Registration Hub",
      description: "Centralized platform for recycling companies to register and connect",
      icon: Building2,
      status: "Active",
      connections: 245
    },
    {
      title: "B2B Material Marketplace",
      description: "Trade sustainable materials and manage waste streams",
      icon: Package,
      status: "Growing",
      connections: 189
    },
    {
      title: "Logistics Coordination",
      description: "Optimize transportation and material flow",
      icon: Truck,
      status: "Optimized",
      connections: 78
    },
    {
      title: "Performance Analytics",
      description: "Track sustainability impact and supply chain metrics",
      icon: BarChart3,
      status: "Insights",
      connections: 156
    }
  ];

  const blockchainFeatures = [
    {
      title: "Blockchain Rewards",
      description: "Earn tokens for sustainable actions and contributions",
      icon: Coins,
      tokens: "2,456 GREEN",
      value: "₹12,280"
    },
    {
      title: "NFT Certificates",
      description: "Trade carbon credits and sustainability certificates",
      icon: Award,
      nfts: 23,
      verified: true
    },
    {
      title: "Smart Contracts",
      description: "Automated supply chain agreements",
      icon: FileCheck,
      contracts: 12,
      active: 8
    },
    {
      title: "Global Community",
      description: "World's largest green community platform",
      icon: Globe,
      members: "1.2M+",
      rank: 45
    }
  ];

  const companyConnections = [
    {
      name: "EcoTech Industries",
      type: "Recycling Processor",
      location: "Mumbai, Maharashtra",
      capacity: "500 tons/month",
      verified: true,
      rating: 4.8
    },
    {
      name: "Green Solutions Ltd",
      type: "Waste Collector",
      location: "Delhi, NCR",
      capacity: "200 tons/month",
      verified: true,
      rating: 4.6
    },
    {
      name: "Sustainable Materials Co",
      type: "Raw Material Supplier",
      location: "Chennai, Tamil Nadu",
      capacity: "1000 tons/month",
      verified: false,
      rating: 4.2
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Connect with Bharat</h1>
        <p className="text-gray-600">Build connections across India's waste management ecosystem</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="ai-legal">AI & Legal</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="communities" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="eco-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-eco-green-600" />
                  Local Communities
                </CardTitle>
                <CardDescription>Connect with waste management communities in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Communities</span>
                    <Badge variant="secondary">156</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Your Connections</span>
                    <Badge className="bg-eco-green-600">23</Badge>
                  </div>
                  <Button className="w-full eco-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="eco-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-eco-green-600" />
                  Local Partners
                </CardTitle>
                <CardDescription>Find recycling partners and suppliers nearby</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Verified Partners</span>
                    <Badge variant="secondary">89</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Within 50km</span>
                    <Badge className="bg-eco-green-600">12</Badge>
                  </div>
                  <Button className="w-full eco-button">
                    <Search className="h-4 w-4 mr-2" />
                    Find Partners
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="eco-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-eco-green-600" />
                  Business Networks
                </CardTitle>
                <CardDescription>Professional sustainability networks and groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Industry Networks</span>
                    <Badge variant="secondary">34</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Your Memberships</span>
                    <Badge className="bg-eco-green-600">7</Badge>
                  </div>
                  <Button className="w-full eco-button">
                    <Network className="h-4 w-4 mr-2" />
                    Join Networks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="supply-chain" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gradient mb-2">Supply Chain Management</h2>
            <p className="text-gray-600">Centralized hub for recycling companies and supply chain operations</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {supplyChainFeatures.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <Card key={index} className="eco-card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FeatureIcon className="h-5 w-5 text-eco-green-600" />
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <Badge variant="outline">{feature.status}</Badge>
                      <span className="text-sm text-gray-600">{feature.connections} connections</span>
                    </div>
                    <Button className="w-full eco-button">Access Feature</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="eco-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4">
                <Button variant="outline">Register Company</Button>
                <Button variant="outline">Create Listing</Button>
                <Button variant="outline">Find Suppliers</Button>
                <Button variant="outline">Track Shipments</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gradient mb-2">Blockchain Community Platform</h2>
            <p className="text-gray-600">World's largest green community with blockchain rewards</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {blockchainFeatures.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <Card key={index} className="eco-card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FeatureIcon className="h-5 w-5 text-eco-green-600" />
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.tokens && (
                        <div className="flex justify-between">
                          <span>Balance:</span>
                          <span className="font-semibold text-eco-green-600">{feature.tokens}</span>
                        </div>
                      )}
                      {feature.value && (
                        <div className="flex justify-between">
                          <span>Value:</span>
                          <span className="font-semibold">{feature.value}</span>
                        </div>
                      )}
                      {feature.nfts && (
                        <div className="flex justify-between">
                          <span>NFTs Owned:</span>
                          <Badge className="bg-eco-green-600">{feature.nfts}</Badge>
                        </div>
                      )}
                      {feature.contracts && (
                        <div className="flex justify-between">
                          <span>Active Contracts:</span>
                          <Badge variant="outline">{feature.active}/{feature.contracts}</Badge>
                        </div>
                      )}
                      {feature.members && (
                        <div className="flex justify-between">
                          <span>Community Size:</span>
                          <span className="font-semibold">{feature.members}</span>
                        </div>
                      )}
                    </div>
                    <Button className="w-full mt-4 eco-button">
                      {feature.tokens ? 'View Wallet' : 
                       feature.nfts ? 'Browse NFTs' : 
                       feature.contracts ? 'Manage Contracts' : 'Join Community'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gradient mb-2">Company Connections</h2>
            <p className="text-gray-600">Connect with verified businesses in the sustainability ecosystem</p>
          </div>

          <div className="grid gap-4">
            {companyConnections.map((company, index) => (
              <Card key={index} className="eco-card">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{company.name}</h3>
                        {company.verified && (
                          <CheckCircle className="h-4 w-4 text-eco-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{company.type}</p>
                      <p className="text-sm text-gray-500 mb-2">{company.location}</p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{company.capacity}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{company.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Message</Button>
                      <Button size="sm" className="eco-button">Connect</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-legal" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gradient mb-2">AI Verification & Legal Compliance</h2>
            <p className="text-gray-600">Automated verification and Indian legal compliance system</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="eco-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-eco-green-600" />
                  Document Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">GST Verified</span>
                    <CheckCircle className="h-4 w-4 text-eco-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">MCA Registered</span>
                    <CheckCircle className="h-4 w-4 text-eco-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pollution License</span>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  </div>
                  <Button className="w-full eco-button">Upload Documents</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="eco-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-eco-green-600" />
                  Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-eco-green-600">92%</div>
                  <p className="text-sm text-gray-600">Compliance Rating</p>
                </div>
                <div className="space-y-2">
                  <Badge className="w-full bg-eco-green-600">Excellent Standing</Badge>
                  <Button variant="outline" className="w-full">View Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="eco-card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-eco-green-600" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Get instant compliance guidance</p>
                <Button className="w-full eco-button">Chat with AI</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gradient mb-2">Sales, Supply & Operations</h2>
            <p className="text-gray-600">Comprehensive operations management dashboard</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="eco-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-eco-green-600" />
                  Sales Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-eco-green-600 mb-2">₹2.4L</div>
                <p className="text-sm text-gray-600 mb-4">This Month</p>
                <Button variant="outline" className="w-full">View Details</Button>
              </CardContent>
            </Card>

            <Card className="eco-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-eco-green-600" />
                  Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-eco-green-600 mb-2">45.6T</div>
                <p className="text-sm text-gray-600 mb-4">Available Stock</p>
                <Button variant="outline" className="w-full">Manage Inventory</Button>
              </CardContent>
            </Card>

            <Card className="eco-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-eco-green-600" />
                  Production
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-eco-green-600 mb-2">89%</div>
                <p className="text-sm text-gray-600 mb-4">Capacity Utilized</p>
                <Button variant="outline" className="w-full">Schedule Production</Button>
              </CardContent>
            </Card>
          </div>

          <Card className="eco-card">
            <CardHeader>
              <CardTitle>Operations Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline">Quality Control</Button>
                <Button variant="outline">Supplier Management</Button>
                <Button variant="outline">Order Fulfillment</Button>
                <Button variant="outline">Performance KPIs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkDashboard;
