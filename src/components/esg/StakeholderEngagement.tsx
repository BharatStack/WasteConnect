
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Award, 
  Target,
  Calendar,
  Mail,
  FileText,
  Star,
  Trophy,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Activity,
  Send,
  Filter
} from 'lucide-react';

const StakeholderEngagement = () => {
  const [selectedStakeholder, setSelectedStakeholder] = useState('investors');
  const [activeTab, setActiveTab] = useState('dashboard');

  const stakeholderGroups = [
    {
      id: 'investors',
      name: 'Investors',
      count: 1247,
      engagement: 89,
      satisfaction: 94,
      priority: 'high',
      recentActivity: 'Q4 ESG Report Published',
      trend: 'up'
    },
    {
      id: 'employees',
      name: 'Employees',
      count: 12500,
      engagement: 76,
      satisfaction: 82,
      priority: 'high',
      recentActivity: 'Sustainability Training Completed',
      trend: 'up'
    },
    {
      id: 'suppliers',
      name: 'Suppliers',
      count: 247,
      engagement: 68,
      satisfaction: 78,
      priority: 'medium',
      recentActivity: 'ESG Assessment Updates',
      trend: 'steady'
    },
    {
      id: 'communities',
      name: 'Communities',
      count: 35,
      engagement: 71,
      satisfaction: 85,
      priority: 'medium',
      recentActivity: 'Community Impact Report',
      trend: 'up'
    },
    {
      id: 'regulators',
      name: 'Regulators',
      count: 12,
      engagement: 95,
      satisfaction: 91,
      priority: 'high',
      recentActivity: 'CSRD Compliance Filing',
      trend: 'steady'
    }
  ];

  const investorUpdates = [
    {
      id: 1,
      title: 'Q4 2023 ESG Performance Report',
      type: 'report',
      date: '2024-01-15',
      engagement: 892,
      status: 'published'
    },
    {
      id: 2,
      title: 'Net Zero Transition Plan Update',
      type: 'presentation',
      date: '2024-01-10',
      engagement: 654,
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Sustainable Finance Framework',
      type: 'document',
      date: '2024-01-05',
      engagement: 456,
      status: 'draft'
    }
  ];

  const employeeEngagement = [
    {
      program: 'Sustainability Champions',
      participants: 2340,
      completion: 87,
      satisfaction: 4.6,
      badge: 'Green Leader'
    },
    {
      program: 'Carbon Literacy Training',
      participants: 8900,
      completion: 76,
      satisfaction: 4.4,
      badge: 'Climate Aware'
    },
    {
      program: 'Circular Economy Workshop',
      participants: 1567,
      completion: 92,
      satisfaction: 4.8,
      badge: 'Circular Champion'
    }
  ];

  const communityProjects = [
    {
      name: 'Clean Water Initiative',
      location: 'Rural Communities',
      impact: '50,000 people',
      investment: '$2.3M',
      progress: 78,
      status: 'active'
    },
    {
      name: 'Solar Energy Program',
      location: 'Local Schools',
      impact: '25 schools',
      investment: '$1.8M',
      progress: 92,
      status: 'active'
    },
    {
      name: 'Skills Development Center',
      location: 'Urban Areas',
      impact: '1,200 trainees',
      investment: '$950K',
      progress: 45,
      status: 'planning'
    }
  ];

  const feedbackData = [
    {
      stakeholder: 'Investors',
      feedback: 'Excellent transparency in ESG reporting',
      rating: 5,
      category: 'Reporting',
      date: '2024-01-18'
    },
    {
      stakeholder: 'Employees',
      feedback: 'More sustainability training opportunities needed',
      rating: 4,
      category: 'Training',
      date: '2024-01-17'
    },
    {
      stakeholder: 'Communities',
      feedback: 'Great impact from water initiative',
      rating: 5,
      category: 'Impact',
      date: '2024-01-16'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': case 'planning': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Stakeholder Engagement</h2>
          <p className="text-gray-600 mt-1">Comprehensive stakeholder management and communication platform</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            New Communication
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stakeholder Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {stakeholderGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge className={getPriorityColor(group.priority)}>
                      {group.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{group.count.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total stakeholders</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engagement</span>
                      <span className="font-medium">{group.engagement}%</span>
                    </div>
                    <Progress value={group.engagement} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Satisfaction</span>
                      <span className="font-medium">{group.satisfaction}%</span>
                    </div>
                    <Progress value={group.satisfaction} className="h-2" />
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-1">Recent Activity:</p>
                    <p className="text-sm font-medium">{group.recentActivity}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Engagement Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Engagement Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Investor ESG Report Published</p>
                    <p className="text-sm text-gray-600">892 investors engaged • 2 hours ago</p>
                  </div>
                  <Badge variant="default">High Impact</Badge>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Employee Sustainability Training Completed</p>
                    <p className="text-sm text-gray-600">2,340 employees participated • 1 day ago</p>
                  </div>
                  <Badge variant="secondary">Medium Impact</Badge>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Community Project Update Sent</p>
                    <p className="text-sm text-gray-600">35 community leaders informed • 2 days ago</p>
                  </div>
                  <Badge variant="outline">Low Impact</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investors" className="space-y-6">
          {/* Investor Relations Portal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Investor Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">1,247</p>
                    <p className="text-sm text-blue-700">Total Investors</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">89%</p>
                    <p className="text-sm text-green-700">Engagement Rate</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ESG Report Views</span>
                    <span className="font-medium">2,340</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Webinar Attendance</span>
                    <span className="font-medium">1,567</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Q&A Submissions</span>
                    <span className="font-medium">234</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Publications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investorUpdates.map((update) => (
                    <div key={update.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{update.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>{new Date(update.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{update.engagement} engagements</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(update.status)}>
                        {update.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Communication Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Investor Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input placeholder="ESG Update - Q4 2023" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient Group</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>All Investors</option>
                      <option>Institutional Investors</option>
                      <option>Retail Investors</option>
                      <option>ESG-focused Investors</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea 
                    placeholder="Share your ESG updates and insights..."
                    className="min-h-32"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Attach Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                  <Button>
                    <Send className="h-4 w-4 mr-1" />
                    Send Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          {/* Employee Engagement Programs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {employeeEngagement.map((program, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{program.program}</span>
                    <Badge variant="secondary">{program.badge}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{program.participants.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Participants</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">{program.completion}%</span>
                    </div>
                    <Progress value={program.completion} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satisfaction</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{program.satisfaction}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="sm">
                    <Trophy className="h-4 w-4 mr-1" />
                    View Leaderboard
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gamification Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Sustainability Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Energy Saver Challenge</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Reduce office energy consumption by 10%</p>
                  <div className="flex items-center justify-between">
                    <Progress value={78} className="flex-1 mr-2" />
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Waste Reduction Goal</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Achieve 90% waste diversion rate</p>
                  <div className="flex items-center justify-between">
                    <Progress value={85} className="flex-1 mr-2" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">Green Commute Week</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Use sustainable transportation options</p>
                  <div className="flex items-center justify-between">
                    <Progress value={92} className="flex-1 mr-2" />
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communities" className="space-y-6">
          {/* Community Impact Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {communityProjects.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{project.name}</span>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{project.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impact:</span>
                      <span className="font-medium">{project.impact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment:</span>
                      <span className="font-medium">{project.investment}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          {/* Feedback Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackData.map((feedback, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{feedback.stakeholder}</Badge>
                        <Badge variant="outline">{feedback.category}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{feedback.feedback}</p>
                    <p className="text-xs text-gray-500">{new Date(feedback.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StakeholderEngagement;
