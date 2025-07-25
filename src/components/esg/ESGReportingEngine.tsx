
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  Settings, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Users,
  Globe,
  Shield,
  Zap,
  BarChart3,
  FileCheck,
  GitBranch,
  MessageSquare
} from 'lucide-react';

const ESGReportingEngine = () => {
  const [selectedFramework, setSelectedFramework] = useState('GRI');
  const [reportProgress, setReportProgress] = useState(78);
  const [activeTab, setActiveTab] = useState('frameworks');

  const frameworks = [
    { 
      name: 'GRI', 
      fullName: 'Global Reporting Initiative',
      status: 'active',
      completion: 85,
      lastUpdated: '2024-01-15',
      requirements: 45,
      completed: 38
    },
    { 
      name: 'SASB', 
      fullName: 'Sustainability Accounting Standards Board',
      status: 'active',
      completion: 92,
      lastUpdated: '2024-01-10',
      requirements: 32,
      completed: 29
    },
    { 
      name: 'TCFD', 
      fullName: 'Task Force on Climate-related Financial Disclosures',
      status: 'active',
      completion: 67,
      lastUpdated: '2024-01-12',
      requirements: 28,
      completed: 19
    },
    { 
      name: 'CSRD', 
      fullName: 'Corporate Sustainability Reporting Directive',
      status: 'pending',
      completion: 45,
      lastUpdated: '2024-01-08',
      requirements: 67,
      completed: 30
    },
    { 
      name: 'CDP', 
      fullName: 'Carbon Disclosure Project',
      status: 'active',
      completion: 88,
      lastUpdated: '2024-01-14',
      requirements: 25,
      completed: 22
    },
    { 
      name: 'ESRS', 
      fullName: 'European Sustainability Reporting Standards',
      status: 'draft',
      completion: 23,
      lastUpdated: '2024-01-05',
      requirements: 89,
      completed: 20
    }
  ];

  const reports = [
    {
      id: 1,
      name: 'Q4 2023 Sustainability Report',
      framework: 'GRI',
      status: 'published',
      dueDate: '2024-01-31',
      progress: 100,
      assignedTo: 'Sarah Johnson',
      version: '2.1'
    },
    {
      id: 2,
      name: 'Annual TCFD Report 2023',
      framework: 'TCFD',
      status: 'review',
      dueDate: '2024-02-15',
      progress: 85,
      assignedTo: 'Michael Chen',
      version: '1.3'
    },
    {
      id: 3,
      name: 'CSRD Compliance Report',
      framework: 'CSRD',
      status: 'draft',
      dueDate: '2024-03-01',
      progress: 45,
      assignedTo: 'Emma Davis',
      version: '1.0'
    }
  ];

  const templates = [
    { name: 'Annual Sustainability Report', framework: 'GRI', industry: 'Manufacturing', downloads: 1250 },
    { name: 'Climate Risk Assessment', framework: 'TCFD', industry: 'Financial Services', downloads: 890 },
    { name: 'ESG Performance Summary', framework: 'SASB', industry: 'Technology', downloads: 2100 },
    { name: 'Supply Chain Sustainability', framework: 'GRI', industry: 'Retail', downloads: 675 },
    { name: 'Carbon Footprint Report', framework: 'CDP', industry: 'Energy', downloads: 1456 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'published': return 'bg-green-100 text-green-800';
      case 'review': case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'review': return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'draft': return <FileText className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const frameworkMapping = {
    'GRI': ['Environmental Performance', 'Social Impact', 'Governance', 'Economic Impact'],
    'SASB': ['Industry-Specific Metrics', 'Materiality Assessment', 'Performance Data'],
    'TCFD': ['Governance', 'Strategy', 'Risk Management', 'Metrics & Targets'],
    'CSRD': ['Environmental', 'Social', 'Governance', 'Sustainability Strategy'],
    'CDP': ['Climate Change', 'Water Security', 'Forest', 'Supply Chain'],
    'ESRS': ['Environmental', 'Social', 'Governance', 'Cross-cutting Standards']
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">ESG Reporting Engine</h2>
          <p className="text-gray-600 mt-1">Comprehensive reporting across 50+ ESG frameworks</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>

        <TabsContent value="frameworks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frameworks.map((framework) => (
              <Card key={framework.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{framework.name}</CardTitle>
                    <Badge className={getStatusColor(framework.status)}>
                      {framework.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{framework.fullName}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span className="font-medium">{framework.completion}%</span>
                    </div>
                    <Progress value={framework.completion} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Requirements</p>
                      <p className="font-medium">{framework.requirements}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Completed</p>
                      <p className="font-medium">{framework.completed}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-xs text-gray-500">
                      Updated {new Date(framework.lastUpdated).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(report.status)}
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Framework: {report.framework}</span>
                          <span>Due: {new Date(report.dueDate).toLocaleDateString()}</span>
                          <span>Assigned to: {report.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{report.progress}%</p>
                        <Progress value={report.progress} className="w-24 h-2" />
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{template.framework}</Badge>
                    <Badge variant="outline">{template.industry}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Download className="h-4 w-4" />
                      <span>{template.downloads} downloads</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Framework Data Mapping</CardTitle>
              <p className="text-sm text-gray-600">
                Visualize how your data connects across different frameworks
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Label htmlFor="framework-select">Select Framework:</Label>
                  <select 
                    id="framework-select"
                    value={selectedFramework}
                    onChange={(e) => setSelectedFramework(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    {frameworks.map(f => (
                      <option key={f.name} value={f.name}>{f.name} - {f.fullName}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Framework Requirements</h4>
                    <div className="space-y-2">
                      {frameworkMapping[selectedFramework as keyof typeof frameworkMapping]?.map((requirement, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">{requirement}</span>
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mapped
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Data Sources</h4>
                    <div className="space-y-2">
                      {['ERP System', 'HRIS', 'IoT Sensors', 'Financial Systems', 'Supply Chain DB'].map((source, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm">{source}</span>
                          <Badge variant="default">
                            <Zap className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        </div>
                      ))}
                    </div>
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
                  Team Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">SJ</span>
                      </div>
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-gray-600">Lead Sustainability</p>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">MC</span>
                      </div>
                      <div>
                        <p className="font-medium">Michael Chen</p>
                        <p className="text-sm text-gray-600">Risk Manager</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Reviewing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm">Please review the carbon data for Q3 - looks high</p>
                    <p className="text-xs text-gray-500">Sarah Johnson • 2 hours ago</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-sm">TCFD report approved for publication</p>
                    <p className="text-xs text-gray-500">Michael Chen • 1 day ago</p>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="text-sm">New CSRD requirements added to checklist</p>
                    <p className="text-xs text-gray-500">Emma Davis • 2 days ago</p>
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

export default ESGReportingEngine;
