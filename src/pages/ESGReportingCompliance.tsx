
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { FileText, Building, Users, Database, BarChart3, Brain, Network, Thermometer, Shield, CheckCircle } from 'lucide-react';
import ESGComplianceAuth from '@/components/esg/ESGComplianceAuth';
import ESGDataCollection from '@/components/esg/ESGDataCollection';
import ESGReportingTools from '@/pages/ESGReportingTools';

const ESGReportingCompliance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [esgProfile, setEsgProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'auth' | 'profile' | 'data-collection' | 'tools'>('auth');

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        // Check if user has a profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setUserProfile(profile);

        if (profile && profile.full_name) {
          // Check if user has ESG profile
          const { data: esgData } = await supabase
            .from('esg_user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          setEsgProfile(esgData);

          if (esgData && esgData.onboarding_completed) {
            setCurrentStep('tools');
          } else if (esgData) {
            setCurrentStep('data-collection');
          } else {
            setCurrentStep('profile');
          }
        } else {
          setCurrentStep('profile');
        }
      } else {
        setCurrentStep('auth');
      }
      setIsLoading(false);
    };

    checkUserStatus();
  }, [user]);

  const handleAuthComplete = () => {
    setCurrentStep('profile');
  };

  const handleProfileComplete = () => {
    setCurrentStep('data-collection');
  };

  const handleDataCollectionComplete = () => {
    setCurrentStep('tools');
    toast({
      title: "Setup Complete",
      description: "You can now access the ESG Reporting & Compliance tools.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (currentStep === 'tools') {
    return <ESGReportingTools />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 mr-4" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                ESG Reporting & Compliance
              </h1>
            </div>
            <p className="text-green-100 text-xl max-w-3xl mx-auto">
              Automated ESG reporting platform with regulatory compliance tracking and advanced analytics
            </p>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-blue-900 mb-2">Trading Floor</h3>
              <p className="text-sm text-blue-700">Real-time ESG performance monitoring and analytics dashboard</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Brain className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-purple-900 mb-2">AI Copilot</h3>
              <p className="text-sm text-purple-700">Intelligent ESG analysis with predictive insights and recommendations</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Network className="h-10 w-10 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-orange-900 mb-2">Supply Chain</h3>
              <p className="text-sm text-orange-700">End-to-end supply chain ESG tracking and compliance management</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Database className="h-10 w-10 text-teal-600 mx-auto mb-4" />
              <h3 className="font-semibold text-teal-900 mb-2">Data Hub</h3>
              <p className="text-sm text-teal-700">Centralized ESG data collection with IoT integration and validation</p>
            </CardContent>
          </Card>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'auth' && (
            <Card className="shadow-xl bg-white/70 backdrop-blur-sm border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl text-green-800 mb-2">Get Started</CardTitle>
                <CardDescription className="text-lg">
                  Create your account to access our comprehensive ESG reporting platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ESGComplianceAuth onComplete={handleAuthComplete} />
              </CardContent>
            </Card>
          )}

          {(currentStep === 'profile' || currentStep === 'data-collection') && (
            <Card className="shadow-xl bg-white/70 backdrop-blur-sm border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl text-green-800 mb-2">
                  {currentStep === 'profile' ? 'Complete Your Profile' : 'ESG Data Collection'}
                </CardTitle>
                <CardDescription className="text-lg">
                  {currentStep === 'profile' 
                    ? 'Help us understand your organization for personalized ESG insights' 
                    : 'Provide your ESG data for detailed analysis and reporting'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ESGDataCollection 
                  onProfileComplete={handleProfileComplete}
                  onDataComplete={handleDataCollectionComplete}
                  currentStep={currentStep}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Platform Benefits */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Regulatory Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Stay compliant with global ESG frameworks including GRI, SASB, TCFD, and CSRD standards with automated reporting.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Advanced Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Leverage AI-powered analytics for predictive insights, risk assessment, and strategic ESG decision-making.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-600" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Enterprise-grade security with SOC 2 Type II compliance, end-to-end encryption, and comprehensive audit trails.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ESGReportingCompliance;
