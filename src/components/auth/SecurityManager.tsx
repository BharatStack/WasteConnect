
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
      return { success: true }; // Fail open
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
        return {
          success: false,
          message: 'User not found'
        };
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
    } catch (error) {
      console.error('Password reset request failed:', error);
      return {
        success: false,
        message: 'Failed to process password reset request'
      };
    }
  }

  static getClientFingerprint(): string {
    // Create a client fingerprint based on available information
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Client fingerprint', 2, 2);
    
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
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }
}
