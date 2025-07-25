
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { SecurityManager } from '@/components/auth/SecurityManager';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordResetComplete, setPasswordResetComplete] = useState(false);

  useEffect(() => {
    // Check if user has a valid session (came from reset email)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setSecurityWarning("This password reset link is invalid or has expired.");
        setTimeout(() => navigate('/enhanced-auth'), 3000);
      }
    };

    checkSession();
  }, [navigate]);

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === passwords.confirmPassword
    };
    return requirements;
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSecurityWarning(null);

    const validation = validatePassword(passwords.password);

    if (!validation.length) {
      setSecurityWarning("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    if (!validation.uppercase || !validation.lowercase || !validation.number || !validation.special) {
      setSecurityWarning("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      setIsLoading(false);
      return;
    }

    if (!validation.match) {
      setSecurityWarning("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.password
      });

      if (error) throw error;

      // Log password reset completion
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await SecurityManager.logSecurityEvent('password_reset_completed', {
          user_id: user.id
        });
      }

      setPasswordResetComplete(true);
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully!",
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/enhanced-auth');
      }, 3000);

    } catch (error: any) {
      console.error('Password reset error:', error);
      
      await SecurityManager.logSecurityEvent('password_reset_failed', {
        error: error.message
      });

      setSecurityWarning(error.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (passwordResetComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-eco-green-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-eco-green-700">
              <CheckCircle className="h-6 w-6" />
              Password Reset Complete
            </CardTitle>
            <CardDescription>
              Your password has been successfully updated
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-eco-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-eco-green-600" />
              </div>
              <p className="text-gray-600">
                You will be redirected to the login page in a few seconds...
              </p>
              <Button
                onClick={() => navigate('/enhanced-auth')}
                className="w-full bg-eco-green-600 hover:bg-eco-green-700"
              >
                Go to Login Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const validation = validatePassword(passwords.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-eco-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-eco-green-700">
            <Shield className="h-6 w-6" />
            Reset Your Password
          </CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          {securityWarning && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{securityWarning}</span>
            </div>
          )}
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={passwords.password}
                  onChange={(e) => setPasswords(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter new password"
                  required
                  minLength={8}
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
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Password strength indicator */}
            {passwords.password && (
              <div className="space-y-2">
                <div className="text-sm">
                  <div className={`flex items-center gap-2 ${validation.length ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${validation.length ? 'bg-green-600' : 'bg-red-600'}`} />
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 ${validation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${validation.uppercase ? 'bg-green-600' : 'bg-red-600'}`} />
                    One uppercase letter
                  </div>
                  <div className={`flex items-center gap-2 ${validation.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${validation.lowercase ? 'bg-green-600' : 'bg-red-600'}`} />
                    One lowercase letter
                  </div>
                  <div className={`flex items-center gap-2 ${validation.number ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${validation.number ? 'bg-green-600' : 'bg-red-600'}`} />
                    One number
                  </div>
                  <div className={`flex items-center gap-2 ${validation.special ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${validation.special ? 'bg-green-600' : 'bg-red-600'}`} />
                    One special character
                  </div>
                  {passwords.confirmPassword && (
                    <div className={`flex items-center gap-2 ${validation.match ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${validation.match ? 'bg-green-600' : 'bg-red-600'}`} />
                      Passwords match
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-eco-green-600 hover:bg-eco-green-700"
              disabled={isLoading || !validation.length || !validation.uppercase || !validation.lowercase || !validation.number || !validation.special || !validation.match}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
