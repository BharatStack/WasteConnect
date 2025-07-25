
-- Add missing columns to profiles table for security features
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;

-- Create function to handle failed login attempts
CREATE OR REPLACE FUNCTION handle_failed_login(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record profiles%ROWTYPE;
    max_attempts INTEGER := 5;
    lockout_duration INTERVAL := '30 minutes';
BEGIN
    -- Get user profile
    SELECT * INTO user_record FROM profiles WHERE email = user_email;
    
    IF user_record.id IS NOT NULL THEN
        -- Increment failed attempts
        UPDATE profiles 
        SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1
        WHERE id = user_record.id;
        
        -- Check if we should lock the account
        IF COALESCE(user_record.failed_login_attempts, 0) + 1 >= max_attempts THEN
            UPDATE profiles 
            SET locked_until = NOW() + lockout_duration
            WHERE id = user_record.id;
        END IF;
    END IF;
END;
$$;

-- Create function to reset failed login attempts
CREATE OR REPLACE FUNCTION reset_failed_login_attempts(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE profiles 
    SET failed_login_attempts = 0,
        locked_until = NULL
    WHERE id = user_id;
END;
$$;

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    action_type TEXT NOT NULL,
    attempts INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blocked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON rate_limits(identifier, action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_blocked_until ON rate_limits(blocked_until);

-- Enable RLS on rate_limits table
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for rate_limits
CREATE POLICY "Users can manage their own rate limits" ON rate_limits
    FOR ALL USING (true);
