
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RateLimiterProps {
  identifier: string;
  maxAttempts: number;
  windowMs: number;
  children: React.ReactNode;
}

export const RateLimiter = ({ identifier, maxAttempts, windowMs, children }: RateLimiterProps) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Simple in-memory rate limiting for now
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
