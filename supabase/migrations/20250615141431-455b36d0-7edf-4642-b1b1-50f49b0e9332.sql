
-- Create enum types for green bonds
CREATE TYPE bond_category AS ENUM ('renewable_energy', 'energy_efficiency', 'clean_transportation', 'sustainable_water', 'waste_management', 'biodiversity', 'climate_adaptation');
CREATE TYPE bond_status AS ENUM ('draft', 'active', 'closed', 'matured', 'defaulted');
CREATE TYPE investment_tier AS ENUM ('retail', 'accredited', 'institutional');
CREATE TYPE payment_frequency AS ENUM ('monthly', 'quarterly', 'semi_annual', 'annual');
CREATE TYPE bond_rating AS ENUM ('AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-', 'B+', 'B', 'B-');

-- Green bonds table
CREATE TABLE green_bonds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issuer_name TEXT NOT NULL,
  issuer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bond_name TEXT NOT NULL,
  bond_symbol TEXT UNIQUE NOT NULL,
  category bond_category NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  available_amount DECIMAL(15,2) NOT NULL,
  minimum_investment DECIMAL(12,2) NOT NULL DEFAULT 1000,
  maximum_investment DECIMAL(15,2),
  interest_rate DECIMAL(5,4) NOT NULL,
  payment_frequency payment_frequency NOT NULL DEFAULT 'quarterly',
  issue_date DATE NOT NULL,
  maturity_date DATE NOT NULL,
  bond_rating bond_rating,
  status bond_status NOT NULL DEFAULT 'draft',
  description TEXT,
  project_details JSONB DEFAULT '{}',
  environmental_impact JSONB DEFAULT '{}',
  risk_factors TEXT[],
  use_of_proceeds TEXT,
  documents JSONB DEFAULT '[]',
  verification_status TEXT DEFAULT 'pending',
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bond investments table
CREATE TABLE bond_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bond_id UUID REFERENCES green_bonds(id) ON DELETE CASCADE,
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  investment_amount DECIMAL(12,2) NOT NULL,
  purchase_price DECIMAL(8,4) NOT NULL DEFAULT 100.0000,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  maturity_date DATE NOT NULL,
  expected_return DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'active',
  investment_tier investment_tier NOT NULL DEFAULT 'retail',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bond interest payments table
CREATE TABLE bond_interest_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID REFERENCES bond_investments(id) ON DELETE CASCADE,
  bond_id UUID REFERENCES green_bonds(id) ON DELETE CASCADE,
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  payment_amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Bond impact tracking table
CREATE TABLE bond_impact_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bond_id UUID REFERENCES green_bonds(id) ON DELETE CASCADE,
  reporting_period_start DATE NOT NULL,
  reporting_period_end DATE NOT NULL,
  impact_data JSONB NOT NULL DEFAULT '{}',
  verification_status TEXT DEFAULT 'pending',
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bond secondary market orders table
CREATE TABLE bond_market_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bond_id UUID REFERENCES green_bonds(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id),
  order_type TEXT NOT NULL, -- 'sell', 'buy'
  quantity DECIMAL(12,2) NOT NULL,
  price_per_unit DECIMAL(8,4) NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE,
  filled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bond portfolio summary table
CREATE TABLE bond_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_invested DECIMAL(15,2) DEFAULT 0,
  current_value DECIMAL(15,2) DEFAULT 0,
  total_returns DECIMAL(15,2) DEFAULT 0,
  overall_yield DECIMAL(5,4) DEFAULT 0,
  active_investments INTEGER DEFAULT 0,
  total_co2_reduced DECIMAL(12,2) DEFAULT 0,
  clean_energy_supported DECIMAL(12,2) DEFAULT 0,
  jobs_created INTEGER DEFAULT 0,
  communities_benefited INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE green_bonds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bond_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bond_interest_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bond_impact_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE bond_market_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bond_portfolios ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active bonds" ON green_bonds FOR SELECT USING (status = 'active');
CREATE POLICY "Issuers can manage their bonds" ON green_bonds FOR ALL USING (issuer_id = auth.uid());

CREATE POLICY "Investors can view their investments" ON bond_investments FOR SELECT USING (investor_id = auth.uid());
CREATE POLICY "Investors can create investments" ON bond_investments FOR INSERT WITH CHECK (investor_id = auth.uid());

CREATE POLICY "Investors can view their payments" ON bond_interest_payments FOR SELECT USING (investor_id = auth.uid());
CREATE POLICY "System can create payments" ON bond_interest_payments FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view verified impact data" ON bond_impact_tracking FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Issuers can create impact reports" ON bond_impact_tracking FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM green_bonds WHERE id = bond_id AND issuer_id = auth.uid())
);

CREATE POLICY "Users can view market orders" ON bond_market_orders FOR SELECT USING (true);
CREATE POLICY "Users can create their own orders" ON bond_market_orders FOR INSERT WITH CHECK (seller_id = auth.uid() OR buyer_id = auth.uid());
CREATE POLICY "Users can update their own orders" ON bond_market_orders FOR UPDATE USING (seller_id = auth.uid() OR buyer_id = auth.uid());

CREATE POLICY "Users can view their own portfolio" ON bond_portfolios FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own portfolio" ON bond_portfolios FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_green_bonds_status ON green_bonds(status);
CREATE INDEX idx_green_bonds_category ON green_bonds(category);
CREATE INDEX idx_bond_investments_investor ON bond_investments(investor_id);
CREATE INDEX idx_bond_investments_bond ON bond_investments(bond_id);
CREATE INDEX idx_bond_payments_investor ON bond_interest_payments(investor_id);
CREATE INDEX idx_bond_market_orders_bond ON bond_market_orders(bond_id);
CREATE INDEX idx_bond_portfolios_user ON bond_portfolios(user_id);

-- Insert sample green bonds data
INSERT INTO green_bonds (
  issuer_name, bond_name, bond_symbol, category, total_amount, available_amount, 
  minimum_investment, interest_rate, issue_date, maturity_date, bond_rating,
  status, description, project_details, environmental_impact, use_of_proceeds
) VALUES 
(
  'Green Energy Corp',
  'Solar Energy Infrastructure Bond',
  'GEC-SOL-2024',
  'renewable_energy',
  500000000,
  250000000,
  1000,
  0.075,
  '2024-01-01',
  '2029-12-31',
  'AAA',
  'active',
  'Financing large-scale solar energy projects across India',
  '{"project_capacity": "50 MW", "location": "Rajasthan", "technology": "Solar PV", "construction_timeline": "18 months"}',
  '{"co2_reduction_target": 100000, "renewable_energy_target": 50000, "jobs_created_target": 200, "communities_benefited_target": 10000}',
  'Proceeds will be used exclusively for construction and operation of solar energy facilities'
),
(
  'Municipal Water Corp',
  'Water Treatment Infrastructure Bond',
  'MWC-H2O-2024',
  'sustainable_water',
  300000000,
  150000000,
  5000,
  0.068,
  '2024-02-01',
  '2031-01-31',
  'AA+',
  'active',
  'Funding advanced water treatment and distribution systems',
  '{"treatment_capacity": "10 million liters/day", "location": "Mumbai", "technology": "Advanced RO and UV", "construction_timeline": "24 months"}',
  '{"water_capacity_target": 10000000, "people_served_target": 50000, "jobs_created_target": 150, "communities_benefited_target": 5000}',
  'Proceeds will finance construction of water treatment plants and distribution infrastructure'
);
