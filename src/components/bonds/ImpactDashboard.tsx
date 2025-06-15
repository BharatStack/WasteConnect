
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  Zap, 
  Droplets, 
  Users, 
  MapPin, 
  Target,
  TrendingUp,
  Award
} from 'lucide-react';

const ImpactDashboard = () => {
  const impactMetrics = [
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: "CO₂ Reduction",
      value: "125,000",
      unit: "tonnes",
      description: "Carbon emissions prevented through green projects"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Clean Energy",
      value: "85",
      unit: "MW",
      description: "Renewable energy capacity installed"
    },
    {
      icon: <Droplets className="h-8 w-8 text-blue-600" />,
      title: "Water Saved",
      value: "2.5",
      unit: "million liters",
      description: "Water conservation through efficient systems"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Jobs Created",
      value: "1,250",
      unit: "positions",
      description: "Direct and indirect employment opportunities"
    }
  ];

  const projects = [
    {
      name: "Solar Park Rajasthan",
      location: "Rajasthan, India",
      category: "renewable_energy",
      progress: 85,
      impact: "50 MW capacity, 75,000 tonnes CO₂ saved annually"
    },
    {
      name: "Water Treatment Mumbai",
      location: "Mumbai, India", 
      category: "sustainable_water",
      progress: 60,
      impact: "10M liters/day capacity, serving 50,000 people"
    },
    {
      name: "Waste to Energy Delhi",
      location: "Delhi, India",
      category: "waste_management", 
      progress: 40,
      impact: "500 tonnes waste/day, 15 MW energy generation"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'renewable_energy':
        return 'bg-yellow-100 text-yellow-800';
      case 'sustainable_water':
        return 'bg-blue-100 text-blue-800';
      case 'waste_management':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {impactMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-sm text-gray-500">{metric.unit}</span>
                  </div>
                </div>
                {metric.icon}
              </div>
              <p className="text-xs text-gray-500 mt-3">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Active Project Impact
          </CardTitle>
          <CardDescription>
            Real-time progress and impact of funded green projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{project.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </div>
                    <Badge className={getCategoryColor(project.category)}>
                      {project.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{project.progress}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600">{project.impact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Sustainability Achievements
          </CardTitle>
          <CardDescription>
            Milestones reached through green bond investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">First Solar Project Commissioned</p>
                <p className="text-sm text-gray-600">25 MW solar facility now generating clean energy</p>
              </div>
              <Badge variant="secondary">Q4 2023</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium">Water Treatment Plant Operational</p>
                <p className="text-sm text-gray-600">Serving 25,000 people with clean water daily</p>
              </div>
              <Badge variant="secondary">Q1 2024</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">100,000 Tonnes CO₂ Milestone</p>
                <p className="text-sm text-gray-600">Cumulative carbon reduction achieved</p>
              </div>
              <Badge variant="secondary">Q2 2024</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactDashboard;
