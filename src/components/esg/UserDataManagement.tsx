
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  Target, 
  DollarSign, 
  FileText,
  Bell,
  Shield,
  Leaf,
  BarChart3,
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar,
  Briefcase,
  TrendingUp,
  Award,
  Eye,
  Download
} from 'lucide-react';

const UserDataManagement = () => {
  const [activeSection, setActiveSection] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [userProfile, setUserProfile] = useState({
    role: '',
    name: '',
    email: '',
    company: '',
    riskTolerance: 'moderate',
    investmentCapacity: '',
    esgPreferences: [],
    sectorInterests: [],
    investmentGoals: '',
    timeline: ''
  });

  const onboardingSteps = [
    { id: 1, title: 'Role Selection', description: 'Choose your role in the ecosystem' },
    { id: 2, title: 'Personal Info', description: 'Basic information and verification' },
    { id: 3, title: 'Investment Profile', description: 'Risk tolerance and preferences' },
    { id: 4, title: 'ESG Preferences', description: 'Sustainability focus areas' },
    { id: 5, title: 'Goals & Timeline', description: 'Investment objectives' }
  ];

  const roles = [
    { id: 'investor', title: 'Institutional Investor', description: 'VC firms, PE funds, family offices' },
    { id: 'individual', title: 'Individual Investor', description: 'Angel investors, HNIs' },
    { id: 'startup', title: 'Startup Founder', description: 'Seeking funding for circular economy ventures' },
    { id: 'corporate', title: 'Corporate', description: 'Companies looking for sustainable investments' }
  ];

  const esgCategories = [
    'Renewable Energy', 'Waste Management', 'Water Conservation', 'Sustainable Agriculture',
    'Clean Transportation', 'Green Buildings', 'Circular Economy', 'Social Impact',
    'Education Technology', 'Healthcare Access', 'Financial Inclusion', 'Gender Equality'
  ];

  const sectors = [
    'CleanTech', 'AgriTech', 'FinTech', 'HealthTech', 'EdTech', 'Mobility',
    'Materials', 'Energy', 'Water', 'Food & Beverage', 'Manufacturing', 'Services'
  ];

  const portfolioHoldings = [
    {
      id: 1,
      name: 'Green Energy Fund',
      type: 'Mutual Fund',
      amount: '₹5,00,000',
      allocation: 25,
      performance: '+12.5%',
      esgScore: 89,
      carbonFootprint: '2.5 tCO2e'
    },
    {
      id: 2,
      name: 'Sustainable Materials Corp',
      type: 'Direct Equity',
      amount: '₹3,00,000',
      allocation: 15,
      performance: '+18.2%',
      esgScore: 92,
      carbonFootprint: '1.8 tCO2e'
    },
    {
      id: 3,
      name: 'Water Technology ETF',
      type: 'ETF',
      amount: '₹4,00,000',
      allocation: 20,
      performance: '+8.7%',
      esgScore: 85,
      carbonFootprint: '2.1 tCO2e'
    }
  ];

  const impactMetrics = {
    totalCarbonFootprint: '6.4 tCO2e',
    carbonReduction: '15.2 tCO2e',
    socialImpact: {
      jobsSupported: 1250,
      communitiesImpacted: 45,
      peopleReached: 25000
    },
    sdgAlignment: {
      'Climate Action': 85,
      'Clean Water': 72,
      'Decent Work': 68,
      'Sustainable Cities': 79
    }
  };

  const documents = [
    { id: 1, name: 'Investment Certificate - Green Fund', type: 'Certificate', date: '2024-01-15', verified: true },
    { id: 2, name: 'ESG Impact Report Q1 2024', type: 'Report', date: '2024-03-31', verified: true },
    { id: 3, name: 'KYC Documents', type: 'Verification', date: '2024-01-10', verified: true },
    { id: 4, name: 'Risk Assessment Profile', type: 'Assessment', date: '2024-02-20', verified: false }
  ];

  const handleNext = () => {
    if (onboardingStep < 5) {
      setOnboardingStep(onboardingStep + 1);
    }
  };

  const handlePrevious = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const renderOnboardingStep = () => {
    switch (onboardingStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Your Role</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map(role => (
                <Card 
                  key={role.id} 
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    userProfile.role === role.id ? 'ring-2 ring-green-500 border-green-500' : ''
                  }`}
                  onClick={() => setUserProfile({...userProfile, role: role.id})}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{role.title}</h4>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input 
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input 
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
                <Input 
                  value={userProfile.company}
                  onChange={(e) => setUserProfile({...userProfile, company: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Investment Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
                <Select value={userProfile.riskTolerance} onValueChange={(value) => setUserProfile({...userProfile, riskTolerance: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Capacity</label>
                <Select value={userProfile.investmentCapacity} onValueChange={(value) => setUserProfile({...userProfile, investmentCapacity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5L">₹1-5 Lakhs</SelectItem>
                    <SelectItem value="5-25L">₹5-25 Lakhs</SelectItem>
                    <SelectItem value="25L-1Cr">₹25 Lakhs - 1 Crore</SelectItem>
                    <SelectItem value="1Cr+">₹1+ Crore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">ESG Preferences</h3>
            <p className="text-sm text-gray-600">Select your sustainability focus areas</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {esgCategories.map(category => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={userProfile.esgPreferences.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setUserProfile({
                          ...userProfile,
                          esgPreferences: [...userProfile.esgPreferences, category]
                        });
                      } else {
                        setUserProfile({
                          ...userProfile,
                          esgPreferences: userProfile.esgPreferences.filter(pref => pref !== category)
                        });
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Investment Goals & Timeline</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Goals</label>
                <Textarea 
                  value={userProfile.investmentGoals}
                  onChange={(e) => setUserProfile({...userProfile, investmentGoals: e.target.value})}
                  placeholder="Describe your investment objectives..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Timeline</label>
                <Select value={userProfile.timeline} onValueChange={(value) => setUserProfile({...userProfile, timeline: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short-term (1-3 years)</SelectItem>
                    <SelectItem value="medium">Medium-term (3-7 years)</SelectItem>
                    <SelectItem value="long">Long-term (7+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'onboarding', label: 'Onboarding', icon: User },
          { id: 'portfolio', label: 'Portfolio Management', icon: Briefcase },
          { id: 'impact', label: 'Impact Tracking', icon: Leaf },
          { id: 'documents', label: 'Document Vault', icon: FileText },
          { id: 'privacy', label: 'Privacy Settings', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ].map(section => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'default' : 'outline'}
            onClick={() => setActiveSection(section.id)}
            className="flex items-center gap-2"
          >
            <section.icon className="h-4 w-4" />
            {section.label}
          </Button>
        ))}
      </div>

      {/* Multi-step Onboarding */}
      {activeSection === 'onboarding' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Multi-step Onboarding Wizard
            </CardTitle>
            <CardDescription>Complete your profile setup for personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {onboardingSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id === onboardingStep ? 'bg-green-600 text-white' :
                      step.id < onboardingStep ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {step.id < onboardingStep ? <CheckCircle className="h-4 w-4" /> : step.id}
                    </div>
                    {index < onboardingSteps.length - 1 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step.id < onboardingStep ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <h3 className="font-medium text-gray-900">{onboardingSteps[onboardingStep - 1].title}</h3>
                <p className="text-sm text-gray-600">{onboardingSteps[onboardingStep - 1].description}</p>
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-8">
              {renderOnboardingStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={onboardingStep === 1}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext}
                disabled={onboardingStep === 5}
                className="bg-green-600 hover:bg-green-700"
              >
                {onboardingStep === 5 ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Management */}
      {activeSection === 'portfolio' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Portfolio Management Interface
              </CardTitle>
              <CardDescription>Manage your investments and track performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Current Holdings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolioHoldings.map(holding => (
                        <div key={holding.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{holding.name}</h4>
                            <p className="text-sm text-gray-600">{holding.type}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-green-600 font-medium">{holding.performance}</span>
                              <Badge className="bg-blue-100 text-blue-800">ESG: {holding.esgScore}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">{holding.amount}</p>
                            <p className="text-sm text-gray-600">{holding.allocation}% allocation</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Add New Investment
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Portfolio Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Portfolio Value</p>
                        <p className="text-2xl font-bold text-green-600">₹12,00,000</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Overall Performance</p>
                        <p className="text-lg font-semibold text-green-600">+13.8%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Average ESG Score</p>
                        <p className="text-lg font-semibold text-blue-600">88.7</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Carbon Footprint</p>
                        <p className="text-lg font-semibold text-purple-600">{impactMetrics.totalCarbonFootprint}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Impact Tracking */}
      {activeSection === 'impact' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Personal ESG Impact Tracker
              </CardTitle>
              <CardDescription>Monitor your environmental and social impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Environmental Impact</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Carbon Footprint</span>
                      <span className="font-medium text-red-600">{impactMetrics.totalCarbonFootprint}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Carbon Reduction</span>
                      <span className="font-medium text-green-600">{impactMetrics.carbonReduction}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-sm text-gray-600">75% towards carbon neutral goal</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Social Impact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jobs Supported</span>
                      <span className="font-medium">{impactMetrics.socialImpact.jobsSupported.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Communities Impacted</span>
                      <span className="font-medium">{impactMetrics.socialImpact.communitiesImpacted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">People Reached</span>
                      <span className="font-medium">{impactMetrics.socialImpact.peopleReached.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">SDG Alignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(impactMetrics.sdgAlignment).map(([goal, score]) => (
                      <div key={goal} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">{goal}</span>
                          <span className="text-sm text-gray-600">{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Document Vault */}
      {activeSection === 'documents' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Document Vault
            </CardTitle>
            <CardDescription>Secure storage for investment documents and certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.type} • {doc.date}</p>
                    </div>
                    {doc.verified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Upload new documents</p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Settings */}
      {activeSection === 'privacy' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Privacy Settings & Data Management
            </CardTitle>
            <CardDescription>Control your data sharing preferences and privacy settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Data Sharing Preferences</h3>
                <div className="space-y-3">
                  {[
                    { id: 'analytics', label: 'Anonymous analytics data', description: 'Help improve our platform' },
                    { id: 'marketing', label: 'Marketing communications', description: 'Receive updates about new features' },
                    { id: 'portfolio', label: 'Portfolio performance data', description: 'Share anonymized performance metrics' },
                    { id: 'impact', label: 'Impact measurement data', description: 'Contribute to ESG impact research' }
                  ].map(setting => (
                    <div key={setting.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{setting.label}</p>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <Switch />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Account Management</h3>
                <div className="flex gap-3">
                  <Button variant="outline">
                    Export My Data
                  </Button>
                  <Button variant="outline">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {activeSection === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-600" />
              Notification Center
            </CardTitle>
            <CardDescription>Customize your alert preferences and notification settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Investment Alerts</h3>
                <div className="space-y-3">
                  {[
                    { id: 'portfolio', label: 'Portfolio performance updates', description: 'Monthly performance reports' },
                    { id: 'opportunities', label: 'New investment opportunities', description: 'Matching your preferences' },
                    { id: 'market', label: 'Market alerts', description: 'ESG market trends and news' },
                    { id: 'impact', label: 'Impact milestones', description: 'When your investments reach impact goals' }
                  ].map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{alert.label}</p>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                      </div>
                      <Switch />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Communication Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <Bell className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <Switch className="mt-2" />
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Email Reports</p>
                    <Switch className="mt-2" />
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">SMS Alerts</p>
                    <Switch className="mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserDataManagement;
