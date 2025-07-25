
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Thermometer, 
  CloudRain, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  MapPin,
  DollarSign,
  Calendar,
  BarChart3,
  LineChart,
  Globe,
  Activity,
  Shield,
  Target
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, ScatterChart, Scatter } from 'recharts';

const ClimateScenarioPlanning = () => {
  const [selectedScenario, setSelectedScenario] = useState('2C');
  const [timeHorizon, setTimeHorizon] = useState([2030]);
  const [selectedRegion, setSelectedRegion] = useState('global');

  const scenarios = [
    {
      name: '1.5°C Pathway',
      key: '1.5C',
      description: 'Rapid decarbonization scenario',
      probability: 25,
      physicalRisk: 'Medium',
      transitionRisk: 'High',
      financialImpact: '$2.3B',
      timeframe: '2030-2050'
    },
    {
      name: '2°C Pathway',
      key: '2C',
      description: 'Gradual transition scenario',
      probability: 45,
      physicalRisk: 'Medium-High',
      transitionRisk: 'Medium',
      financialImpact: '$3.1B',
      timeframe: '2030-2050'
    },
    {
      name: '3°C Pathway',
      key: '3C',
      description: 'Limited action scenario',
      probability: 30,
      physicalRisk: 'High',
      transitionRisk: 'Low',
      financialImpact: '$4.7B',
      timeframe: '2030-2050'
    }
  ];

  const physicalRisks = [
    {
      type: 'Extreme Heat',
      currentRisk: 35,
      projectedRisk: 65,
      impact: 'Manufacturing disruption',
      cost: '$850M',
      affectedAssets: 12,
      regions: ['Asia-Pacific', 'Middle East']
    },
    {
      type: 'Flooding',
      currentRisk: 20,
      projectedRisk: 45,
      impact: 'Supply chain disruption',
      cost: '$1.2B',
      affectedAssets: 8,
      regions: ['Southeast Asia', 'Eastern Europe']
    },
    {
      type: 'Drought',
      currentRisk: 25,
      projectedRisk: 55,
      impact: 'Water scarcity',
      cost: '$640M',
      affectedAssets: 15,
      regions: ['Sub-Saharan Africa', 'Australia']
    },
    {
      type: 'Sea Level Rise',
      currentRisk: 15,
      projectedRisk: 35,
      impact: 'Coastal facility risk',
      cost: '$920M',
      affectedAssets: 6,
      regions: ['Southeast Asia', 'Netherlands']
    }
  ];

  const transitionRisks = [
    {
      type: 'Carbon Pricing',
      impact: 'High',
      cost: '$1.8B',
      timeline: '2025-2030',
      description: 'Global carbon price reaching $150/tCO2',
      mitigation: 'Accelerate decarbonization'
    },
    {
      type: 'Regulatory Changes',
      impact: 'Medium',
      cost: '$450M',
      timeline: '2024-2027',
      description: 'New emissions standards',
      mitigation: 'Compliance investment'
    },
    {
      type: 'Technology Shifts',
      impact: 'Medium',
      cost: '$2.1B',
      timeline: '2025-2035',
      description: 'Clean technology adoption',
      mitigation: 'R&D investment'
    },
    {
      type: 'Market Shifts',
      impact: 'Low',
      cost: '$320M',
      timeline: '2026-2030',
      description: 'Consumer preference changes',
      mitigation: 'Product innovation'
    }
  ];

  const adaptationActions = [
    {
      action: 'Renewable Energy Transition',
      cost: '$3.2B',
      timeline: '2024-2030',
      impact: 'Reduce transition risk by 40%',
      status: 'In Progress',
      progress: 35
    },
    {
      action: 'Climate-Resilient Infrastructure',
      cost: '$1.8B',
      timeline: '2025-2035',
      impact: 'Reduce physical risk by 60%',
      status: 'Planning',
      progress: 15
    },
    {
      action: 'Water Management Systems',
      cost: '$850M',
      timeline: '2024-2028',
      impact: 'Reduce drought risk by 50%',
      status: 'In Progress',
      progress: 42
    },
    {
      action: 'Supply Chain Diversification',
      cost: '$1.1B',
      timeline: '2024-2027',
      impact: 'Reduce supply risk by 35%',
      status: 'Active',
      progress: 68
    }
  ];

  const temperatureData = [
    { year: 2024, current: 1.1, scenario_1_5: 1.2, scenario_2: 1.2, scenario_3: 1.2 },
    { year: 2030, current: 1.1, scenario_1_5: 1.3, scenario_2: 1.4, scenario_3: 1.6 },
    { year: 2040, current: 1.1, scenario_1_5: 1.4, scenario_2: 1.7, scenario_3: 2.3 },
    { year: 2050, current: 1.1, scenario_1_5: 1.5, scenario_2: 2.0, scenario_3: 3.0 }
  ];

  const financialImpactData = [
    { year: 2025, physical: 450, transition: 320, total: 770 },
    { year: 2030, physical: 680, transition: 890, total: 1570 },
    { year: 2040, physical: 1250, transition: 1100, total: 2350 },
    { year: 2050, physical: 1800, transition: 1300, total: 3100 }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'medium-high': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Climate Scenario Planning</h2>
          <p className="text-gray-600 mt-1">Advanced climate risk modeling and adaptation planning</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Globe className="h-4 w-4 mr-2" />
            Global View
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Climate Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.key}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedScenario === scenario.key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedScenario(scenario.key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{scenario.name}</h3>
                  <Badge variant="outline">{scenario.probability}%</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Physical Risk:</span>
                    <Badge className={getRiskColor(scenario.physicalRisk)}>
                      {scenario.physicalRisk}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Transition Risk:</span>
                    <Badge className={getRiskColor(scenario.transitionRisk)}>
                      {scenario.transitionRisk}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Financial Impact:</span>
                    <span className="font-medium">{scenario.financialImpact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Horizon Slider */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Time Horizon: {timeHorizon[0]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="px-4">
            <Slider
              value={timeHorizon}
              onValueChange={setTimeHorizon}
              max={2050}
              min={2025}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>2025</span>
              <span>2030</span>
              <span>2040</span>
              <span>2050</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="physical" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="physical">Physical Risks</TabsTrigger>
          <TabsTrigger value="transition">Transition Risks</TabsTrigger>
          <TabsTrigger value="financial">Financial Impact</TabsTrigger>
          <TabsTrigger value="adaptation">Adaptation</TabsTrigger>
        </TabsList>

        <TabsContent value="physical" className="space-y-6">
          {/* Temperature Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Temperature Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="scenario_1_5" stroke="#22c55e" strokeWidth={2} name="1.5°C Pathway" />
                  <Line type="monotone" dataKey="scenario_2" stroke="#f59e0b" strokeWidth={2} name="2°C Pathway" />
                  <Line type="monotone" dataKey="scenario_3" stroke="#ef4444" strokeWidth={2} name="3°C Pathway" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Physical Risk Assessment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {physicalRisks.map((risk, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CloudRain className="h-5 w-5" />
                      {risk.type}
                    </span>
                    <Badge variant="destructive">{risk.cost}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Risk Level</span>
                      <span className="font-medium">{risk.currentRisk}%</span>
                    </div>
                    <Progress value={risk.currentRisk} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Projected Risk ({timeHorizon[0]})</span>
                      <span className="font-medium">{risk.projectedRisk}%</span>
                    </div>
                    <Progress value={risk.projectedRisk} className="h-2" />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Primary Impact:</span>
                      <span className="font-medium">{risk.impact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Affected Assets:</span>
                      <span className="font-medium">{risk.affectedAssets}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">High-Risk Regions:</p>
                    <div className="flex flex-wrap gap-2">
                      {risk.regions.map((region, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transition" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {transitionRisks.map((risk, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      {risk.type}
                    </span>
                    <Badge className={getRiskColor(risk.impact)}>
                      {risk.impact}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Financial Impact:</span>
                      <span className="font-medium text-red-600">{risk.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeline:</span>
                      <span className="font-medium">{risk.timeline}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Description:</p>
                    <p className="text-sm text-gray-600">{risk.description}</p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">Mitigation Strategy:</p>
                    <p className="text-sm text-blue-700">{risk.mitigation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Impact Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={financialImpactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: 'Impact ($M)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="physical" fill="#ef4444" name="Physical Risk Impact" />
                  <Bar dataKey="transition" fill="#f59e0b" name="Transition Risk Impact" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost of Inaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600 mb-2">$4.7B</p>
                  <p className="text-sm text-gray-600">Total estimated impact by 2050</p>
                  <div className="mt-4 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Physical risks:</span>
                      <span>$1.8B</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transition risks:</span>
                      <span>$2.9B</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adaptation Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-2">$7.0B</p>
                  <p className="text-sm text-gray-600">Total investment required</p>
                  <div className="mt-4 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Infrastructure:</span>
                      <span>$4.2B</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technology:</span>
                      <span>$2.8B</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Net Benefit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600 mb-2">$2.3B</p>
                  <p className="text-sm text-gray-600">Avoided costs minus investment</p>
                  <div className="mt-4 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>ROI:</span>
                      <span>1.5x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payback period:</span>
                      <span>8 years</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="adaptation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {adaptationActions.map((action, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {action.action}
                    </span>
                    <Badge className={getStatusColor(action.status)}>
                      {action.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{action.progress}%</span>
                    </div>
                    <Progress value={action.progress} className="h-2" />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Investment Required:</span>
                      <span className="font-medium">{action.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeline:</span>
                      <span className="font-medium">{action.timeline}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">Expected Impact:</p>
                    <p className="text-sm text-green-700">{action.impact}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Activity className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm">
                      <Target className="h-4 w-4 mr-1" />
                      Update Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClimateScenarioPlanning;
