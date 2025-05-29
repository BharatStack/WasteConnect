
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MapPin, DollarSign, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GovernmentProgram {
  id: string;
  name: string;
  description: string;
  department: string;
  subsidyAmount: string;
  eligibility: string[];
  applicationUrl: string;
  deadline: string;
  status: 'Active' | 'Upcoming' | 'Closed';
  beneficiaries: number;
  wasteTypes: string[];
}

interface GovernmentProgramsProps {
  location: string;
  wasteType: string;
}

const GovernmentPrograms = ({ location, wasteType }: GovernmentProgramsProps) => {
  const [programs, setPrograms] = useState<GovernmentProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGovernmentPrograms();
  }, [location, wasteType]);

  const fetchGovernmentPrograms = async () => {
    setLoading(true);
    try {
      // Mock data - in production, this would fetch from government APIs
      const mockPrograms: GovernmentProgram[] = [
        {
          id: '1',
          name: 'Crop Residue Management Scheme',
          description: 'Financial assistance for farmers to purchase crop residue management machinery',
          department: 'Ministry of Agriculture & Farmers Welfare',
          subsidyAmount: '50% of machinery cost (up to ₹1.5 lakh)',
          eligibility: [
            'Individual farmers',
            'Farmer Producer Organizations (FPOs)',
            'Cooperative societies',
            'Minimum 2.5 acres farmland'
          ],
          applicationUrl: 'https://agrimachinery.nic.in/',
          deadline: '2024-03-31',
          status: 'Active',
          beneficiaries: 125000,
          wasteTypes: ['organic', 'crop_residue', 'rice_straw']
        },
        {
          id: '2',
          name: 'Biogas Plant Installation Subsidy',
          description: 'Support for setting up biogas plants for agricultural waste conversion',
          department: 'Ministry of New and Renewable Energy',
          subsidyAmount: '₹25,000 - ₹75,000 per plant',
          eligibility: [
            'Rural households',
            'Dairy farmers',
            'Poultry farmers',
            'Minimum 500 kg daily waste generation'
          ],
          applicationUrl: 'https://mnre.gov.in/biogas/',
          deadline: '2024-06-30',
          status: 'Active',
          beneficiaries: 45000,
          wasteTypes: ['organic', 'animal_waste', 'food_waste']
        },
        {
          id: '3',
          name: 'Waste to Wealth Mission',
          description: 'Technology support for converting agricultural waste into valuable products',
          department: 'Department of Science & Technology',
          subsidyAmount: 'Up to ₹50 lakh for technology adoption',
          eligibility: [
            'Start-ups',
            'SMEs',
            'Research institutions',
            'Farmer collectives'
          ],
          applicationUrl: 'https://dst.gov.in/waste-wealth',
          deadline: '2024-12-31',
          status: 'Active',
          beneficiaries: 12000,
          wasteTypes: ['all_types']
        }
      ];

      // Filter programs based on waste type
      const relevantPrograms = mockPrograms.filter(program => 
        program.wasteTypes.includes(wasteType) || program.wasteTypes.includes('all_types')
      );

      setPrograms(relevantPrograms);
    } catch (error) {
      console.error('Error fetching government programs:', error);
      toast({
        title: "Error",
        description: "Failed to load government programs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openApplicationPortal = (url: string, programName: string) => {
    window.open(url, '_blank');
    toast({
      title: "Redirecting to Government Portal",
      description: `Opening application for ${programName}`,
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          Government Programs & Subsidies
        </h3>
        <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
          <MapPin className="h-4 w-4" />
          Available in {location}
        </p>
      </div>

      <div className="space-y-4">
        {programs.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-blue-600">
                    {program.department}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(program.status)}>
                  {program.status}
                </Badge>
              </div>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Subsidy</p>
                    <p className="text-gray-600">{program.subsidyAmount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Deadline</p>
                    <p className="text-gray-600">{program.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="font-medium">Beneficiaries</p>
                    <p className="text-gray-600">{program.beneficiaries.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-sm mb-2">Eligibility Criteria:</h5>
                <ul className="text-xs space-y-1 text-gray-600">
                  {program.eligibility.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-eco-green-600">•</span>
                      {criteria}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => openApplicationPortal(program.applicationUrl, program.name)}
                className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                disabled={program.status === 'Closed'}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {program.status === 'Closed' ? 'Applications Closed' : 'Apply Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {programs.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              No government programs found for {wasteType} in {location}.
              Please check back later or contact local agriculture office.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GovernmentPrograms;
