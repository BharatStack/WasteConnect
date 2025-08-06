
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  MapPin,
  Calendar,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  Globe,
  Shield,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const ReportDashboard = () => {
  const [activeMetric, setActiveMetric] = useState('overview');

  // Mock data for demonstration
  const dashboardStats = {
    totalReports: 1247,
    pendingReports: 89,
    resolvedReports: 1023,
    inProgressReports: 135,
    resolutionRate: 82,
    avgResolutionTime: 7.3,
    citizenSatisfaction: 87,
    thisMonthReports: 156
  };

  const grievanceCategories = [
    { name: 'Waste Management', count: 324, color: 'bg-green-500', urgent: 12 },
    { name: 'Water Supply', count: 289, color: 'bg-blue-500', urgent: 8 },
    { name: 'Road Infrastructure', count: 267, color: 'bg-orange-500', urgent: 15 },
    { name: 'Public Health', count: 201, color: 'bg-red-500', urgent: 22 },
    { name: 'Sanitation', count: 166, color: 'bg-purple-500', urgent: 6 }
  ];

  const recentActivity = [
    { id: 1, action: 'New grievance submitted', category: 'Waste Management', time: '5 mins ago', status: 'pending' },
    { id: 2, action: 'Grievance resolved', category: 'Water Supply', time: '23 mins ago', status: 'resolved' },
    { id: 3, action: 'Status updated to In Progress', category: 'Road Infrastructure', time: '1 hour ago', status: 'in_progress' },
    { id: 4, action: 'Legal notice generated', category: 'Public Health', time: '2 hours ago', status: 'legal' }
  ];

  const performanceMetrics = [
    { title: 'Resolution Rate', value: '82%', change: '+5%', icon: Target, color: 'text-green-600' },
    { title: 'Avg. Resolution Time', value: '7.3 days', change: '-1.2 days', icon: Clock, color: 'text-blue-600' },
    { title: 'Citizen Satisfaction', value: '87%', change: '+3%', icon: Award, color: 'text-purple-600' },
    { title: 'Active Cases', value: '224', change: '-12', icon: Activity, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Jan Suvidha Samadhan Dashboard</h2>
          <p className="text-gray-600 mt-1">Comprehensive citizen grievance reporting and tracking system</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Globe className="h-3 w-3 mr-1" />
            Multi-Language Support
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            Blockchain Secured
          </Badge>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className={`text-xs ${metric.color}`}>{metric.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grievances">Grievance Categories</TabsTrigger>
          <TabsTrigger value="tracking">Real-time Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integration">Integration Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grievance Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-eco-green-600" />
                  Grievance Statistics
                </CardTitle>
                <CardDescription>Current status of all reported grievances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-800">{dashboardStats.resolvedReports}</p>
                    <p className="text-sm text-green-600">Resolved</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-800">{dashboardStats.pendingReports}</p>
                    <p className="text-sm text-yellow-600">Pending</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Resolution Progress</span>
                    <span>{dashboardStats.resolutionRate}%</span>
                  </div>
                  <Progress value={dashboardStats.resolutionRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-eco-green-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.category} • {activity.time}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${activity.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${activity.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                          ${activity.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${activity.status === 'legal' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        `}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-eco-green-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <FileText className="h-6 w-6" />
                  <span className="text-xs">Submit New Grievance</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <MapPin className="h-6 w-6" />
                  <span className="text-xs">Track by Location</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <Phone className="h-6 w-6" />
                  <span className="text-xs">Voice Complaint</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-xs">WhatsApp Support</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grievances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grievance Categories Overview</CardTitle>
              <CardDescription>Distribution of grievances across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grievanceCategories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-500">{category.count} total reports</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {category.urgent > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {category.urgent} urgent
                        </Badge>
                      )}
                      <span className="font-bold text-lg">{category.count}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-eco-green-600" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-8 bg-gradient-to-br from-eco-green-50 to-blue-50 rounded-lg">
                    <Globe className="h-16 w-16 text-eco-green-600 mx-auto mb-4" />
                    <p className="text-lg font-semibold">PIN Code Integration Active</p>
                    <p className="text-sm text-gray-600">Real-time mapping across Indian postal system</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xl font-bold text-blue-800">847</p>
                      <p className="text-xs text-blue-600">PIN Codes Covered</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xl font-bold text-green-800">23</p>
                      <p className="text-xs text-green-600">States/UTs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-eco-green-600" />
                  Resolution Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Resolution Time</span>
                    <span className="font-bold">{dashboardStats.avgResolutionTime} days</span>
                  </div>
                  <Progress value={65} className="h-3" />
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Municipal Level: 1-3 days</span>
                      <span>67% cases</span>
                    </div>
                    <div className="flex justify-between">
                      <span>District Level: 5-10 days</span>
                      <span>28% cases</span>
                    </div>
                    <div className="flex justify-between">
                      <span>State Level: 15-30 days</span>
                      <span>5% cases</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-eco-green-600" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-eco-green-600">+23%</div>
                  <p className="text-sm text-gray-600">Increase in grievances resolved this month</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-green-50 rounded">
                      <p className="font-bold text-green-800">{dashboardStats.thisMonthReports}</p>
                      <p className="text-green-600">This Month</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="font-bold text-gray-800">127</p>
                      <p className="text-gray-600">Last Month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-eco-green-600" />
                  Citizen Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{dashboardStats.citizenSatisfaction}%</div>
                    <p className="text-sm text-gray-600">Satisfaction Rate</p>
                  </div>
                  <Progress value={dashboardStats.citizenSatisfaction} className="h-2" />
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span>2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return Rate</span>
                      <span>73%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-eco-green-600" />
                  Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">First Call Resolution</span>
                    <span className="font-bold text-green-600">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Appeal Rate</span>
                    <span className="font-bold text-orange-600">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Escalation Rate</span>
                    <span className="font-bold text-red-600">8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blockchain Verified</span>
                    <span className="font-bold text-blue-600">100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-eco-green-600" />
                  System Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Aadhaar Authentication', status: 'active', uptime: '99.8%' },
                  { name: 'CPGRAMS Integration', status: 'active', uptime: '97.2%' },
                  { name: 'WhatsApp Business API', status: 'active', uptime: '98.5%' },
                  { name: 'SMS Gateway', status: 'active', uptime: '99.1%' },
                  { name: 'Email Service', status: 'active', uptime: '99.9%' }
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-sm">{integration.name}</span>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {integration.uptime}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-eco-green-600" />
                  Multi-Language Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { language: 'Hindi', coverage: '100%', users: '45%' },
                  { language: 'English', coverage: '100%', users: '38%' },
                  { language: 'Bengali', coverage: '95%', users: '8%' },
                  { language: 'Tamil', coverage: '92%', users: '5%' },
                  { language: 'Telugu', coverage: '90%', users: '4%' }
                ].map((lang) => (
                  <div key={lang.language} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{lang.language}</span>
                      <span className="text-gray-600">{lang.users} users</span>
                    </div>
                    <Progress value={parseInt(lang.coverage)} className="h-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact and Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-eco-green-600" />
            24/7 Citizen Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Phone className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium">Helpline</p>
                <p className="text-sm text-gray-600">1800-XXX-XXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-gray-600">+91-XXXXX-XXXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <Mail className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-gray-600">support@jansuvidha.gov.in</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportDashboard;
