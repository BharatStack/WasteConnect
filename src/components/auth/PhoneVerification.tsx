
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RateLimiter } from './RateLimiter';
import { SecurityManager } from './SecurityManager';
import { Phone, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PhoneVerificationProps {
  userId: string;
  onVerified?: () => void;
}

const PhoneVerification = ({ userId, onVerified }: PhoneVerificationProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // If it doesn't start with country code, assume India (+91)
    if (digits.length === 10) {
      return `+91${digits}`;
    }
    
    // If it already has country code
    if (digits.startsWith('91') && digits.length === 12) {
      return `+${digits}`;
    }
    
    return `+${digits}`;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const formattedPhone = formatPhoneNumber(phone);
    // Indian phone number validation: +91 followed by 10 digits
    return /^\+91[6-9]\d{9}$/.test(formattedPhone);
  };

  const sendVerificationCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Indian phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check rate limiting
      const rateLimitResult = await RateLimiter.checkRateLimit(phoneNumber, 'phone_verification');
      if (!rateLimitResult.allowed) {
        const message = rateLimitResult.blockedUntil 
          ? `Too many verification attempts. Please try again after ${rateLimitResult.blockedUntil.toLocaleString()}.`
          : 'Too many verification attempts. Please try again later.';
        setError(message);
        return;
      }

      const formattedPhone = formatPhoneNumber(phoneNumber);

      // Store phone number in our database
      const { error: dbError } = await supabase
        .from('user_phone_numbers')
        .insert({
          user_id: userId,
          phone_number: formattedPhone,
          is_verified: false,
          is_primary: true
        });

      if (dbError && !dbError.message.includes('duplicate key')) {
        throw dbError;
      }

      // In a real implementation, you would integrate with SMS service
      // For now, we'll simulate sending a code
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`Mock verification code for ${formattedPhone}: ${mockCode}`);
      
      // Store the mock code temporarily (in real app, this would be handled by SMS service)
      localStorage.setItem(`verification_code_${formattedPhone}`, mockCode);
      setTimeout(() => {
        localStorage.removeItem(`verification_code_${formattedPhone}`);
      }, 5 * 60 * 1000); // 5 minutes

      await SecurityManager.logSecurityEvent('phone_verification_code_sent', {
        phone_number: formattedPhone,
        user_id: userId
      });

      setCodeSent(true);
      toast({
        title: "Verification Code Sent",
        description: "Please check your phone for the 6-digit verification code.",
      });

    } catch (error: any) {
      console.error('Phone verification error:', error);
      setError('Failed to send verification code. Please try again.');
      
      await SecurityManager.logSecurityEvent('phone_verification_failed', {
        phone_number: phoneNumber,
        user_id: userId,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // In a real implementation, you would verify with SMS service
      // For now, check against our mock code
      const storedCode = localStorage.getItem(`verification_code_${formattedPhone}`);
      if (!storedCode || storedCode !== verificationCode) {
        setError('Invalid verification code. Please try again.');
        return;
      }

      // Update phone number as verified
      const { error: dbError } = await supabase
        .from('user_phone_numbers')
        .update({
          is_verified: true,
          verified_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('phone_number', formattedPhone);

      if (dbError) {
        throw dbError;
      }

      // Clean up mock code
      localStorage.removeItem(`verification_code_${formattedPhone}`);

      await SecurityManager.logSecurityEvent('phone_verification_successful', {
        phone_number: formattedPhone,
        user_id: userId
      });

      toast({
        title: "Phone Verified!",
        description: "Your phone number has been successfully verified.",
      });

      onVerified?.();

    } catch (error: any) {
      console.error('Code verification error:', error);
      setError('Failed to verify code. Please try again.');
      
      await SecurityManager.logSecurityEvent('phone_verification_code_failed', {
        phone_number: phoneNumber,
        user_id: userId,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Phone Verification
        </CardTitle>
        <CardDescription>
          Verify your phone number for additional security
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!codeSent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-600">
                  Enter your Indian mobile number with country code (+91)
                </p>
              </div>

              <Button
                onClick={sendVerificationCode}
                disabled={isLoading || !phoneNumber}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Verification code sent to {formatPhoneNumber(phoneNumber)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationCode">6-Digit Code</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  disabled={isLoading}
                  className="text-center text-lg tracking-wider"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={verifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setCodeSent(false);
                    setVerificationCode('');
                    setError('');
                  }}
                  variant="outline"
                  disabled={isLoading}
                >
                  Back
                </Button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setCodeSent(false);
                    sendVerificationCode();
                  }}
                  disabled={isLoading}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneVerification;
