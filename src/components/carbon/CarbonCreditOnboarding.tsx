
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Shield, UserCheck, CreditCard } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const CarbonCreditOnboarding = ({ onComplete }: OnboardingProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    aadhaar_number: '',
    role: 'individual' as 'individual' | 'community' | 'organization' | 'municipal',
    bank_account_number: '',
    ifsc_code: '',
    address_verified: false,
    terms_accepted: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    if (!formData.terms_accepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create carbon credit profile
      const { error: profileError } = await supabase
        .from('carbon_credit_profiles')
        .insert({
          user_id: user.id,
          aadhaar_number: formData.aadhaar_number,
          role: formData.role,
          bank_account_number: formData.bank_account_number,
          ifsc_code: formData.ifsc_code,
          address_verified: formData.address_verified,
          onboarding_completed: true,
          terms_accepted_at: new Date().toISOString(),
          kyc_status: 'pending' as const
        });

      if (profileError) throw profileError;

      // Create initial user stats
      const { error: statsError } = await supabase
        .from('user_stats')
        .insert({
          user_id: user.id,
          total_credits_earned: 0,
          total_credits_traded: 0,
          total_earnings: 0,
          current_streak: 0,
          longest_streak: 0,
          total_activities: 0,
          total_waste_processed: 0,
          co2_saved: 0,
          level_points: 0,
          current_level: 1
        });

      if (statsError) throw statsError;

      // Create welcome achievement
      await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_type: 'welcome',
          achievement_name: 'Welcome to Carbon Trading',
          description: 'Completed onboarding and joined the carbon credit community',
          points_earned: 100
        });

      toast({
        title: "Setup Complete!",
        description: "Welcome to the carbon credit trading platform!",
      });

      onComplete();
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Leaf className="h-16 w-16 text-eco-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Carbon Credit Trading</h2>
              <p className="text-gray-600 mt-2">Transform your waste activities into valuable carbon credits</p>
            </div>
            <div className="grid gap-4 text-sm">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-eco-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Secure & Transparent</p>
                  <p className="text-gray-600">All activities are verified and recorded on a secure platform</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserCheck className="h-5 w-5 text-eco-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Community Driven</p>
                  <p className="text-gray-600">Join thousands of users making a positive environmental impact</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-eco-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Earn Real Money</p>
                  <p className="text-gray-600">Convert your environmental efforts into financial rewards</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="aadhaar">Aadhaar Number (Optional)</Label>
                <Input
                  id="aadhaar"
                  type="text"
                  placeholder="Enter your Aadhaar number"
                  value={formData.aadhaar_number}
                  onChange={(e) => handleInputChange('aadhaar_number', e.target.value)}
                  maxLength={12}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Aadhaar helps with identity verification for higher-tier activities
                </p>
              </div>
              <div>
                <Label htmlFor="role">Account Type</Label>
                <Select value={formData.role} onValueChange={(value: 'individual' | 'community' | 'organization' | 'municipal') => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="community">Community Group</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                    <SelectItem value="municipal">Municipal Authority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bank_account">Bank Account Number</Label>
                <Input
                  id="bank_account"
                  type="text"
                  placeholder="Enter your bank account number"
                  value={formData.bank_account_number}
                  onChange={(e) => handleInputChange('bank_account_number', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input
                  id="ifsc"
                  type="text"
                  placeholder="Enter IFSC code"
                  value={formData.ifsc_code}
                  onChange={(e) => handleInputChange('ifsc_code', e.target.value.toUpperCase())}
                  maxLength={11}
                />
              </div>
              <p className="text-sm text-gray-500">
                Payment details are required to receive earnings from carbon credit sales
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="address_verified"
                  checked={formData.address_verified}
                  onCheckedChange={(checked) => handleInputChange('address_verified', checked)}
                />
                <Label htmlFor="address_verified" className="text-sm">
                  I confirm that my address information is accurate and verifiable
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms_accepted"
                  checked={formData.terms_accepted}
                  onCheckedChange={(checked) => handleInputChange('terms_accepted', checked)}
                />
                <Label htmlFor="terms_accepted" className="text-sm">
                  I agree to the Terms of Service and Privacy Policy for the Carbon Credit Trading platform
                </Label>
              </div>
              <div className="bg-eco-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-eco-green-800 mb-2">Key Points:</h3>
                <ul className="text-sm text-eco-green-700 space-y-1">
                  <li>• All waste activities must be genuine and verifiable</li>
                  <li>• Carbon credits are calculated based on verified environmental impact</li>
                  <li>• Trading is subject to platform fees and regulations</li>
                  <li>• False reporting may result in account suspension</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Setup Your Carbon Credit Account</CardTitle>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 4
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-eco-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-eco-green-600 hover:bg-eco-green-700"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isLoading || !formData.terms_accepted}
                className="bg-eco-green-600 hover:bg-eco-green-700"
              >
                {isLoading ? "Setting up..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonCreditOnboarding;
