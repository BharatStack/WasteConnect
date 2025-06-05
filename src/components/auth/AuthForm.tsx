import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { toast } = useToast();

  // Email/Password form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  // Phone OTP form state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "Sign up successful!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
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

  const handlePhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!otpSent) {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phone,
        });
        if (error) throw error;
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code.",
        });
      } else {
        const { error } = await supabase.auth.verifyOtp({
          phone: phone,
          token: otp,
          type: 'sms',
        });
        if (error) throw error;
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Phone Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Authentication Error",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/90">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-eco-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Sparkles className="text-white h-5 w-5" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-eco-green-700 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
                WasteConnect
              </span>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-eco-green-700 to-emerald-700 bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription>
              {resetEmailSent ? "Check your email for reset instructions" : "Enter your email to receive a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    className="border-eco-green-200 focus:border-eco-green-500 focus:ring-eco-green-500"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-eco-green-600 via-emerald-600 to-teal-600 hover:from-eco-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-eco-green-100 to-emerald-100 flex items-center justify-center mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/90">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-eco-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white h-5 w-5" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-eco-green-700 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
              WasteConnect
            </span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-eco-green-700 to-emerald-700 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
          <div className="text-xs text-gray-500 mt-2">
            Powered by <span className="font-semibold text-eco-green-600">NOTIONX</span>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-eco-green-100 to-emerald-100">
              <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-eco-green-700">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-eco-green-700">
                <Phone className="h-4 w-4" />
                Phone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="border-eco-green-200 focus:border-eco-green-500 focus:ring-eco-green-500"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-eco-green-200 focus:border-eco-green-500 focus:ring-eco-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-eco-green-200 focus:border-eco-green-500 focus:ring-eco-green-500 pr-10"
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
                {!isSignUp && (
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
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-eco-green-600 via-emerald-600 to-teal-600 hover:from-eco-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105" 
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
                </Button>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-eco-green-600 hover:text-eco-green-700"
                  >
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              <form onSubmit={handlePhoneOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                    required
                    className="border-eco-green-200 focus:border-eco-green-500 focus:ring-eco-green-500"
                  />
                </div>
                {otpSent && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-eco-green-600 via-emerald-600 to-teal-600 hover:from-eco-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105" 
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : otpSent ? "Verify Code" : "Send Code"}
                </Button>
                {otpSent && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOtpSent(false)}
                    className="w-full border-eco-green-200 text-eco-green-700 hover:bg-eco-green-50"
                  >
                    Change Phone Number
                  </Button>
                )}
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-eco-green-200 to-emerald-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <Button
              onClick={handleGoogleAuth}
              variant="outline"
              className="w-full mt-4 border-eco-green-200 hover:bg-gradient-to-r hover:from-eco-green-50 hover:to-emerald-50 transition-all duration-300"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
