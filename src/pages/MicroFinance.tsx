
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain,
  Zap,
  Users,
  GraduationCap,
  Smartphone,
  Fingerprint,
  MessageSquare,
  Building,
  Shield,
  DollarSign,
  Satellite,
  TrendingUp,
  AlertTriangle,
  Gamepad2,
  Globe,
  BarChart3,
  CreditCard,
  UserCheck,
  MapPin,
  Calendar,
  Star,
  Award,
  Target,
  CheckCircle,
  Clock,
  RefreshCw,
  PhoneCall,
  FileText,
  Settings
} from 'lucide-react';

interface LoanApplication {
  id: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  creditScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  repaymentPlan: string;
}

const MicroFinance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [creditScore, setCreditScore] = useState(750);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
      simulateData();
    }
  }, [user]);

  const fetchUserData = async () => {
    // Simulate user profile fetch
    setUserProfile({
      name: 'John Doe',
      phone: '+91-9876543210',
      location: 'Mumbai, Maharashtra',
      occupation: 'Small Business Owner',
      monthlyIncome: 35000,
      creditScore: 750,
      kycStatus: 'verified',
      financialHealthScore: 82
    });
    setIsLoading(false);
  };

  const simulateData = () => {
    setLoanApplications([
      {
        id: '1',
        amount: 50000,
        purpose: 'Business Expansion',
        status: 'approved',
        creditScore: 750,
        riskLevel: 'low',
        repaymentPlan: '12 months'
      },
      {
        id: '2',
        amount: 25000,
        purpose: 'Equipment Purchase',
        status: 'disbursed',
        creditScore: 720,
        riskLevel: 'medium',
        repaymentPlan: '6 months'
      }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'disbursed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI-Powered Micro-Finance Platform</h1>
              <p className="text-blue-100">
                Revolutionizing financial inclusion through artificial intelligence and blockchain technology
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{creditScore}</div>
                <div className="text-sm text-blue-200">AI Credit Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹75,000</div>
                <div className="text-sm text-blue-200">Available Credit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-blue-200">Active Loans</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="ai-features" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Features)
            </TabsTrigger>
            <TabsTrigger value="loans" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Loans
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Services
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Financial Health Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">82/100</div>
                  <Progress value={82} className="mt-2" />
                  <p className="text-xs text-muted-foreground">Excellent financial health</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹4,200</div>
                  <p className="text-xs text-muted-foreground">Due in 5 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹75,000</div>
                  <p className="text-xs text-muted-foreground">Across 2 loans</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rewards Points</CardTitle>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,245</div>
                  <p className="text-xs text-muted-foreground">Redeem for benefits</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Loans */}
            <Card>
              <CardHeader>
                <CardTitle>Your Loan Portfolio</CardTitle>
                <CardDescription>Track your active loans and payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loanApplications.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{loan.purpose}</h4>
                          <p className="text-sm text-gray-600">₹{loan.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(loan.status)}>
                          {loan.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">Risk: <span className={getRiskColor(loan.riskLevel)}>{loan.riskLevel}</span></p>
                          <p className="text-xs text-gray-600">{loan.repaymentPlan}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Features Tab */}
          <TabsContent value="ai-features" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    AI Credit Scoring
                  </CardTitle>
                  <CardDescription>
                    Alternative credit assessment using behavioral patterns and social data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Social Media Score</span>
                      <span className="font-medium">85/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mobile Data Score</span>
                      <span className="font-medium">78/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Behavioral Score</span>
                      <span className="font-medium">82/100</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      Update Credit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Instant Loan Processing
                  </CardTitle>
                  <CardDescription>
                    Get loan approval within minutes using machine learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium">Average Approval Time</p>
                      <p className="text-2xl font-bold text-green-600">3.2 minutes</p>
                    </div>
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                      Apply for Instant Loan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-purple-600" />
                    Dynamic Interest Rates
                  </CardTitle>
                  <CardDescription>
                    AI-adjusted rates based on real-time risk assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="font-medium">Your Current Rate</p>
                      <p className="text-2xl font-bold text-purple-600">8.5% APR</p>
                      <p className="text-sm text-gray-600">Updated daily</p>
                    </div>
                    <Button className="w-full" variant="outline">
                      View Rate History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="h-5 w-5 text-green-600" />
                    Satellite Income Verification
                  </CardTitle>
                  <CardDescription>
                    Crop monitoring and agricultural income assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Crop Health Score</span>
                      <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Seasonal Income</span>
                      <span className="font-medium">₹45,000</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      Update Farm Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Default Prevention AI
                  </CardTitle>
                  <CardDescription>
                    Early warning system to prevent loan defaults
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Payment pattern: Excellent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Income stability: Good</span>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-700">Default Risk: Very Low</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fingerprint className="h-5 w-5 text-indigo-600" />
                    Biometric Security
                  </CardTitle>
                  <CardDescription>
                    Advanced biometric authentication for secure transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-indigo-50 rounded">
                        <Fingerprint className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                        <p className="text-xs">Fingerprint</p>
                      </div>
                      <div className="text-center p-2 bg-indigo-50 rounded">
                        <UserCheck className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                        <p className="text-xs">Face ID</p>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      Setup Biometrics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Loans Tab */}
          <TabsContent value="loans" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Apply for New Loan</CardTitle>
                  <CardDescription>Get instant pre-approval with AI assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex-col gap-2">
                      <Building className="h-6 w-6" />
                      Business Loan
                    </Button>
                    <Button className="h-20 flex-col gap-2" variant="outline">
                      <Users className="h-6 w-6" />
                      Personal Loan
                    </Button>
                    <Button className="h-20 flex-col gap-2" variant="outline">
                      <Satellite className="h-6 w-6" />
                      Agricultural Loan
                    </Button>
                    <Button className="h-20 flex-col gap-2" variant="outline">
                      <CreditCard className="h-6 w-6" />
                      Emergency Loan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loan Calculator</CardTitle>
                  <CardDescription>Calculate your EMI with dynamic rates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Loan Amount</label>
                    <div className="text-2xl font-bold">₹50,000</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Interest Rate</label>
                    <div className="text-lg">8.5% APR</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">EMI</label>
                    <div className="text-xl font-bold text-blue-600">₹4,347/month</div>
                  </div>
                  <Button className="w-full">Get Detailed Quote</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Lending Circles
                  </CardTitle>
                  <CardDescription>
                    Join peer-to-peer group lending with social collateral
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Mumbai SME Circle</h4>
                        <p className="text-sm text-gray-600">12 active members</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Women Entrepreneurs</h4>
                        <p className="text-sm text-gray-600">8 active members</p>
                      </div>
                      <Button size="sm" variant="outline">Join</Button>
                    </div>
                  </div>
                  <Button className="w-full">Create New Circle</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Community Support
                  </CardTitle>
                  <CardDescription>
                    24/7 AI chatbot and peer support network
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat with AI Assistant
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Voice Support (Hindi/English)
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Community Forum
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Financial Literacy Hub
                </CardTitle>
                <CardDescription>
                  Personalized education modules and gamified learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Gamepad2 className="h-5 w-5 text-purple-600" />
                      <h4 className="font-medium">Budget Master</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Learn budgeting through interactive games</p>
                    <Progress value={75} className="mb-2" />
                    <p className="text-xs">75% Complete</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-medium">Credit Champion</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Master credit management</p>
                    <Progress value={60} className="mb-2" />
                    <p className="text-xs">60% Complete</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Investment Pro</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Learn smart investing</p>
                    <Progress value={30} className="mb-2" />
                    <p className="text-xs">30% Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Micro-Insurance
                  </CardTitle>
                  <CardDescription>
                    Bundled insurance products with your loans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Explore Insurance</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    Remittance Services
                  </CardTitle>
                  <CardDescription>
                    Low-cost international money transfers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Send Money</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    Mobile Wallet
                  </CardTitle>
                  <CardDescription>
                    Digital wallet with cash-to-digital conversion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Setup Wallet</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MicroFinance;
