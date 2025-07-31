
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Target, 
  TrendingUp,
  FileText,
  Database,
  Activity
} from 'lucide-react';

const ESGProgressTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-Q1');

  const reportingFrameworks = [
    {
      id: 'gri',
      name: 'GRI Standards',
      totalRequirements: 45,
      completedRequirements: 38,
      dataPoints: 156,
      collectedDataPoints: 142,
      dueDate: '2024-03-31',
      status: 'on-track',
      categories: [
        { name: 'Environmental', completed: 12, total: 15, percentage: 80 },
        { name: 'Social', completed: 18, total: 20, percentage: 90 },
        { name: 'Economic', completed: 8, total: 10, percentage: 80 }
      ]
    },
    {
      id: 'sasb',
      name: 'SASB Standards',
      totalRequirements: 32,
      completedRequirements: 29,
      dataPoints: 89,
      collectedDataPoints: 85,
      dueDate: '2024-02-28',
      status: 'completed',
      categories: [
        { name: 'Industry Specific', completed: 22, total: 24, percentage: 92 },
        { name: 'Governance', completed: 7, total: 8, percentage: 88 }
      ]
    },
    {
      id: 'tcfd',
      name: 'TCFD Framework',
      totalRequirements: 28,
      completedRequirements: 19,
      dataPoints: 67,
      collectedDataPoints: 52,
      dueDate: '2024-04-15',
      status: 'at-risk',
      categories: [
        { name: 'Governance', completed: 4, total: 6, percentage: 67 },
        { name: 'Strategy', completed: 6, total: 8, percentage: 75 },
        { name: 'Risk Management', completed: 5, total: 7, percentage: 71 },
        { name: 'Metrics & Targets', completed: 4, total: 7, percentage: 57 }
      ]
    },
    {
      id: 'csrd',
      name: 'EU CSRD',
      totalRequirements: 67,
      completedRequirements: 30,
      dataPoints: 234,
      collectedDataPoints: 145,
      dueDate: '2024-06-30',
      status: 'behind',
      categories: [
        { name: 'Environmental', completed: 15, total: 35, percentage: 43 },
        { name: 'Social', completed: 8, total: 20, percentage: 40 },
        { name: 'Governance', completed: 7, total: 12, percentage: 58 }
      ]
    }
  ];

  const dataCollectionProgress = [
    {
      category: 'Carbon Emissions',
      subcategories: [
        { name: 'Scope 1 Emissions', progress: 100, status: 'completed' },
        { name: 'Scope 2 Emissions', progress: 90, status: 'on-track' },
        { name: 'Scope 3 Emissions', progress: 45, status: 'at-risk' }
      ]
    },
    {
      category: 'Water Usage',
      subcategories: [
        { name: 'Total Water Consumption', progress: 100, status: 'completed' },
        { name: 'Water Recycling Rate', progress: 80, status: 'on-track' },
        { name: 'Water Quality Metrics', progress: 60, status: 'on-track' }
      ]
    },
    {
      category: 'Social Metrics',
      subcategories: [
        { name: 'Employee Satisfaction', progress: 75, status: 'on-track' },
        { name: 'Diversity & Inclusion', progress: 85, status: 'on-track' },
        { name: 'Training Hours', progress: 95, status: 'completed' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'on-track': return 'text-blue-600 bg-blue-100';
      case 'at-risk': return 'text-yellow-600 bg-yellow-100';
      case 'behind': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'on-track': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'at-risk': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'behind': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateOverallProgress = (framework: any) => {
    return Math.round((framework.completedRequirements / framework.totalRequirements) * 100);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const timeDiff = due.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">ESG Progress Tracker</h3>
          <p className="text-gray-600">Monitor your data collection and reporting progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">Period: {selectedPeriod}</span>
        </div>
      </div>

      <Tabs defaultValue="frameworks">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="frameworks">Reporting Frameworks</TabsTrigger>
          <TabsTrigger value="data-collection">Data Collection</TabsTrigger>
        </TabsList>

        <TabsContent value="frameworks" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportingFrameworks.map((framework) => (
              <Card key={framework.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{framework.name}</CardTitle>
                    <Badge className={getStatusColor(framework.status)}>
                      {framework.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Overall Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm font-bold">{calculateOverallProgress(framework)}%</span>
                    </div>
                    <Progress value={calculateOverallProgress(framework)} className="h-3" />
                  </div>

                  {/* Requirements vs Data Points */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">Requirements</span>
                      </div>
                      <p className="text-xl font-bold">
                        {framework.completedRequirements}/{framework.totalRequirements}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Database className="h-4 w-4" />
                        <span className="text-sm font-medium">Data Points</span>
                      </div>
                      <p className="text-xl font-bold">
                        {framework.collectedDataPoints}/{framework.dataPoints}
                      </p>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Category Breakdown</h4>
                    {framework.categories.map((category, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{category.name}</span>
                          <span className="text-sm font-medium">
                            {category.completed}/{category.total}
                          </span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(framework.status)}
                      <span className="text-sm">
                        Due: {new Date(framework.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {getDaysUntilDue(framework.dueDate)} days left
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data-collection" className="space-y-4">
          <div className="space-y-6">
            {dataCollectionProgress.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <div key={subIndex} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(subcategory.status)}
                          <span className="font-medium">{subcategory.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{subcategory.progress}%</span>
                          <Badge className={getStatusColor(subcategory.status)} size="sm">
                            {subcategory.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={subcategory.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Completed</span>
                </div>
                <p className="text-2xl font-bold text-green-600">7</p>
                <p className="text-sm text-gray-600">data categories</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">5</p>
                <p className="text-sm text-gray-600">data categories</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">At Risk</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">1</p>
                <p className="text-sm text-gray-600">data category</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESGProgressTracker;
