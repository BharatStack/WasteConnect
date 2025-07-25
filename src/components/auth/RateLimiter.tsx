
import { supabase } from '@/integrations/supabase/client';

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts?: number;
  resetTime?: Date;
  blockedUntil?: Date;
}

export class RateLimiter {
  private static readonly LIMITS = {
    login: { maxAttempts: 5, windowMinutes: 15 },
    signup: { maxAttempts: 3, windowMinutes: 60 },
    password_reset: { maxAttempts: 3, windowMinutes: 60 },
    phone_verification: { maxAttempts: 5, windowMinutes: 15 }
  };

  static async checkRateLimit(
    identifier: string,
    action: keyof typeof RateLimiter.LIMITS
  ): Promise<RateLimitResult> {
    const limit = this.LIMITS[action];
    const windowStart = new Date();
    windowStart.setMinutes(windowStart.getMinutes() - limit.windowMinutes);

    try {
      // Check existing rate limit record
      const { data: existingLimit } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('identifier', identifier)
        .eq('action', action)
        .gte('window_start', windowStart.toISOString())
        .single();

      if (existingLimit) {
        // Check if blocked
        if (existingLimit.blocked_until && new Date(existingLimit.blocked_until) > new Date()) {
          return {
            allowed: false,
            blockedUntil: new Date(existingLimit.blocked_until)
          };
        }

        // Check if within rate limit
        if (existingLimit.attempts >= limit.maxAttempts) {
          // Block the identifier
          const blockedUntil = new Date();
          blockedUntil.setMinutes(blockedUntil.getMinutes() + limit.windowMinutes);
          
          await supabase
            .from('rate_limits')
            .update({ blocked_until: blockedUntil.toISOString() })
            .eq('id', existingLimit.id);

          return {
            allowed: false,
            blockedUntil
          };
        }

        // Increment attempts
        await supabase
          .from('rate_limits')
          .update({ attempts: existingLimit.attempts + 1 })
          .eq('id', existingLimit.id);

        return {
          allowed: true,
          remainingAttempts: limit.maxAttempts - existingLimit.attempts - 1
        };
      } else {
        // Create new rate limit record
        await supabase
          .from('rate_limits')
          .insert({
            identifier,
            action,
            attempts: 1,
            window_start: new Date().toISOString()
          });

        return {
          allowed: true,
          remainingAttempts: limit.maxAttempts - 1
        };
      }
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fail open in case of errors
      return { allowed: true };
    }
  }

  static async resetRateLimit(identifier: string, action: string): Promise<void> {
    try {
      await supabase
        .from('rate_limits')
        .delete()
        .eq('identifier', identifier)
        .eq('action', action);
    } catch (error) {
      console.error('Failed to reset rate limit:', error);
    }
  }
}
