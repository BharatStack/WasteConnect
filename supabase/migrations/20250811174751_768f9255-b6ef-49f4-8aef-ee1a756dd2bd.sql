
-- Create water credit profiles table
CREATE TABLE public.water_credit_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  industry_type TEXT,
  facility_name TEXT,
  location TEXT,
  gps_coordinates POINT,
  capacity_rating NUMERIC,
  certification_level TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create water user stats table
CREATE TABLE public.water_user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  total_credits_earned NUMERIC DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,
  current_score INTEGER DEFAULT 750,
  efficiency_rating NUMERIC DEFAULT 85,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.water_credit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for water_credit_profiles
CREATE POLICY "Users can view their own water credit profiles" 
  ON public.water_credit_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own water credit profiles" 
  ON public.water_credit_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water credit profiles" 
  ON public.water_credit_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for water_user_stats
CREATE POLICY "Users can view their own water user stats" 
  ON public.water_user_stats 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own water user stats" 
  ON public.water_user_stats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water user stats" 
  ON public.water_user_stats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at_water_credit_profiles
  BEFORE UPDATE ON public.water_credit_profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at_water_user_stats
  BEFORE UPDATE ON public.water_user_stats
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
