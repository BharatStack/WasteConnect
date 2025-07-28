
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RateLimiterProps {
  identifier: string;
  maxAttempts: number;
  windowMs: number;
  children: React.ReactNode;
}

interface RateLimitResult {
  allowed: boolean;
  remainingAttempts?: number;
  blockedUntil?: Date;
}

export class RateLimiter {
  static async checkRateLimit(identifier: string, actionType: string): Promise<RateLimitResult> {
    try {
      const windowStart = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
      
      // Check existing rate limit record
      const { data: existingLimit } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', actionType)
        .gte('window_start', windowStart.toISOString())
        .single();

      if (existingLimit) {
        const maxAttempts = this.getMaxAttempts(actionType);
        
        if (existingLimit.attempts >= maxAttempts) {
          const blockedUntil = new Date(existingLimit.window_start);
          blockedUntil.setMinutes(blockedUntil.getMinutes() + 30);
          
          if (blockedUntil > new Date()) {
            return {
              allowed: false,
              blockedUntil
            };
          }
        }
        
        // Update attempt count
        await supabase
          .from('rate_limits')
          .update({
            attempts: existingLimit.attempts + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLimit.id);
          
        return {
          allowed: existingLimit.attempts + 1 < maxAttempts,
          remainingAttempts: maxAttempts - (existingLimit.attempts + 1)
        };
      }
      
      // Create new rate limit record
      await supabase
        .from('rate_limits')
        .insert({
          identifier,
          action_type: actionType,
          attempts: 1,
          window_start: new Date().toISOString()
        });
      
      return {
        allowed: true,
        remainingAttempts: this.getMaxAttempts(actionType) - 1
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return { allowed: true }; // Fail open
    }
  }

  static async resetRateLimit(identifier: string, actionType: string): Promise<void> {
    try {
      await supabase
        .from('rate_limits')
        .delete()
        .eq('identifier', identifier)
        .eq('action_type', actionType);
    } catch (error) {
      console.error('Rate limit reset failed:', error);
    }
  }

  private static getMaxAttempts(actionType: string): number {
    switch (actionType) {
      case 'login':
        return 5;
      case 'signup':
        return 3;
      case 'password_reset':
        return 3;
      case 'phone_verification':
        return 5;
      default:
        return 5;
    }
  }
}

// React component for UI rate limiting
export const RateLimiterComponent = ({ identifier, maxAttempts, windowMs, children }: RateLimiterProps) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Simple in-memory rate limiting for UI components
  const checkRateLimit = () => {
    const storageKey = `rate_limit_${identifier}`;
    const storedData = localStorage.getItem(storageKey);
    
    if (storedData) {
      const { attempts, lastAttempt } = JSON.parse(storedData);
      const now = Date.now();
      
      if (now - lastAttempt < windowMs) {
        if (attempts >= maxAttempts) {
          setIsBlocked(true);
          setRemainingTime(windowMs - (now - lastAttempt));
          return false;
        }
        
        localStorage.setItem(storageKey, JSON.stringify({
          attempts: attempts + 1,
          lastAttempt: now
        }));
      } else {
        localStorage.setItem(storageKey, JSON.stringify({
          attempts: 1,
          lastAttempt: now
        }));
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify({
        attempts: 1,
        lastAttempt: Date.now()
      }));
    }
    
    return true;
  };

  useEffect(() => {
    if (isBlocked && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1000) {
            setIsBlocked(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBlocked, remainingTime]);

  const isRateLimited = () => {
    return !checkRateLimit();
  };

  if (isBlocked) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 font-medium">Rate limit exceeded</p>
          <p className="text-red-500 text-sm">
            Try again in {Math.ceil(remainingTime / 1000)} seconds
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Export as default for backward compatibility
export default RateLimiterComponent;
