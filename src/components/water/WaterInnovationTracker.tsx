
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Cpu, 
  Wifi,
  Settings,
  TrendingUp,
  Award,
  Lightbulb,
  Target,
  Beaker
} from 'lucide-react';

interface WaterInnovationTrackerProps {
  onUpdate: () => void;
}

const WaterInnovationTracker: React.FC<WaterInnovationTrackerProps> = ({ onUpdate }) => {
  const { toast } = useToast();
  const [innovationData, setInnovationData] = useState({
    automation_level: '75',
    iot_sensors: '12',
    ai_integration: 'advanced',
    r_and_d_investment: '1.8',
    renewable_energy: '65',
    circular_practices: '80'
  });

  const [currentScore, setCurrentScore] = useState({
    technology: 60,
    sustainability: 85,
    total: 145
  });

  const technologies = [
    { name: 'Sequential Batch Reactor (SBR)', level: 'Advanced', points: 25, implemented: true },
    { name: 'Membrane Bioreactor (MBR)', level: 'Cutting-edge', points: 40, implemented: true },
    { name: 'Reverse Osmosis (RO)', level: 'Advanced', points: 30, implemented: true },
    { name: 'Zero Liquid Discharge (ZLD)', level: 'Cutting-edge', points: 50, implemented: false },
    { name: 'IoT Sensor Network', level: 'Advanced', points: 35, implemented: true },
    { name: 'AI-Powered Control', level: 'Cutting-edge', points: 45, implemented: true }
  ];

  const sustainabilityMetrics = [
    { metric: 'Carbon Efficiency', value: 88, target: 90, unit: '%' },
    { metric: 'Renewable Energy Usage', value: 65, target: 80, unit: '%' },
    { metric: 'Circular Economy Practices', value: 80, target: 85, unit: '%' },
    { metric: 'Waste Heat Recovery', value: 72, target: 75, unit: '%' }
  ];

  const researchProjects = [
    {
      id: 1,
      title: 'Advanced Membrane Technology',
      status: 'In Progress',
      progress: 75,
      budget: 250000,
      expectedCompletion: '2024-06-30',
      potentialPoints: 50
    },
    {
      id: 2,
      title: 'AI-Driven Predictive Maintenance',
      status: 'Planning',
      progress: 25,
      budget: 180000,
      expectedCompletion: '2024-09-30',
      potentialPoints: 40
    },
    {
      id: 3,
      title: 'Blockchain Water Trading',
      status: 'Completed',
      progress: 100,
      budget: 120000,
      expectedCompletion: '2024-01-15',
      potentialPoints: 35
    }
  ];

  const handleUpdateInnovation = () => {
    // Simulate updating innovation score
    const newTechScore = Math.min(75, Math.floor(Math.random() * 20) + 55);
    const newSustainabilityScore = Math.min(125, Math.floor(Math.random() * 30) + 70);
    
    setCurrentScore({
      technology: newTechScore,
      sustainability: newSustainabilityScore,
      total: newTechScore + newSustainabilityScore
    });

    toast({
      title: "Innovation Score Updated",
      description: `Your innovation score is now ${newTechScore + newSustainabilityScore}/200 points`,
    });

    onUpdate();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600';
      case 'In Progress': return 'text-blue-600';
      case 'Planning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Innovation Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Innovation & Sustainability Score: {currentScore.total}/200
          </CardTitle>
          <CardDescription>
            Technology adoption and sustainable practices evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Technology Score</span>
                  <span className="text-sm font-bold text-blue-600">{currentScore.technology}/75</span>
                </div>
                <Progress value={(currentScore.technology / 75) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Sustainability Score</span>
                  <span className="text-sm font-bold text-green-600">{currentScore.sustainability}/125</span>
                </div>
                <Progress value={(currentScore.sustainability / 125) * 100} className="h-2" />
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {Math.round((currentScore.total / 200) * 100)}%
                </div>
                <Badge variant="default">Innovation Leader</Badge>
                <Button 
                  onClick={handleUpdateInnovation}
                  className="mt-4 bg-yellow-600 hover:bg-yellow-700"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Update Score
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Adoption */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-600" />
            Technology Adoption Matrix
          </CardTitle>
          <CardDescription>
            Current treatment technologies and automation systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className={`p-4 border rounded-lg ${tech.implemented ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{tech.name}</span>
                  <Badge variant={tech.implemented ? 'default' : 'outline'}>
                    {tech.implemented ? 'Active' : 'Planned'}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span>{tech.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Points:</span>
                    <span className="font-bold text-blue-600">{tech.points}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* IoT and Automation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-purple-600" />
              IoT Integration Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="automation">Automation Level (%)</Label>
                  <Input
                    id="automation"
                    type="number"
                    value={innovationData.automation_level}
                    onChange={(e) => setInnovationData(prev => ({ ...prev, automation_level: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="sensors">IoT Sensors Count</Label>
                  <Input
                    id="sensors"
                    type="number"
                    value={innovationData.iot_sensors}
                    onChange={(e) => setInnovationData(prev => ({ ...prev, iot_sensors: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="ai_integration">AI Integration Level</Label>
                <Select 
                  value={innovationData.ai_integration} 
                  onValueChange={(value) => setInnovationData(prev => ({ ...prev, ai_integration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (25 pts)</SelectItem>
                    <SelectItem value="advanced">Advanced (40 pts)</SelectItem>
                    <SelectItem value="cutting-edge">Cutting-edge (50 pts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Wifi className="h-4 w-4" />
                  <span>Real-time monitoring active</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Settings className="h-4 w-4" />
                  <span>Automated control systems operational</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Sustainability Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sustainabilityMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <span className="text-sm text-gray-600">{metric.value}{metric.unit} / {metric.target}{metric.unit}</span>
                  </div>
                  <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                </div>
              ))}
              
              <div className="pt-2 space-y-2">
                <div>
                  <Label htmlFor="renewable">Renewable Energy (%)</Label>
                  <Input
                    id="renewable"
                    type="number"
                    value={innovationData.renewable_energy}
                    onChange={(e) => setInnovationData(prev => ({ ...prev, renewable_energy: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="circular">Circular Practices (%)</Label>
                  <Input
                    id="circular"
                    type="number"
                    value={innovationData.circular_practices}
                    onChange={(e) => setInnovationData(prev => ({ ...prev, circular_practices: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* R&D Investment and Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-purple-600" />
            Research & Development Portfolio
          </CardTitle>
          <CardDescription>
            Current R&D investments and innovation projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="r_and_d">R&D Investment (% of revenue)</Label>
                <Input
                  id="r_and_d"
                  type="number"
                  step="0.1"
                  value={innovationData.r_and_d_investment}
                  onChange={(e) => setInnovationData(prev => ({ ...prev, r_and_d_investment: e.target.value }))}
                />
              </div>
              <div className="flex items-end">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Total R&D: ₹5.5 Crores
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {researchProjects.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{project.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Budget: ₹{(project.budget / 100000).toFixed(1)}L</span>
                      <span>Due: {project.expectedCompletion}</span>
                      <span>Potential: +{project.potentialPoints} pts</span>
                    </div>
                  </div>
                  <Badge variant={project.status === 'Completed' ? 'default' : project.status === 'In Progress' ? 'secondary' : 'outline'}>
                    {project.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Innovation Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Innovation Opportunities
          </CardTitle>
          <CardDescription>
            Recommended next steps for score improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600">Technology Upgrades</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="font-medium text-sm">Implement ZLD Technology</div>
                  <div className="text-xs text-gray-600">Potential score increase: +50 points</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="font-medium text-sm">Advanced AI Integration</div>
                  <div className="text-xs text-gray-600">Potential score increase: +35 points</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">Sustainability Initiatives</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="font-medium text-sm">Increase Renewable Energy</div>
                  <div className="text-xs text-gray-600">Target: 80% renewable energy usage</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <div className="font-medium text-sm">Circular Economy Practices</div>
                  <div className="text-xs text-gray-600">Target: 90% waste recovery rate</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterInnovationTracker;
