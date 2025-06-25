
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  Leaf, 
  Zap, 
  Droplets, 
  MapPin, 
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

interface InvestmentOpportunitiesProps {
  userType?: string;
}

const InvestmentOpportunities: React.FC<InvestmentOpportunitiesProps> = ({ userType }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching projects data
    setTimeout(() => {
      const mockProjects = [
        {
          id: 1,
          name: 'Solar Waste Processing Plant',
          type: 'waste_to_energy',
          location: 'Mumbai, Maharashtra',
          description: 'Advanced waste-to-energy facility using solar technology for sustainable waste processing.',
          fundingRequired: 25000000,
          fundingReceived: 15000000,
          investorCount: 45,
          environmentalScore: 92,
          co2Reduction: 5000,
          energyGeneration: 2500,
          jobsCreated: 125,
          timeline: '18 months',
          riskLevel: 'Low',
          verification: 'AI Verified',
          status: userType === 'waste_operator' ? 'Active' : 'Open for Investment'
        },
        {
          id: 2,
          name: 'Organic Waste Composting Hub',
          type: 'composting',
          location: 'Bangalore, Karnataka',
          description: 'Large-scale composting facility for organic waste with biogas generation capabilities.',
          fundingRequired: 18000000,
          fundingReceived: 8000000,
          investorCount: 32,
          environmentalScore: 88,
          co2Reduction: 3500,
          energyGeneration: 1200,
          jobsCreated: 85,
          timeline: '12 months',
          riskLevel: 'Medium',
          verification: 'Tier-2 Verified',
          status: userType === 'waste_operator' ? 'Funding' : 'Open for Investment'
        },
        {
          id: 3,
          name: 'Smart Recycling Facility',
          type: 'recycling',
          location: 'Delhi, NCR',
          description: 'AI-powered recycling facility with automated sorting and processing capabilities.',
          fundingRequired: 35000000,
          fundingReceived: 5000000,
          investorCount: 18,
          environmentalScore: 95,
          co2Reduction: 7500,
          energyGeneration: 0,
          jobsCreated: 200,
          timeline: '24 months',
          riskLevel: 'Low',
          verification: 'AI Verified',
          status: userType === 'waste_operator' ? 'Planning' : 'Open for Investment'
        }
      ];
      setProjects(mockProjects);
      setIsLoading(false);
    }, 1000);
  }, [userType]);

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'waste_to_energy': return <Zap className="h-5 w-5 text-yellow-600" />;
      case 'composting': return <Leaf className="h-5 w-5 text-green-600" />;
      case 'recycling': return <Building className="h-5 w-5 text-blue-600" />;
      case 'landfill_management': return <Droplets className="h-5 w-5 text-purple-600" />;
      default: return <Building className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Funding': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Open for Investment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {userType === 'waste_operator' ? 'My Projects' : 'Investment Opportunities'}
          </h2>
          <p className="text-gray-600">
            {userType === 'waste_operator' 
              ? 'Track your waste management projects and their funding status'
              : 'Discover verified waste management projects seeking green bond investments'
            }
          </p>
        </div>
        <Badge variant="secondary" className="px-4 py-2">
          {projects.length} Projects Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getProjectIcon(project.type)}
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge className={getRiskColor(project.riskLevel)}>
                    {project.riskLevel} Risk
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {project.description}
              </p>

              {/* Funding Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Funding Progress</span>
                  <span className="font-medium">
                    {formatCurrency(project.fundingReceived)} / {formatCurrency(project.fundingRequired)}
                  </span>
                </div>
                <Progress 
                  value={(project.fundingReceived / project.fundingRequired) * 100}
                  className="h-2"
                />
                <div className="text-xs text-gray-500">
                  {((project.fundingReceived / project.fundingRequired) * 100).toFixed(1)}% funded by {project.investorCount} investors
                </div>
              </div>

              {/* Environmental Metrics */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-bold text-green-600">{project.environmentalScore}</div>
                  <div className="text-xs text-gray-600">Env Score</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-bold text-blue-600">{project.co2Reduction}</div>
                  <div className="text-xs text-gray-600">CO₂ Reduced</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-bold text-purple-600">{project.jobsCreated}</div>
                  <div className="text-xs text-gray-600">Jobs Created</div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{project.timeline}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-700">{project.verification}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                >
                  View Details
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {userType === 'waste_operator' ? 'Manage Project' : 'Invest Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InvestmentOpportunities;
