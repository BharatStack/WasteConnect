
-- Create plastic credit related tables

-- Table for plastic collection submissions
CREATE TABLE plastic_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collection_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  location TEXT NOT NULL,
  gps_coordinates POINT,
  description TEXT,
  photos JSONB DEFAULT '[]'::JSONB,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verifier_id UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  credits_earned DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for plastic credits
CREATE TABLE plastic_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES plastic_collections(id),
  credits_amount DECIMAL NOT NULL,
  credit_type TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'traded', 'expired')),
  earned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for plastic credit orders
CREATE TABLE plastic_credit_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_type TEXT NOT NULL CHECK (order_type IN ('buy', 'sell')),
  credit_type TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  price_per_credit DECIMAL NOT NULL,
  total_amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'filled', 'cancelled', 'expired')),
  filled_quantity DECIMAL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for plastic credit trades
CREATE TABLE plastic_credit_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buy_order_id UUID NOT NULL REFERENCES plastic_credit_orders(id),
  sell_order_id UUID NOT NULL REFERENCES plastic_credit_orders(id),
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  quantity DECIMAL NOT NULL,
  price_per_credit DECIMAL NOT NULL,
  total_amount DECIMAL NOT NULL,
  trade_status TEXT DEFAULT 'pending' CHECK (trade_status IN ('pending', 'completed', 'failed')),
  trade_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settlement_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for verification submissions
CREATE TABLE plastic_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES plastic_collections(id),
  submission_type TEXT NOT NULL,
  evidence_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  verification_notes TEXT,
  verification_score INTEGER CHECK (verification_score >= 0 AND verification_score <= 100),
  ai_verification_result JSONB DEFAULT '{}'::JSONB,
  human_verification_required BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for user portfolios
CREATE TABLE plastic_credit_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_credits DECIMAL DEFAULT 0,
  total_value DECIMAL DEFAULT 0,
  total_collections INTEGER DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  co2_offset DECIMAL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE plastic_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_credit_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_credit_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_credit_portfolios ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plastic_collections
CREATE POLICY "Users can view their own collections" ON plastic_collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own collections" ON plastic_collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections" ON plastic_collections
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for plastic_credits
CREATE POLICY "Users can view their own credits" ON plastic_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create credits" ON plastic_credits
  FOR INSERT WITH CHECK (true);

-- RLS Policies for plastic_credit_orders
CREATE POLICY "Users can view all active orders" ON plastic_credit_orders
  FOR SELECT USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON plastic_credit_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON plastic_credit_orders
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for plastic_credit_trades
CREATE POLICY "Users can view their trades" ON plastic_credit_trades
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- RLS Policies for plastic_verifications
CREATE POLICY "Users can view their verifications" ON plastic_verifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM plastic_collections 
      WHERE plastic_collections.id = plastic_verifications.collection_id 
      AND plastic_collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create verifications for their collections" ON plastic_verifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM plastic_collections 
      WHERE plastic_collections.id = plastic_verifications.collection_id 
      AND plastic_collections.user_id = auth.uid()
    )
  );

-- RLS Policies for plastic_credit_portfolios
CREATE POLICY "Users can view their own portfolio" ON plastic_credit_portfolios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own portfolio" ON plastic_credit_portfolios
  FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_plastic_collections_updated_at BEFORE UPDATE ON plastic_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plastic_credit_orders_updated_at BEFORE UPDATE ON plastic_credit_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plastic_verifications_updated_at BEFORE UPDATE ON plastic_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_plastic_collections_user_id ON plastic_collections(user_id);
CREATE INDEX idx_plastic_collections_status ON plastic_collections(verification_status);
CREATE INDEX idx_plastic_credits_user_id ON plastic_credits(user_id);
CREATE INDEX idx_plastic_credit_orders_user_id ON plastic_credit_orders(user_id);
CREATE INDEX idx_plastic_credit_orders_status ON plastic_credit_orders(status);
CREATE INDEX idx_plastic_credit_trades_buyer_id ON plastic_credit_trades(buyer_id);
CREATE INDEX idx_plastic_credit_trades_seller_id ON plastic_credit_trades(seller_id);

-- Enable real-time for all tables
ALTER TABLE plastic_collections REPLICA IDENTITY FULL;
ALTER TABLE plastic_credits REPLICA IDENTITY FULL;
ALTER TABLE plastic_credit_orders REPLICA IDENTITY FULL;
ALTER TABLE plastic_credit_trades REPLICA IDENTITY FULL;
ALTER TABLE plastic_verifications REPLICA IDENTITY FULL;
ALTER TABLE plastic_credit_portfolios REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE plastic_collections;
ALTER PUBLICATION supabase_realtime ADD TABLE plastic_credits;
ALTER PUBLICATION supabase_realtime ADD TABLE plastic_credit_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE plastic_credit_trades;
ALTER PUBLICATION supabase_realtime ADD TABLE plastic_verifications;
ALTER PUBLICATION supabase_realtime ADD TABLE plastic_credit_portfolios;
