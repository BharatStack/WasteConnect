-- CarbonBridge India — Supabase Migration
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- 1. CarbonBridge Listings (marketplace)
CREATE TABLE IF NOT EXISTS cb_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credit_type TEXT NOT NULL CHECK (credit_type IN ('ESCert','VCC','REC','CCTS','CER')),
  standard TEXT,
  serial_number TEXT UNIQUE NOT NULL,
  vintage_year SMALLINT NOT NULL,
  quantity DECIMAL(15,4) NOT NULL,
  available_quantity DECIMAL(15,4) NOT NULL,
  price_per_credit DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  project_name TEXT,
  project_location TEXT,
  methodology TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'LISTED' CHECK (status IN ('PENDING','LISTED','SOLD','EXPIRED','DELISTED')),
  expiry_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CarbonBridge Transactions (purchases)
CREATE TABLE IF NOT EXISTS cb_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES cb_listings(id),
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  quantity DECIMAL(15,4) NOT NULL,
  price_per_credit DECIMAL(12,2) NOT NULL,
  gross_value DECIMAL(15,2) NOT NULL,
  buyer_commission DECIMAL(12,2) NOT NULL DEFAULT 0,
  gst_on_commission DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_buyer_pays DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'INITIATED' CHECK (status IN ('INITIATED','PAYMENT_PENDING','COMPLETED','FAILED','CANCELLED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 3. Emission Calculation Reports  
CREATE TABLE IF NOT EXISTS cb_emission_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  diesel_litres DECIMAL(15,2) DEFAULT 0,
  petrol_litres DECIMAL(15,2) DEFAULT 0,
  lpg_kg DECIMAL(15,2) DEFAULT 0,
  natural_gas_scm DECIMAL(15,2) DEFAULT 0,
  coal_tonnes DECIMAL(15,2) DEFAULT 0,
  electricity_kwh DECIMAL(15,2) DEFAULT 0,
  grid_region TEXT DEFAULT 'national',
  scope1_tco2e DECIMAL(15,4) NOT NULL,
  scope2_tco2e DECIMAL(15,4) NOT NULL,
  total_tco2e DECIMAL(15,4) NOT NULL,
  credits_needed INT NOT NULL,
  estimated_budget DECIMAL(15,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CarbonBridge Credit Portfolio (owned credits from purchases)
CREATE TABLE IF NOT EXISTS cb_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES cb_transactions(id),
  listing_id UUID REFERENCES cb_listings(id),
  credit_type TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  quantity DECIMAL(15,4) NOT NULL,
  purchase_price DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','RETIRED','TRANSFERRED')),
  retired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE cb_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cb_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cb_emission_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE cb_portfolio ENABLE ROW LEVEL SECURITY;

-- Listings: anyone can read, owner can insert/update/delete
CREATE POLICY "Anyone can read listings" ON cb_listings FOR SELECT USING (true);
CREATE POLICY "Users can create listings" ON cb_listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own listings" ON cb_listings FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Users can delete own listings" ON cb_listings FOR DELETE USING (auth.uid() = seller_id);

-- Transactions: participants can read, buyer can create
CREATE POLICY "Users can read own transactions" ON cb_transactions FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can create transactions" ON cb_transactions FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can update own transactions" ON cb_transactions FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Emission reports: owner only
CREATE POLICY "Users can read own reports" ON cb_emission_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reports" ON cb_emission_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reports" ON cb_emission_reports FOR DELETE USING (auth.uid() = user_id);

-- Portfolio: owner only
CREATE POLICY "Users can read own portfolio" ON cb_portfolio FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert portfolio" ON cb_portfolio FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own portfolio" ON cb_portfolio FOR UPDATE USING (auth.uid() = owner_id);
