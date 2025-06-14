
-- Create enum types for carbon credit system
CREATE TYPE activity_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE verification_tier AS ENUM ('tier1_ai', 'tier2_community', 'tier3_auditor');
CREATE TYPE user_role AS ENUM ('individual', 'community', 'organization', 'municipal');
CREATE TYPE waste_material AS ENUM ('organic', 'recyclable', 'hazardous', 'ewaste', 'plastic', 'paper', 'metal', 'glass');
CREATE TYPE trade_status AS ENUM ('active', 'completed', 'cancelled', 'expired');
CREATE TYPE order_type AS ENUM ('buy', 'sell');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'under_review');

-- Carbon credit user profiles (extends existing profiles)
CREATE TABLE carbon_credit_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  aadhaar_number TEXT,
  kyc_status verification_status DEFAULT 'pending',
  role user_role DEFAULT 'individual',
  bank_account_number TEXT,
  ifsc_code TEXT,
  address_verified BOOLEAN DEFAULT false,
  gps_coordinates POINT,
  document_urls JSONB DEFAULT '[]',
  onboarding_completed BOOLEAN DEFAULT false,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Waste activities for carbon credit calculation
CREATE TABLE waste_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type waste_material NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  photo_urls JSONB DEFAULT '[]',
  video_urls JSONB DEFAULT '[]',
  location POINT,
  location_name TEXT,
  activity_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status activity_status DEFAULT 'pending',
  verification_tier verification_tier,
  verification_score DECIMAL(3,2) DEFAULT 1.0,
  ai_classification_confidence DECIMAL(3,2),
  carbon_credits_earned DECIMAL(10,4) DEFAULT 0,
  batch_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Material conversion factors for carbon credit calculation
CREATE TABLE material_conversion_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_type waste_material NOT NULL,
  conversion_factor DECIMAL(8,6) NOT NULL,
  regional_factor DECIMAL(4,3) DEFAULT 1.0,
  region TEXT DEFAULT 'india',
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Carbon credits ledger
CREATE TABLE carbon_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES waste_activities(id),
  credits_amount DECIMAL(10,4) NOT NULL,
  credits_type TEXT DEFAULT 'waste_reduction',
  earned_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trading marketplace
CREATE TABLE carbon_credit_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_type order_type NOT NULL,
  credits_amount DECIMAL(10,4) NOT NULL,
  price_per_credit DECIMAL(8,4) NOT NULL,
  total_amount DECIMAL(12,4) NOT NULL,
  status trade_status DEFAULT 'active',
  filled_amount DECIMAL(10,4) DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trade transactions
CREATE TABLE carbon_credit_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buy_order_id UUID REFERENCES carbon_credit_orders(id),
  sell_order_id UUID REFERENCES carbon_credit_orders(id),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  credits_amount DECIMAL(10,4) NOT NULL,
  price_per_credit DECIMAL(8,4) NOT NULL,
  total_amount DECIMAL(12,4) NOT NULL,
  trade_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  settlement_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User achievements and gamification
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  points_earned INTEGER DEFAULT 0,
  badge_url TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User statistics and streaks
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_credits_earned DECIMAL(12,4) DEFAULT 0,
  total_credits_traded DECIMAL(12,4) DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_activities INTEGER DEFAULT 0,
  total_waste_processed DECIMAL(12,2) DEFAULT 0,
  co2_saved DECIMAL(12,2) DEFAULT 0,
  last_activity_date DATE,
  level_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payment transactions
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  credits_amount DECIMAL(10,4),
  payment_method TEXT,
  payment_gateway_id TEXT,
  status TEXT DEFAULT 'pending',
  gateway_response JSONB,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Verification appeals
CREATE TABLE verification_appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES waste_activities(id),
  user_id UUID REFERENCES profiles(id),
  reason TEXT NOT NULL,
  supporting_documents JSONB DEFAULT '[]',
  status verification_status DEFAULT 'pending',
  reviewer_id UUID,
  reviewer_comments TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Community leaderboards
CREATE TABLE community_leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  leaderboard_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  credits_earned DECIMAL(10,4) DEFAULT 0,
  activities_count INTEGER DEFAULT 0,
  rank_position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default material conversion factors
INSERT INTO material_conversion_factors (material_type, conversion_factor, regional_factor) VALUES
('organic', 0.5, 1.0),
('recyclable', 0.8, 1.1),
('plastic', 1.2, 1.2),
('paper', 0.6, 1.0),
('metal', 1.5, 1.3),
('glass', 0.4, 0.9),
('ewaste', 2.0, 1.5),
('hazardous', 1.8, 1.4);

-- Enable RLS on all tables
ALTER TABLE carbon_credit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_credit_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_credit_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_leaderboards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user data access
CREATE POLICY "Users can view their own carbon profile" ON carbon_credit_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own carbon profile" ON carbon_credit_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own carbon profile" ON carbon_credit_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own waste activities" ON waste_activities FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own waste activities" ON waste_activities FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own waste activities" ON waste_activities FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view their own carbon credits" ON carbon_credits FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create carbon credits" ON carbon_credits FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view all active orders" ON carbon_credit_orders FOR SELECT USING (status = 'active' OR user_id = auth.uid());
CREATE POLICY "Users can create their own orders" ON carbon_credit_orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own orders" ON carbon_credit_orders FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view trades they participated in" ON carbon_credit_trades FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create achievements" ON user_achievements FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own stats" ON user_stats FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own stats" ON user_stats FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own stats" ON user_stats FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own transactions" ON payment_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create transactions" ON payment_transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own appeals" ON verification_appeals FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own appeals" ON verification_appeals FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view leaderboards" ON community_leaderboards FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_waste_activities_user_id ON waste_activities(user_id);
CREATE INDEX idx_waste_activities_status ON waste_activities(status);
CREATE INDEX idx_carbon_credits_user_id ON carbon_credits(user_id);
CREATE INDEX idx_carbon_credit_orders_status ON carbon_credit_orders(status);
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_community_leaderboards_period ON community_leaderboards(period_start, period_end);
