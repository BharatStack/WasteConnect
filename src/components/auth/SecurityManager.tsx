import { supabase } from '@/integrations/supabase/client';
import { RateLimiter } from './RateLimiter';

export interface SecurityResult {
  success: boolean;
  message?: string;
  accountLocked?: boolean;
  rateLimited?: boolean;
  blockedUntil?: Date;
}

export class SecurityManager {
  static async checkAccountSecurity(email: string): Promise<SecurityResult> {
    try {
      // Check user profile for lockout status
      const { data: profile } = await supabase
        .from('profiles')
        .select('locked_until, failed_login_attempts')
        .eq('email', email)
        .single();

      if (profile?.locked_until) {
        const lockedUntil = new Date(profile.locked_until);
        if (lockedUntil > new Date()) {
          return {
            success: false,
            accountLocked: true,
            message: `Account is locked due to too many failed login attempts. Please try again after ${lockedUntil.toLocaleString()}.`,
            blockedUntil: lockedUntil
          };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Security check failed:', error);
      return { success: true }; // Fail open to prevent blocking legitimate users
    }
  }

  static async handleFailedLogin(email: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('handle_failed_login', { 
        user_email: email 
      });
      
      if (error) {
        console.error('Failed login handler error:', error);
      }

      // Also log the failed attempt
      await this.logSecurityEvent('login_failed_attempt', { 
        email,
        timestamp: new Date().toISOString(),
        client_fingerprint: this.getClientFingerprint()
      });
    } catch (error) {
      console.error('Failed to handle failed login:', error);
    }
  }

  static async handleSuccessfulLogin(userId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('reset_failed_login_attempts', { 
        user_id: userId 
      });
      
      if (error) {
        console.error('Reset failed login attempts error:', error);
      }

      // Log successful login
      await this.logSecurityEvent('login_successful', {
        user_id: userId,
        timestamp: new Date().toISOString(),
        client_fingerprint: this.getClientFingerprint()
      });
    } catch (error) {
      console.error('Failed to reset failed login attempts:', error);
    }
  }

  static async createPasswordResetRequest(email: string): Promise<SecurityResult> {
    try {
      // Check rate limit
      const rateLimitResult = await RateLimiter.checkRateLimit(email, 'password_reset');
      if (!rateLimitResult.allowed) {
        return {
          success: false,
          rateLimited: true,
          message: rateLimitResult.blockedUntil 
            ? `Too many password reset attempts. Please try again after ${rateLimitResult.blockedUntil.toLocaleString()}.`
            : 'Too many password reset attempts. Please try again later.',
          blockedUntil: rateLimitResult.blockedUntil
        };
      }

      // Generate secure token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

      // Get user ID
      const { data: userData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (!userData) {
        // Don't reveal whether the email exists or not
        return { success: true };
      }

      // Store reset request
      await supabase
        .from('password_reset_requests')
        .insert({
          user_id: userData.id,
          token,
          expires_at: expiresAt.toISOString()
        });

      return { success: true };
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      return {
        success: false,
        message: 'Failed to process password reset request'
      };
    }
  }

  static async validatePasswordResetToken(token: string): Promise<{ valid: boolean; userId?: string }> {
    try {
      const { data: resetRequest } = await supabase
        .from('password_reset_requests')
        .select('user_id, expires_at, used')
        .eq('token', token)
        .single();

      if (!resetRequest) {
        return { valid: false };
      }

      if (resetRequest.used) {
        return { valid: false };
      }

      if (new Date(resetRequest.expires_at) < new Date()) {
        return { valid: false };
      }

      return { valid: true, userId: resetRequest.user_id };
    } catch (error) {
      console.error('Token validation failed:', error);
      return { valid: false };
    }
  }

  static async markPasswordResetTokenAsUsed(token: string): Promise<void> {
    try {
      await supabase
        .from('password_reset_requests')
        .update({ used: true })
        .eq('token', token);
    } catch (error) {
      console.error('Failed to mark token as used:', error);
    }
  }

  static getClientFingerprint(): string {
    // Create a client fingerprint based on available information
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Client fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).substring(0, 32);
  }

  static async logSecurityEvent(action: string, metadata?: any): Promise<void> {
    try {
      await supabase.rpc('create_audit_log', {
        p_action: action,
        p_resource_type: 'security',
        p_metadata: {
          ...metadata,
          client_fingerprint: this.getClientFingerprint(),
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  static sanitizeInput(input: string): string {
    // Basic XSS protection
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static async checkSuspiciousActivity(userId: string): Promise<boolean> {
    try {
      // Check for suspicious patterns in recent activity
      const { data: recentLogs } = await supabase
        .from('audit_logs')
        .select('action, created_at, metadata')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('created_at', { ascending: false })
        .limit(50);

      if (!recentLogs || recentLogs.length === 0) {
        return false;
      }

      // Check for rapid-fire actions
      let rapidActions = 0;
      for (let i = 0; i < recentLogs.length - 1; i++) {
        const timeDiff = new Date(recentLogs[i].created_at).getTime() - 
                        new Date(recentLogs[i + 1].created_at).getTime();
        if (timeDiff < 1000) { // Actions less than 1 second apart
          rapidActions++;
        }
      }

      // Check for failed login patterns
      const failedLogins = recentLogs.filter(log => log.action.includes('failed')).length;
      
      return rapidActions > 10 || failedLogins > 5;
    } catch (error) {
      console.error('Suspicious activity check failed:', error);
      return false;
    }
  }
}
