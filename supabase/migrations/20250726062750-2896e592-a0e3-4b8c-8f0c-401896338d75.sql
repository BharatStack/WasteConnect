
-- Add ESG-related columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS organization_name TEXT,
ADD COLUMN IF NOT EXISTS organization_type TEXT,
ADD COLUMN IF NOT EXISTS industry_sector TEXT,
ADD COLUMN IF NOT EXISTS employee_count INTEGER,
ADD COLUMN IF NOT EXISTS annual_revenue NUMERIC,
ADD COLUMN IF NOT EXISTS headquarters_location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Create the esg_user_profiles table
CREATE TABLE IF NOT EXISTS public.esg_user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  sustainability_goals TEXT,
  esg_frameworks TEXT[],
  reporting_frequency TEXT DEFAULT 'quarterly',
  data_sources TEXT,
  key_metrics TEXT,
  compliance_requirements TEXT,
  stakeholder_groups TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the esg_user_profiles table
ALTER TABLE public.esg_user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for esg_user_profiles
CREATE POLICY "Users can view their own ESG profiles" 
  ON public.esg_user_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ESG profiles" 
  ON public.esg_user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ESG profiles" 
  ON public.esg_user_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ESG profiles" 
  ON public.esg_user_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.esg_user_profiles 
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
