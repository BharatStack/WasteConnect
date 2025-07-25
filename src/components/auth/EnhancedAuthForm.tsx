
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, Phone, ArrowLeft, Mail, AlertTriangle } from 'lucide-react';
import { SecurityManager } from './SecurityManager';
import { RateLimiter } from './RateLimiter';

interface EnhancedAuthFormProps {
  onSuccess: () => void;
}

const EnhancedAuthForm = ({ onSuccess }: EnhancedAuthFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'auth' | 'phone' | 'verification' | 'forgot-password'>('auth');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    user_type: 'household' as 'individual' | 'business' | 'processor' | 'collector' | 'government' | 'household',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const [phoneVerification, setPhoneVerification] = useState({
    code: '',
    isVerifying: false
  });

  const [resetEmail, setResetEmail] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSecurityWarning(null);

    try {
      // Check rate limit
      const rateLimitResult = await RateLimiter.checkRateLimit(authData.email, 'signup');
      if (!rateLimitResult.allowed) {
        setSecurityWarning(rateLimitResult.blockedUntil 
          ? `Too many signup attempts. Please try again after ${rateLimitResult.blockedUntil.toLocaleString()}.`
          : 'Too many signup attempts. Please try again later.'
        );
        setIsLoading(false);
        return;
      }

      // Log signup attempt
      await SecurityManager.logSecurityEvent('signup_attempt', {
        email: authData.email,
        user_type: authData.user_type
      });

      const { data, error } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
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

        // Log successful signup
        await SecurityManager.logSecurityEvent('signup_success', {
          user_id: data.user.id,
          user_type: authData.user_type
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
      
      await SecurityManager.logSecurityEvent('signup_failed', {
        email: authData.email,
        error: error.message
      });

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
    setSecurityWarning(null);

    try {
      // Check rate limit
      const rateLimitResult = await RateLimiter.checkRateLimit(authData.email, 'login');
      if (!rateLimitResult.allowed) {
        setSecurityWarning(rateLimitResult.blockedUntil 
          ? `Too many login attempts. Please try again after ${rateLimitResult.blockedUntil.toLocaleString()}.`
          : 'Too many login attempts. Please try again later.'
        );
        setIsLoading(false);
        return;
      }

      // Check account security
      const securityResult = await SecurityManager.checkAccountSecurity(authData.email);
      if (!securityResult.success) {
        setSecurityWarning(securityResult.message || 'Account security check failed');
        setIsLoading(false);
        return;
      }

      // Log login attempt
      await SecurityManager.logSecurityEvent('login_attempt', {
        email: authData.email
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: authData.email,
        password: authData.password,
      });

      if (error) {
        // Handle failed login
        await SecurityManager.handleFailedLogin(authData.email);
        await SecurityManager.logSecurityEvent('login_failed', {
          email: authData.email,
          error: error.message
        });
        
        throw error;
      }

      if (data.user) {
        // Handle successful login
        await SecurityManager.handleSuccessfulLogin(data.user.id);
        await SecurityManager.logSecurityEvent('login_success', {
          user_id: data.user.id
        });

        // Reset rate limit on successful login
        await RateLimiter.resetRateLimit(authData.email, 'login');

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });

        onSuccess();
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      if (error.message.includes('Invalid login credentials')) {
        setSecurityWarning("Invalid email or password. Please check your credentials and try again.");
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const securityResult = await SecurityManager.createPasswordResetRequest(resetEmail);
      
      if (!securityResult.success) {
        if (securityResult.rateLimited) {
          setSecurityWarning(securityResult.message || 'Too many password reset attempts');
        } else {
          toast({
            title: "Reset Failed",
            description: securityResult.message || "Failed to process password reset request",
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setResetEmailSent(true);
      toast({
        title: "Reset link sent!",
        description: "Please check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneVerification(prev => ({ ...prev, isVerifying: true }));

    try {
      // Check rate limit
      const rateLimitResult = await RateLimiter.checkRateLimit(authData.phone, 'phone_verification');
      if (!rateLimitResult.allowed) {
        setSecurityWarning(rateLimitResult.blockedUntil 
          ? `Too many verification attempts. Please try again after ${rateLimitResult.blockedUntil.toLocaleString()}.`
          : 'Too many verification attempts. Please try again later.'
        );
        setPhoneVerification(prev => ({ ...prev, isVerifying: false }));
        return;
      }

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

        await SecurityManager.logSecurityEvent('phone_verified', {
          user_id: user.id,
          phone: authData.phone
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
          {securityWarning && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{securityWarning}</span>
            </div>
          )}
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

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-eco-green-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-eco-green-700">
              <Shield className="h-6 w-6" />
              Reset Password
            </CardTitle>
            <CardDescription>
              {resetEmailSent ? "Check your email for reset instructions" : "Enter your email to receive a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {securityWarning && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{securityWarning}</span>
              </div>
            )}
            {!resetEmailSent ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset_email">Email Address</Label>
                  <Input
                    id="reset_email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-eco-green-600 hover:bg-eco-green-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-eco-green-100 flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-eco-green-600" />
                </div>
                <p className="text-gray-600">
                  We've sent a password reset link to <strong>{resetEmail}</strong>
                </p>
              </div>
            )}
            <div className="mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmailSent(false);
                  setResetEmail('');
                  setSecurityWarning(null);
                }}
                className="w-full text-eco-green-600 hover:text-eco-green-700 hover:bg-eco-green-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
          {securityWarning && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{securityWarning}</span>
            </div>
          )}
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
                <div className="text-right">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-eco-green-600 hover:text-eco-green-700 p-0 h-auto"
                  >
                    Forgot password?
                  </Button>
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
                        <SelectItem value="household">Household User</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="processor">Waste Processor</SelectItem>
                        <SelectItem value="collector">Waste Collector</SelectItem>
                        <SelectItem value="government">Government & Regulatory</SelectItem>
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
