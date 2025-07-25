
-- Phase 1: Critical Security Fixes - Database Changes

-- 1. Add account lockout mechanism
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS failed_login_attempts integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS locked_until timestamp with time zone;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;

-- 2. Add password reset security
CREATE TABLE IF NOT EXISTS password_reset_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on password reset table
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for password reset requests
CREATE POLICY "Users can view their own reset requests" 
    ON password_reset_requests 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- 3. Add session management
CREATE TABLE IF NOT EXISTS user_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    last_activity timestamp with time zone DEFAULT now(),
    ip_address inet,
    user_agent text,
    is_active boolean DEFAULT true
);

-- Enable RLS on sessions table
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for user sessions
CREATE POLICY "Users can view their own sessions" 
    ON user_sessions 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- 4. Add rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier text NOT NULL, -- IP address or user ID
    action text NOT NULL, -- login, signup, reset_password, etc.
    attempts integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    blocked_until timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for rate limits (system access only)
CREATE POLICY "System can manage rate limits" 
    ON rate_limits 
    FOR ALL 
    USING (true);

-- 5. Create security definer function for user role checking (prevent RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_type AS $$
    SELECT user_type FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 6. Update audit log function to be more secure
CREATE OR REPLACE FUNCTION public.create_audit_log(
    p_action text, 
    p_resource_type text, 
    p_resource_id uuid DEFAULT NULL::uuid, 
    p_metadata jsonb DEFAULT NULL::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    -- Add IP address and user agent from request headers if available
    INSERT INTO public.audit_logs (
        user_id, 
        action, 
        resource_type, 
        resource_id, 
        metadata,
        ip_address,
        user_agent
    )
    VALUES (
        auth.uid(), 
        p_action, 
        p_resource_type, 
        p_resource_id, 
        COALESCE(p_metadata, '{}'::jsonb),
        inet(current_setting('request.headers', true)::json->>'x-forwarded-for'),
        current_setting('request.headers', true)::json->>'user-agent'
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Fallback without IP/user agent if headers not available
        INSERT INTO public.audit_logs (
            user_id, 
            action, 
            resource_type, 
            resource_id, 
            metadata
        )
        VALUES (
            auth.uid(), 
            p_action, 
            p_resource_type, 
            p_resource_id, 
            COALESCE(p_metadata, '{}'::jsonb)
        );
END;
$function$;

-- 7. Create function to check and update failed login attempts
CREATE OR REPLACE FUNCTION public.handle_failed_login(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    user_profile profiles%ROWTYPE;
    max_attempts constant integer := 5;
    lockout_duration constant interval := '15 minutes';
BEGIN
    -- Get user profile
    SELECT * INTO user_profile 
    FROM profiles 
    WHERE email = user_email;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check if account is currently locked
    IF user_profile.locked_until IS NOT NULL AND user_profile.locked_until > now() THEN
        RETURN false; -- Account is locked
    END IF;
    
    -- Increment failed attempts
    UPDATE profiles 
    SET 
        failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
        locked_until = CASE 
            WHEN COALESCE(failed_login_attempts, 0) + 1 >= max_attempts 
            THEN now() + lockout_duration 
            ELSE NULL 
        END
    WHERE id = user_profile.id;
    
    RETURN true;
END;
$function$;

-- 8. Create function to reset failed login attempts on successful login
CREATE OR REPLACE FUNCTION public.reset_failed_login_attempts(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    UPDATE profiles 
    SET 
        failed_login_attempts = 0,
        locked_until = NULL,
        last_login_at = now()
    WHERE id = user_id;
END;
$function$;
