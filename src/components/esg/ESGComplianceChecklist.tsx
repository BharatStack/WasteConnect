
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Circle, 
  AlertTriangle, 
  FileText, 
  Link as LinkIcon, 
  Calendar, 
  User,
  Clock,
  Target,
  Database
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  requirement: string;
  description: string;
  completed: boolean;
  dataLinked: boolean;
  evidence?: string;
  dueDate?: string;
  assignedTo?: string;
  priority: 'high' | 'medium' | 'low';
  auditTrail: Array<{
    action: string;
    user: string;
    timestamp: string;
    notes?: string;
  }>;
}

const ESGComplianceChecklist = () => {
  const [selectedFramework, setSelectedFramework] = useState('gri');
  const [complianceData, setComplianceData] = useState<Record<string, ComplianceItem[]>>({
    gri: [
      {
        id: 'gri-101-1',
        requirement: 'GRI 101-1: Organizational Profile',
        description: 'Report the name of the organization',
        completed: true,
        dataLinked: true,
        evidence: 'Company profile document',
        priority: 'high',
        assignedTo: 'Sarah Johnson',
        auditTrail: [
          { action: 'Completed', user: 'Sarah Johnson', timestamp: '2024-01-15T10:30:00Z' },
          { action: 'Reviewed', user: 'Michael Chen', timestamp: '2024-01-16T14:20:00Z' }
        ]
      },
      {
        id: 'gri-302-1',
        requirement: 'GRI 302-1: Energy Consumption',
        description: 'Total fuel consumption within the organization from non-renewable sources',
        completed: false,
        dataLinked: true,
        priority: 'high',
        assignedTo: 'Emma Davis',
        dueDate: '2024-02-15',
        auditTrail: [
          { action: 'Assigned', user: 'System', timestamp: '2024-01-10T09:00:00Z' }
        ]
      },
      {
        id: 'gri-303-1',
        requirement: 'GRI 303-1: Water Interactions',
        description: 'Description of water withdrawal, consumption and discharge',
        completed: false,
        dataLinked: false,
        priority: 'medium',
        assignedTo: 'James Wilson',
        dueDate: '2024-03-01',
        auditTrail: [
          { action: 'Assigned', user: 'System', timestamp: '2024-01-10T09:00:00Z' }
        ]
      }
    ],
    sasb: [
      {
        id: 'sasb-em-if-130a1',
        requirement: 'SASB EM-IF-130a.1: Scope 1 Emissions',
        description: 'Gross global Scope 1 emissions, percentage covered under emissions-limiting regulations',
        completed: true,
        dataLinked: true,
        evidence: 'Carbon footprint calculation report',
        priority: 'high',
        assignedTo: 'Lisa Chen',
        auditTrail: [
          { action: 'Completed', user: 'Lisa Chen', timestamp: '2024-01-20T15:45:00Z' }
        ]
      },
      {
        id: 'sasb-em-if-140a1',
        requirement: 'SASB EM-IF-140a.1: Water Management',
        description: 'Total water consumed, percentage of each in regions with High or Extremely High Baseline Water Stress',
        completed: false,
        dataLinked: true,
        priority: 'medium',
        assignedTo: 'David Rodriguez',
        dueDate: '2024-02-28',
        auditTrail: [
          { action: 'In Progress', user: 'David Rodriguez', timestamp: '2024-01-25T11:30:00Z' }
        ]
      }
    ],
    tcfd: [
      {
        id: 'tcfd-gov-a',
        requirement: 'TCFD Governance (a): Board Oversight',
        description: 'Describe the board\'s oversight of climate-related risks and opportunities',
        completed: false,
        dataLinked: false,
        priority: 'high',
        assignedTo: 'Robert Kim',
        dueDate: '2024-04-15',
        auditTrail: [
          { action: 'Assigned', user: 'System', timestamp: '2024-01-10T09:00:00Z' }
        ]
      },
      {
        id: 'tcfd-risk-a',
        requirement: 'TCFD Risk Management (a): Risk Identification',
        description: 'Describe the organization\'s processes for identifying climate-related risks',
        completed: false,
        dataLinked: true,
        priority: 'high',
        assignedTo: 'Amanda Foster',
        dueDate: '2024-04-15',
        auditTrail: [
          { action: 'In Progress', user: 'Amanda Foster', timestamp: '2024-01-28T13:15:00Z' }
        ]
      }
    ]
  });

  const frameworks = [
    { id: 'gri', name: 'GRI Standards', color: 'blue' },
    { id: 'sasb', name: 'SASB Framework', color: 'green' },
    { id: 'tcfd', name: 'TCFD Recommendations', color: 'purple' }
  ];

  const toggleCompleted = (itemId: string) => {
    setComplianceData(prev => ({
      ...prev,
      [selectedFramework]: prev[selectedFramework].map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              completed: !item.completed,
              auditTrail: [
                ...item.auditTrail,
                {
                  action: !item.completed ? 'Completed' : 'Uncompleted',
                  user: 'Current User',
                  timestamp: new Date().toISOString()
                }
              ]
            }
          : item
      )
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateProgress = (items: ComplianceItem[]) => {
    const completed = items.filter(item => item.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  const getDataLinkStatus = (item: ComplianceItem) => {
    if (item.dataLinked) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <Database className="h-3 w-3" />
          <span className="text-xs">Data Linked</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <Database className="h-3 w-3" />
        <span className="text-xs">No Data Link</span>
      </div>
    );
  };

  const currentItems = complianceData[selectedFramework] || [];
  const progress = calculateProgress(currentItems);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Compliance Checklist</h3>
          <p className="text-gray-600">Track requirements across ESG frameworks</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{progress}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
      </div>

      {/* Framework Selection */}
      <div className="flex gap-2">
        {frameworks.map((framework) => (
          <Button
            key={framework.id}
            variant={selectedFramework === framework.id ? "default" : "outline"}
            onClick={() => setSelectedFramework(framework.id)}
          >
            {framework.name}
          </Button>
        ))}
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {frameworks.find(f => f.id === selectedFramework)?.name} Progress
            </CardTitle>
            <Badge variant="secondary">
              {currentItems.filter(item => item.completed).length} / {currentItems.length} completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3 mb-4" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">
                {currentItems.filter(item => item.completed).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {currentItems.filter(item => item.dataLinked).length}
              </div>
              <div className="text-sm text-gray-600">Data Linked</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-orange-600">
                {currentItems.filter(item => item.priority === 'high' && !item.completed).length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-4">
        {currentItems.map((item) => (
          <Card key={item.id} className={`transition-all ${item.completed ? 'opacity-75' : ''}`}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleCompleted(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.requirement}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        {item.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    
                    {/* Status indicators */}
                    <div className="flex items-center gap-4 text-sm">
                      {getDataLinkStatus(item)}
                      
                      {item.assignedTo && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <User className="h-3 w-3" />
                          <span className="text-xs">{item.assignedTo}</span>
                        </div>
                      )}
                      
                      {item.dueDate && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs">Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {item.evidence && (
                        <div className="flex items-center gap-1 text-green-600">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">{item.evidence}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="ml-8 border-l-2 border-gray-200 pl-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Audit Trail</h5>
                  <div className="space-y-2">
                    {item.auditTrail.map((entry, index) => (
                      <div key={index} className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                        <span>•</span>
                        <span>{entry.action}</span>
                        <span>•</span>
                        <span className="font-medium">{entry.user}</span>
                        {entry.notes && (
                          <>
                            <span>•</span>
                            <span className="italic">{entry.notes}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="ml-8 flex gap-2">
                  <Button size="sm" variant="outline">
                    <LinkIcon className="h-3 w-3 mr-1" />
                    Link Data
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    Add Evidence
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ESGComplianceChecklist;
