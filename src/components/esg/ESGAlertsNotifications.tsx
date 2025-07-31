
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Settings,
  Check,
  X,
  Filter,
  Mail,
  MessageSquare
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'deadline' | 'threshold' | 'missing-data' | 'compliance' | 'trend';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  relatedData?: {
    metric: string;
    value: number;
    threshold: number;
    unit: string;
  };
}

interface NotificationSettings {
  email: boolean;
  inApp: boolean;
  sms: boolean;
  deadlines: boolean;
  thresholds: boolean;
  missingData: boolean;
  trends: boolean;
}

const ESGAlertsNotifications = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'threshold',
      priority: 'high',
      title: 'Carbon Emissions Threshold Exceeded',
      message: 'Monthly carbon emissions have exceeded the target threshold by 15%',
      timestamp: '2024-01-30T14:30:00Z',
      read: false,
      actionRequired: true,
      relatedData: {
        metric: 'Carbon Emissions',
        value: 1450,
        threshold: 1260,
        unit: 'tCO2e'
      }
    },
    {
      id: '2',
      type: 'deadline',
      priority: 'medium',
      title: 'GRI Report Due Soon',
      message: 'GRI sustainability report is due in 7 days',
      timestamp: '2024-01-29T09:15:00Z',
      read: false,
      actionRequired: true
    },
    {
      id: '3',
      type: 'missing-data',
      priority: 'medium',
      title: 'Water Usage Data Missing',
      message: 'Water consumption data for Site B is missing for Q4 2023',
      timestamp: '2024-01-28T16:45:00Z',
      read: true,
      actionRequired: true
    },
    {
      id: '4',
      type: 'trend',
      priority: 'low',
      title: 'Positive Waste Reduction Trend',
      message: 'Waste generation has decreased by 8% over the past 3 months',
      timestamp: '2024-01-27T11:20:00Z',
      read: true,
      actionRequired: false,
      relatedData: {
        metric: 'Waste Generation',
        value: 245,
        threshold: 265,
        unit: 'tonnes'
      }
    },
    {
      id: '5',
      type: 'compliance',
      priority: 'high',
      title: 'TCFD Compliance Gap',
      message: 'Climate risk assessment documentation is incomplete',
      timestamp: '2024-01-26T13:10:00Z',
      read: false,
      actionRequired: true
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    inApp: true,
    sms: false,
    deadlines: true,
    thresholds: true,
    missingData: true,
    trends: false
  });

  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Clock className="h-4 w-4" />;
      case 'threshold': return <Target className="h-4 w-4" />;
      case 'missing-data': return <AlertTriangle className="h-4 w-4" />;
      case 'compliance': return <Check className="h-4 w-4" />;
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deadline': return 'text-blue-600 bg-blue-100';
      case 'threshold': return 'text-red-600 bg-red-100';
      case 'missing-data': return 'text-yellow-600 bg-yellow-100';
      case 'compliance': return 'text-purple-600 bg-purple-100';
      case 'trend': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast({
      title: "Alert Dismissed",
      description: "The alert has been removed from your notifications."
    });
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const filteredAlerts = alerts.filter(alert => {
    const typeMatch = filterType === 'all' || alert.type === filterType;
    const priorityMatch = filterPriority === 'all' || alert.priority === filterPriority;
    return typeMatch && priorityMatch;
  });

  const unreadCount = alerts.filter(alert => !alert.read).length;
  const highPriorityCount = alerts.filter(alert => alert.priority === 'high' && !alert.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Alerts & Notifications
          </h3>
          <p className="text-gray-600">Stay informed about critical ESG events and deadlines</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <div className="text-sm text-gray-600">Unread</div>
          </div>
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            Mark All Read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="alerts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type-filter">Alert Type</Label>
                  <select 
                    id="type-filter"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="all">All Types</option>
                    <option value="deadline">Deadlines</option>
                    <option value="threshold">Thresholds</option>
                    <option value="missing-data">Missing Data</option>
                    <option value="compliance">Compliance</option>
                    <option value="trend">Trends</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority-filter">Priority</Label>
                  <select 
                    id="priority-filter"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert List */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No alerts match your current filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`${getPriorityColor(alert.priority)} ${!alert.read ? 'ring-2 ring-blue-200' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(alert.type)}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(alert.type)}>
                              {alert.type.replace('-', ' ')}
                            </Badge>
                            <Badge className={`${getPriorityColor(alert.priority)} border`}>
                              {alert.priority}
                            </Badge>
                            {!alert.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700">{alert.message}</p>
                        
                        {alert.relatedData && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Current:</span>
                                <span className="font-medium ml-1">
                                  {alert.relatedData.value} {alert.relatedData.unit}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Target:</span>
                                <span className="font-medium ml-1">
                                  {alert.relatedData.threshold} {alert.relatedData.unit}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Variance:</span>
                                <span className="font-medium ml-1">
                                  {Math.round(((alert.relatedData.value - alert.relatedData.threshold) / alert.relatedData.threshold) * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            {!alert.read && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => markAsRead(alert.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Mark Read
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => dismissAlert(alert.id)}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Notification Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                <Switch 
                  id="email-notifications"
                  checked={settings.email}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                </div>
                <Switch 
                  id="in-app-notifications"
                  checked={settings.inApp}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, inApp: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                </div>
                <Switch 
                  id="sms-notifications"
                  checked={settings.sms}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sms: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <Label htmlFor="deadline-alerts">Deadline Alerts</Label>
                </div>
                <Switch 
                  id="deadline-alerts"
                  checked={settings.deadlines}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, deadlines: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <Label htmlFor="threshold-alerts">Threshold Alerts</Label>
                </div>
                <Switch 
                  id="threshold-alerts"
                  checked={settings.thresholds}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, thresholds: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <Label htmlFor="missing-data-alerts">Missing Data Alerts</Label>
                </div>
                <Switch 
                  id="missing-data-alerts"
                  checked={settings.missingData}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, missingData: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <Label htmlFor="trend-alerts">Trend Alerts</Label>
                </div>
                <Switch 
                  id="trend-alerts"
                  checked={settings.trends}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, trends: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carbon-threshold">Carbon Emissions (tCO2e)</Label>
                  <Input id="carbon-threshold" type="number" placeholder="1500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="water-threshold">Water Usage (m³)</Label>
                  <Input id="water-threshold" type="number" placeholder="10000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waste-threshold">Waste Generation (tonnes)</Label>
                  <Input id="waste-threshold" type="number" placeholder="500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="energy-threshold">Energy Usage (MWh)</Label>
                  <Input id="energy-threshold" type="number" placeholder="2000" />
                </div>
              </div>
              <Button className="w-full">Save Threshold Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESGAlertsNotifications;
