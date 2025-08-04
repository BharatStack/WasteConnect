
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SecurityManager } from './SecurityManager';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, Check } from 'lucide-react';

interface PasswordResetManagerProps {
  onClose?: () => void;
}

const PasswordResetManager = ({ onClose }: PasswordResetManagerProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check rate limiting and security
      const securityCheck = await SecurityManager.createPasswordResetRequest(email);
      
      if (!securityCheck.success) {
        toast({
          title: "Request Blocked",
          description: securityCheck.message,
          variant: "destructive",
        });
        return;
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        if (error.message.includes('rate limit')) {
          toast({
            title: "Too Many Requests",
            description: "Please wait before requesting another password reset.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to send password reset email. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      await SecurityManager.logSecurityEvent('password_reset_requested', {
        email,
        success: true
      });

      setIsSuccess(true);
      toast({
        title: "Reset Email Sent",
        description: "If an account with this email exists, you'll receive a password reset link.",
      });

    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Reset Email Sent
        </h3>
        <p className="text-gray-600 mb-4">
          Check your email for the password reset link.
        </p>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <div className="text-center mb-4">
        <Mail className="h-12 w-12 text-blue-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
        <p className="text-gray-600 text-sm">
          Enter your email to receive a password reset link
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-email">Email Address</Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex space-x-2">
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default PasswordResetManager;
