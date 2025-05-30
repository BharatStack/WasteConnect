
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Users, FileText, BarChart3, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ComplianceReport {
  id: string;
  producer_id: string;
  compliance_period_start: string;
  compliance_period_end: string;
  status: string;
  compliance_data: any;
  created_at: string;
  producer_profile?: {
    full_name: string | null;
    email: string;
    user_type: string;
  } | null;
}

interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  created_at: string;
  user_id: string;
  metadata: any;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  user_type: string;
  verification_status: string;
  created_at: string;
  phone_verified: boolean;
}

const GovernmentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    complianceReports: 0,
    auditEvents: 0
  });

  useEffect(() => {
    if (user) {
      fetchGovernmentData();
    }
  }, [user]);

  const fetchGovernmentData = async () => {
    try {
      // Fetch compliance reports with manual join using producer_id
      const { data: compliance, error: complianceError } = await supabase
        .from('producer_compliance')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      let complianceWithProfiles: ComplianceReport[] = [];

      if (complianceError) {
        console.error('Compliance query error:', complianceError);
        setComplianceReports([]);
      } else if (compliance) {
        // Manually fetch producer profiles for each compliance report
        const profilePromises = compliance.map(async (report) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email, user_type')
            .eq('id', report.producer_id)
            .single();

          return {
            ...report,
            producer_profile: profile
          };
        });

        complianceWithProfiles = await Promise.all(profilePromises);
        setComplianceReports(complianceWithProfiles);
      }

      // Fetch audit logs
      const { data: audit } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch user profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setAuditLogs(audit || []);
      setUserProfiles(profiles || []);

      // Calculate stats
      const pendingVerifications = profiles?.filter(p => p.verification_status === 'pending').length || 0;
      const totalReports = complianceWithProfiles.length;
      const totalAuditEvents = audit?.length || 0;

      setStats({
        totalUsers: profiles?.length || 0,
        pendingVerifications,
        complianceReports: totalReports,
        auditEvents: totalAuditEvents
      });

    } catch (error) {
      console.error('Error fetching government data:', error);
      toast({
        title: "Error",
        description: "Failed to load government dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: status })
        .eq('id', userId);

      if (error) throw error;

      // Create audit log
      await supabase.rpc('create_audit_log', {
        p_action: `user_verification_${status}`,
        p_resource_type: 'user',
        p_resource_id: userId,
        p_metadata: { reviewed_by: user?.id }
      });

      toast({
        title: "User Verification Updated",
        description: `User has been ${status}.`,
      });

      fetchGovernmentData();
    } catch (error) {
      console.error('Error updating user verification:', error);
      toast({
        title: "Error",
        description: "Failed to update user verification.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-eco-green-600" />
            Government Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Monitor compliance, verify users, and oversee platform activities</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-eco-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Reports</CardTitle>
              <FileText className="h-4 w-4 text-eco-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.complianceReports}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audit Events</CardTitle>
              <BarChart3 className="h-4 w-4 text-eco-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.auditEvents}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Verification</CardTitle>
                <CardDescription>Review and verify user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Phone Verified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userProfiles.slice(0, 10).map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>{profile.full_name || 'N/A'}</TableCell>
                        <TableCell>{profile.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{profile.user_type}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(profile.verification_status)}</TableCell>
                        <TableCell>
                          {profile.phone_verified ? 
                            <Badge variant="default" className="bg-green-500">Verified</Badge> : 
                            <Badge variant="secondary">Unverified</Badge>
                          }
                        </TableCell>
                        <TableCell>
                          {profile.verification_status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600"
                                onClick={() => handleVerifyUser(profile.id, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600"
                                onClick={() => handleVerifyUser(profile.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports</CardTitle>
                <CardDescription>Review producer compliance submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producer</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.producer_profile?.full_name || 'Unknown'}</TableCell>
                        <TableCell>
                          {new Date(report.compliance_period_start).toLocaleDateString()} - {new Date(report.compliance_period_end).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>Monitor platform activities and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.resource_type}</TableCell>
                        <TableCell>{log.user_id ? log.user_id.substring(0, 8) + '...' : 'System'}</TableCell>
                        <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          {log.metadata && (
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Overview of platform usage and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">User Distribution</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        userProfiles.reduce((acc, profile) => {
                          acc[profile.user_type] = (acc[profile.user_type] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span className="capitalize">{type}</span>
                          <span className="font-mono">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Verification Status</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        userProfiles.reduce((acc, profile) => {
                          acc[profile.verification_status] = (acc[profile.verification_status] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([status, count]) => (
                        <div key={status} className="flex justify-between">
                          <span className="capitalize">{status}</span>
                          <span className="font-mono">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
