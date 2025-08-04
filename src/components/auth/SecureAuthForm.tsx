
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SecurityManager } from './SecurityManager';
import { RateLimiter } from './RateLimiter';
import PasswordResetManager from './PasswordResetManager';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

interface SecureAuthFormProps {
  onSuccess?: () => void;
}

const SecureAuthForm = ({ onSuccess }: SecureAuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [securityWarning, setSecurityWarning] = useState<string>('');

  const { toast } = useToast();

  useEffect(() => {
    // Clear security warnings after some time
    if (securityWarning) {
      const timer = setTimeout(() => setSecurityWarning(''), 10000);
      return () => clearTimeout(timer);
    }
  }, [securityWarning]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);
    setSecurityWarning('');

    try {
      const actionType = isLogin ? 'login' : 'signup';
      
      // Check rate limiting
      const rateLimitResult = await RateLimiter.checkRateLimit(formData.email, actionType);
      if (!rateLimitResult.allowed) {
        const message = rateLimitResult.blockedUntil 
          ? `Too many ${actionType} attempts. Please try again after ${rateLimitResult.blockedUntil.toLocaleString()}.`
          : `Too many ${actionType} attempts. Please try again later.`;
        
        setSecurityWarning(message);
        return;
      }

      if (isLogin) {
        // Check account security before login
        const securityCheck = await SecurityManager.checkAccountSecurity(formData.email);
        if (!securityCheck.success) {
          if (securityCheck.accountLocked) {
            setSecurityWarning(securityCheck.message || 'Account is temporarily locked');
            return;
          }
        }

        // Attempt login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            await SecurityManager.handleFailedLogin(formData.email);
            setErrors(['Invalid email or password']);
          } else {
            setErrors([error.message]);
          }
          
          await SecurityManager.logSecurityEvent('login_failed', {
            email: formData.email,
            error: error.message,
            client_info: {
              user_agent: navigator.userAgent,
              timestamp: new Date().toISOString()
            }
          });
          return;
        }

        if (data.user) {
          await SecurityManager.handleSuccessfulLogin(data.user.id);
          await SecurityManager.logSecurityEvent('login_successful', {
            email: formData.email,
            user_id: data.user.id
          });

          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          onSuccess?.();
        }
      } else {
        // Validate password for signup
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
          setErrors(passwordErrors);
          return;
        }

        // Attempt signup
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/enhanced-auth`,
            data: {
              full_name: formData.fullName
            }
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            setErrors(['An account with this email already exists. Please sign in instead.']);
          } else {
            setErrors([error.message]);
          }
          
          await SecurityManager.logSecurityEvent('signup_failed', {
            email: formData.email,
            error: error.message
          });
          return;
        }

        if (data.user) {
          await SecurityManager.logSecurityEvent('signup_successful', {
            email: formData.email,
            user_id: data.user.id
          });

          toast({
            title: "Account Created!",
            description: "Please check your email to verify your account.",
          });
          
          // Don't call onSuccess for signup since user needs to verify email
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
      
      await SecurityManager.logSecurityEvent('auth_error', {
        email: formData.email,
        error: error.message,
        action: isLogin ? 'login' : 'signup'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showPasswordReset) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Password Reset</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordResetManager onClose={() => setShowPasswordReset(false)} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isLogin ? 'Sign In' : 'Create Account'}</CardTitle>
        <CardDescription>
          {isLogin 
            ? 'Welcome back! Please sign in to your account.' 
            : 'Create a new account to get started.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {securityWarning && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{securityWarning}</AlertDescription>
            </Alert>
          )}

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
                required={!isLogin}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {!isLogin && (
              <p className="text-xs text-gray-600">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </Button>

          <div className="flex flex-col items-center space-y-2 text-sm">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors([]);
                setSecurityWarning('');
              }}
              className="text-blue-600 hover:text-blue-700 underline"
              disabled={isLoading}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>

            {isLogin && (
              <button
                type="button"
                onClick={() => setShowPasswordReset(true)}
                className="text-blue-600 hover:text-blue-700 underline text-xs"
                disabled={isLoading}
              >
                Forgot your password?
              </button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecureAuthForm;
