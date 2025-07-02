
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, TrendingUp, Users, Shield, BookOpen, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MicroFinanceDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creditScore, setCreditScore] = useState<any>(null);

  // Fetch user's credit score - using type assertion
  const { data: aiCreditScore } = useQuery({
    queryKey: ['ai-credit-score', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      try {
        const { data, error } = await (supabase as any)
          .from('ai_credit_scores')
          .select('*')
          .eq('user_id', user.id)
          .order('last_calculated', { ascending: false })
          .limit(1)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
      } catch (error) {
        console.log('Error fetching credit score:', error);
        return null;
      }
    },
    enabled: !!user?.id,
  });

  // Fetch user's loans - using type assertion
  const { data: loans = [] } = useQuery({
    queryKey: ['microfinance-loans', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        const { data, error } = await (supabase as any)
          .from('microfinance_loans')
          .select('*')
          .eq('borrower_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.log('Error fetching loans:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Fetch user's lending circles - using type assertion
  const { data: circles = [] } = useQuery({
    queryKey: ['lending-circles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        const { data, error } = await (supabase as any)
          .from('circle_memberships')
          .select(`
            *,
            lending_circles (*)
          `)
          .eq('member_id', user.id);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.log('Error fetching circles:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Fetch risk alerts - using type assertion
  const { data: riskAlerts = [] } = useQuery({
    queryKey: ['risk-alerts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        const { data, error } = await (supabase as any)
          .from('risk_monitoring_alerts')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.log('Error fetching risk alerts:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Fetch education progress - using type assertion
  const { data: educationProgress = [] } = useQuery({
    queryKey: ['education-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        const { data, error } = await (supabase as any)
          .from('financial_education_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.log('Error fetching education progress:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      defaulted: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Micro-Finance Dashboard</h1>
          <p className="text-gray-600">AI-powered financial inclusion platform</p>
        </div>

        {/* Credit Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Credit Score
              </CardTitle>
              <CardDescription>Your comprehensive creditworthiness assessment</CardDescription>
            </CardHeader>
            <CardContent>
              {aiCreditScore ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">Overall Score</span>
                    <span className={`text-3xl font-bold ${getScoreColor(aiCreditScore.overall_score)}`}>
                      {aiCreditScore.overall_score}
                    </span>
                  </div>
                  <Progress value={(aiCreditScore.overall_score / 850) * 100} className="h-3" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Traditional Credit</p>
                      <p className="font-medium">{aiCreditScore.traditional_credit_score || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Alternative Data</p>
                      <p className="font-medium">{aiCreditScore.alternative_data_score}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Social Score</p>
                      <p className="font-medium">{aiCreditScore.social_score || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Confidence Level</p>
                      <p className="font-medium">{(aiCreditScore.confidence_level * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No credit score available</p>
                  <Button>Generate Credit Score</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {riskAlerts.length > 0 ? (
                <div className="space-y-3">
                  {riskAlerts.slice(0, 3).map((alert: any) => (
                    <div key={alert.id} className="p-3 bg-yellow-50 rounded-lg">
                      <p className="font-medium text-sm">{alert.alert_type}</p>
                      <p className="text-xs text-gray-600">{alert.description}</p>
                      <Badge variant="outline" className="mt-1">
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No active alerts</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="loans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="loans">My Loans</TabsTrigger>
            <TabsTrigger value="circles">Lending Circles</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="loans" className="space-y-6">
            <div className="grid gap-6">
              {loans.length > 0 ? (
                loans.map((loan: any) => (
                  <Card key={loan.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{loan.purpose}</CardTitle>
                        <Badge className={getStatusBadge(loan.status)}>
                          {loan.status}
                        </Badge>
                      </div>
                      <CardDescription>{loan.loan_type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Loan Amount</p>
                          <p className="font-medium">₹{loan.loan_amount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Interest Rate</p>
                          <p className="font-medium">{(loan.interest_rate * 100).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Term</p>
                          <p className="font-medium">{loan.term_months} months</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Outstanding</p>
                          <p className="font-medium">₹{loan.outstanding_balance?.toLocaleString() || '0'}</p>
                        </div>
                      </div>
                      {loan.outstanding_balance && loan.total_repayment && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Repayment Progress</span>
                            <span>{Math.round(((loan.total_repayment - loan.outstanding_balance) / loan.total_repayment) * 100)}%</span>
                          </div>
                          <Progress 
                            value={((loan.total_repayment - loan.outstanding_balance) / loan.total_repayment) * 100} 
                            className="h-2" 
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500 mb-4">No loans found</p>
                    <Button>Apply for Loan</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="circles" className="space-y-6">
            <div className="grid gap-6">
              {circles.length > 0 ? (
                circles.map((membership: any) => (
                  <Card key={membership.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{membership.lending_circles?.circle_name}</CardTitle>
                        <Badge variant="outline">{membership.role}</Badge>
                      </div>
                      <CardDescription>{membership.lending_circles?.circle_type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Current Members</p>
                          <p className="font-medium">{membership.lending_circles?.current_members}/{membership.lending_circles?.max_members}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Success Rate</p>
                          <p className="font-medium">{(membership.lending_circles?.success_rate * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Your Contribution</p>
                          <p className="font-medium">₹{membership.contribution_amount?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Attendance Rate</p>
                          <p className="font-medium">{(membership.attendance_rate * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No lending circles joined</p>
                    <Button>Join a Circle</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="grid gap-6">
              {educationProgress.length > 0 ? (
                educationProgress.map((progress: any) => (
                  <Card key={progress.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {progress.module_name}
                      </CardTitle>
                      <CardDescription>{progress.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium">{(progress.progress_percentage * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={progress.progress_percentage * 100} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Time Spent: {progress.time_spent_minutes} mins</span>
                          <span className="text-gray-600">Points: {progress.points_earned}</span>
                        </div>
                        {progress.badges_earned && progress.badges_earned.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {progress.badges_earned.map((badge: string, index: number) => (
                              <Badge key={index} variant="secondary">{badge}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Start your financial education journey</p>
                    <Button>Browse Courses</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Profile Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Phone Verification</span>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Complete Profile Setup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MicroFinanceDashboard;
