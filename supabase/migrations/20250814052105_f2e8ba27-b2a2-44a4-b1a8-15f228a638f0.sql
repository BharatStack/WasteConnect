
-- Create user_visits table to track app visits
CREATE TABLE user_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  session_count INTEGER NOT NULL DEFAULT 1,
  last_visit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, visit_date)
);

-- Create indexes for better performance
CREATE INDEX idx_user_visits_user_id ON user_visits(user_id);
CREATE INDEX idx_user_visits_date ON user_visits(visit_date DESC);

-- Enable Row Level Security
ALTER TABLE user_visits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_visits
CREATE POLICY "Users can view their own visits" ON user_visits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visits" ON user_visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visits" ON user_visits
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_visits_updated_at 
  BEFORE UPDATE ON user_visits 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time
ALTER TABLE user_visits REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE user_visits;

-- Function to track user visits
CREATE OR REPLACE FUNCTION track_user_visit(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_visits (user_id, visit_date, session_count, last_visit_time)
  VALUES (p_user_id, CURRENT_DATE, 1, NOW())
  ON CONFLICT (user_id, visit_date)
  DO UPDATE SET 
    session_count = user_visits.session_count + 1,
    last_visit_time = NOW(),
    updated_at = NOW();
END;
$$;

-- Create user_stats table to aggregate user statistics
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_waste_logged_kg NUMERIC DEFAULT 0,
  total_co2_reduced_kg NUMERIC DEFAULT 0,
  total_cost_savings NUMERIC DEFAULT 0,
  total_credits_earned INTEGER DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  total_visits INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_stats
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);

-- Enable Row Level Security for user_stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_stats
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for user_stats updated_at
CREATE TRIGGER update_user_stats_updated_at 
  BEFORE UPDATE ON user_stats 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time for user_stats
ALTER TABLE user_stats REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE user_stats;

-- Function to initialize user stats
CREATE OR REPLACE FUNCTION initialize_user_stats(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Function to update user stats when waste is logged
CREATE OR REPLACE FUNCTION update_user_stats_on_waste_log()
RETURNS TRIGGER AS $$
DECLARE
  co2_reduction NUMERIC;
  cost_savings NUMERIC;
BEGIN
  -- Calculate CO2 reduction and cost savings based on waste data
  co2_reduction := COALESCE((NEW.environmental_impact->>'co2_reduction_kg')::NUMERIC, 0);
  cost_savings := co2_reduction * 3800; -- INR conversion rate
  
  -- Initialize user stats if not exists
  PERFORM initialize_user_stats(NEW.user_id);
  
  -- Update user stats
  UPDATE user_stats SET
    total_waste_logged_kg = total_waste_logged_kg + NEW.quantity,
    total_co2_reduced_kg = total_co2_reduced_kg + co2_reduction,
    total_cost_savings = total_cost_savings + cost_savings,
    activities_completed = activities_completed + 1,
    last_activity_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  -- Log activity
  PERFORM create_activity_log(
    NEW.user_id,
    'waste_logged',
    'Waste Data Recorded',
    format('%s kg of %s waste logged', NEW.quantity, NEW.waste_type),
    'completed',
    jsonb_build_object(
      'waste_log_id', NEW.id,
      'quantity', NEW.quantity,
      'co2_reduced', co2_reduction,
      'cost_savings', cost_savings
    ),
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for waste data logs
CREATE TRIGGER waste_log_stats_trigger
  AFTER INSERT ON waste_data_logs
  FOR EACH ROW EXECUTE FUNCTION update_user_stats_on_waste_log();

-- Function to update visit stats
CREATE OR REPLACE FUNCTION update_visit_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total visits in user_stats
  UPDATE user_stats SET
    total_visits = (
      SELECT COALESCE(SUM(session_count), 0)
      FROM user_visits
      WHERE user_id = NEW.user_id
    ),
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for visit tracking
CREATE TRIGGER visit_stats_trigger
  AFTER INSERT OR UPDATE ON user_visits
  FOR EACH ROW EXECUTE FUNCTION update_visit_stats();
