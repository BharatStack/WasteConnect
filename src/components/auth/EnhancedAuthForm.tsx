
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, Phone } from 'lucide-react';

interface EnhancedAuthFormProps {
  onSuccess: () => void;
}

const EnhancedAuthForm = ({ onSuccess }: EnhancedAuthFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'auth' | 'phone' | 'verification'>('auth');
  
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    user_type: 'individual' as 'individual' | 'business' | 'processor' | 'collector' | 'government',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const [phoneVerification, setPhoneVerification] = useState({
    code: '',
    isVerifying: false
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
        options: {
          data: {
            full_name: authData.full_name,
            user_type: authData.user_type
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Update profile with additional information
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: authData.full_name,
            phone: authData.phone,
            address: authData.address,
            city: authData.city,
            state: authData.state,
            zip_code: authData.zip_code,
            user_type: authData.user_type
          })
          .eq('id', data.user.id);

        if (profileError) throw profileError;

        // Create audit log
        await supabase.rpc('create_audit_log', {
          p_action: 'user_signup_completed',
          p_resource_type: 'user',
          p_resource_id: data.user.id,
          p_metadata: { 
            user_type: authData.user_type,
            verification_required: authData.user_type === 'business' || authData.user_type === 'government'
          }
        });

        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully!",
        });

        if (authData.phone) {
          setStep('phone');
        } else {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authData.email,
        password: authData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Update last login time
        await supabase
          .from('profiles')
          .update({ 
            last_login_at: new Date().toISOString(),
            failed_login_attempts: 0
          })
          .eq('id', data.user.id);

        // Create audit log
        await supabase.rpc('create_audit_log', {
          p_action: 'user_login',
          p_resource_type: 'user',
          p_resource_id: data.user.id
        });

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });

        onSuccess();
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle failed login attempts
      if (error.message.includes('Invalid login credentials')) {
        // In a real app, you'd increment failed_login_attempts
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed", 
          description: error.message || "Failed to sign in. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneVerification(prev => ({ ...prev, isVerifying: true }));

    try {
      // In a real implementation, you would verify the SMS code here
      // For demo purposes, we'll simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mark phone as verified
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ phone_verified: true })
          .eq('id', user.id);

        // Create audit log
        await supabase.rpc('create_audit_log', {
          p_action: 'phone_verified',
          p_resource_type: 'user',
          p_resource_id: user.id
        });
      }

      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully!",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPhoneVerification(prev => ({ ...prev, isVerifying: false }));
    }
  };

  if (step === 'phone') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Phone className="h-5 w-5 text-eco-green-600" />
            Phone Verification
          </CardTitle>
          <CardDescription>
            We've sent a verification code to {authData.phone}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePhoneVerification} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification_code">Verification Code</Label>
              <Input
                id="verification_code"
                type="text"
                placeholder="Enter 6-digit code"
                value={phoneVerification.code}
                onChange={(e) => setPhoneVerification(prev => ({ ...prev, code: e.target.value }))}
                maxLength={6}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-eco-green-600 hover:bg-eco-green-700"
              disabled={phoneVerification.isVerifying || phoneVerification.code.length !== 6}
            >
              {phoneVerification.isVerifying ? "Verifying..." : "Verify Phone"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => onSuccess()}
            >
              Skip for Now
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-eco-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-eco-green-700">
            <Shield className="h-6 w-6" />
            WasteConnect Authentication
          </CardTitle>
          <CardDescription>
            Secure access to the waste management platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin_email">Email</Label>
                  <Input
                    id="signin_email"
                    type="email"
                    value={authData.email}
                    onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin_password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin_password"
                      type={showPassword ? "text" : "password"}
                      value={authData.password}
                      onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={authData.full_name}
                      onChange={(e) => setAuthData(prev => ({ ...prev, full_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup_email">Email</Label>
                    <Input
                      id="signup_email"
                      type="email"
                      value={authData.email}
                      onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup_password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup_password"
                        type={showPassword ? "text" : "password"}
                        value={authData.password}
                        onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={authData.phone}
                      onChange={(e) => setAuthData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="user_type">Account Type</Label>
                    <Select value={authData.user_type} onValueChange={(value: any) => setAuthData(prev => ({ ...prev, user_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="processor">Waste Processor</SelectItem>
                        <SelectItem value="collector">Waste Collector</SelectItem>
                        <SelectItem value="government">Government Official</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={authData.address}
                      onChange={(e) => setAuthData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={authData.city}
                      onChange={(e) => setAuthData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={authData.state}
                      onChange={(e) => setAuthData(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      value={authData.zip_code}
                      onChange={(e) => setAuthData(prev => ({ ...prev, zip_code: e.target.value }))}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAuthForm;
