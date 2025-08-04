
-- Phase 1: Critical Database Security Fixes
-- Enable RLS on all public tables that don't have it enabled yet

-- First, let's create the missing security-related tables
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  action_type TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(identifier, action_type, window_start)
);

CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS public.user_phone_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_phone_numbers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "System can manage rate limits" ON public.rate_limits FOR ALL USING (true);

CREATE POLICY "Users can view their own reset requests" ON public.password_reset_requests
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage reset requests" ON public.password_reset_requests
FOR ALL USING (true);

CREATE POLICY "Users can manage their own favorites" ON public.user_favorites
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own phone numbers" ON public.user_phone_numbers
FOR ALL USING (user_id = auth.uid());

-- Fix existing overly permissive policies
-- Remove the overly broad "System can manage analytics" policy and replace with specific ones
DROP POLICY IF EXISTS "System can manage analytics" ON public.analytics_metrics;

CREATE POLICY "Government can create analytics" ON public.analytics_metrics
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'government')
);

CREATE POLICY "Government can update analytics" ON public.analytics_metrics
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'government')
);

CREATE POLICY "Government can delete analytics" ON public.analytics_metrics
FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'government')
);

-- Fix bond market orders policy to be more restrictive
DROP POLICY IF EXISTS "Users can view market orders" ON public.bond_market_orders;

CREATE POLICY "Users can view active market orders" ON public.bond_market_orders
FOR SELECT USING (status = 'active' OR seller_id = auth.uid() OR buyer_id = auth.uid());

-- Add missing policies for audit logs (currently can't insert)
CREATE POLICY "System can create audit logs" ON public.audit_logs
FOR INSERT WITH CHECK (true);

-- Secure the material conversion factors table
CREATE POLICY "Anyone can view conversion factors" ON public.material_conversion_factors
FOR SELECT USING (true);

CREATE POLICY "Government can manage conversion factors" ON public.material_conversion_factors
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'government')
);

-- Create security definer functions to prevent RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_type(user_id UUID)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT user_type::TEXT FROM public.profiles WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_government_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND user_type = 'government'
  );
$$;

-- Update policies to use security definer functions where needed
DROP POLICY IF EXISTS "Government can view all audit logs" ON public.audit_logs;
CREATE POLICY "Government can view all audit logs" ON public.audit_logs
FOR SELECT USING (public.is_government_user(auth.uid()));

DROP POLICY IF EXISTS "Government can manage analytics" ON public.government_analytics;
CREATE POLICY "Government can manage analytics" ON public.government_analytics
FOR ALL USING (public.is_government_user(auth.uid()));

-- Add indexes for performance on security-critical lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON public.rate_limits(identifier, action_type);
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON public.password_reset_requests(token) WHERE used_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON public.audit_logs(user_id, action);
