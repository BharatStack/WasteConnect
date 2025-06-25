
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  MapPin, 
  DollarSign, 
  Calendar,
  Leaf,
  Building,
  Zap,
  Droplets
} from 'lucide-react';

interface ProjectCreationFormProps {
  onProjectCreated: () => void;
}

const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({ onProjectCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    projectType: '',
    wasteCapacity: '',
    projectTimeline: '',
    fundingRequired: '',
    environmentalImpact: {
      co2Reduction: '',
      wasteProcessed: '',
      energyGenerated: '',
      jobsCreated: ''
    },
    technicalSpecs: {
      technology: '',
      processingMethod: '',
      capacity: '',
      efficiency: ''
    }
  });

  const projectTypes = [
    { value: 'recycling', label: 'Recycling Facility', icon: Building },
    { value: 'composting', label: 'Composting Plant', icon: Leaf },
    { value: 'waste_to_energy', label: 'Waste to Energy', icon: Zap },
    { value: 'landfill_management', label: 'Landfill Management', icon: Droplets }
  ];

  const handleInputChange = (field: string, value: string, section?: string) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Here you would integrate with your backend API
      // For now, we'll simulate the API call
      console.log('Creating project:', formData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Project Created Successfully!",
        description: "Your waste management project has been submitted for review.",
      });

      onProjectCreated();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        location: '',
        projectType: '',
        wasteCapacity: '',
        projectTimeline: '',
        fundingRequired: '',
        environmentalImpact: {
          co2Reduction: '',
          wasteProcessed: '',
          energyGenerated: '',
          jobsCreated: ''
        },
        technicalSpecs: {
          technology: '',
          processingMethod: '',
          capacity: '',
          efficiency: ''
        }
      });
      setCurrentStep(1);

    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter project name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Project Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your waste management project..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Project Type *</Label>
        <div className="grid grid-cols-2 gap-3">
          {projectTypes.map((type) => (
            <Card 
              key={type.value}
              className={`cursor-pointer border-2 transition-colors ${
                formData.projectType === type.value 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => handleInputChange('projectType', type.value)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <type.icon className="h-6 w-6 text-green-600" />
                <span className="font-medium">{type.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wasteCapacity">Waste Processing Capacity (tons/day) *</Label>
          <Input
            id="wasteCapacity"
            type="number"
            value={formData.wasteCapacity}
            onChange={(e) => handleInputChange('wasteCapacity', e.target.value)}
            placeholder="Enter daily capacity"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectTimeline">Project Timeline (months) *</Label>
          <Input
            id="projectTimeline"
            type="number"
            value={formData.projectTimeline}
            onChange={(e) => handleInputChange('projectTimeline', e.target.value)}
            placeholder="Enter timeline in months"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="technology">Technology/Method</Label>
          <Input
            id="technology"
            value={formData.technicalSpecs.technology}
            onChange={(e) => handleInputChange('technology', e.target.value, 'technicalSpecs')}
            placeholder="e.g., Anaerobic Digestion, Pyrolysis"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="efficiency">Expected Efficiency (%)</Label>
          <Input
            id="efficiency"
            type="number"
            value={formData.technicalSpecs.efficiency}
            onChange={(e) => handleInputChange('efficiency', e.target.value, 'technicalSpecs')}
            placeholder="Enter efficiency percentage"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fundingRequired">Funding Required (₹) *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="fundingRequired"
              type="number"
              value={formData.fundingRequired}
              onChange={(e) => handleInputChange('fundingRequired', e.target.value)}
              placeholder="Enter total funding needed"
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobsCreated">Jobs Created</Label>
          <Input
            id="jobsCreated"
            type="number"
            value={formData.environmentalImpact.jobsCreated}
            onChange={(e) => handleInputChange('jobsCreated', e.target.value, 'environmentalImpact')}
            placeholder="Number of jobs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="co2Reduction">CO₂ Reduction (tons/year)</Label>
          <Input
            id="co2Reduction"
            type="number"
            value={formData.environmentalImpact.co2Reduction}
            onChange={(e) => handleInputChange('co2Reduction', e.target.value, 'environmentalImpact')}
            placeholder="Annual CO₂ reduction"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="energyGenerated">Energy Generated (MWh/year)</Label>
          <Input
            id="energyGenerated"
            type="number"
            value={formData.environmentalImpact.energyGenerated}
            onChange={(e) => handleInputChange('energyGenerated', e.target.value, 'environmentalImpact')}
            placeholder="Annual energy generation"
          />
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Basic Information', icon: FileText },
    { number: 2, title: 'Technical Specifications', icon: Building },
    { number: 3, title: 'Environmental Impact', icon: Leaf }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Waste Management Project</CardTitle>
          <CardDescription>
            Fill out the form below to create your project and attract green bond investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  <step.icon className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    Step {step.number}
                  </div>
                  <div className="text-xs text-gray-500">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-px w-12 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Steps */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <Separator className="my-6" />

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={
                    (currentStep === 1 && (!formData.name || !formData.description || !formData.location || !formData.projectType)) ||
                    (currentStep === 2 && (!formData.wasteCapacity || !formData.projectTimeline))
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.fundingRequired}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? 'Creating Project...' : 'Create Project'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCreationForm;
