
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enums for various status and type fields
CREATE TYPE bond_category AS ENUM ('renewable_energy', 'waste_management', 'water_treatment', 'sustainable_transport', 'green_buildings', 'biodiversity');
CREATE TYPE bond_status AS ENUM ('draft', 'active', 'funded', 'completed', 'cancelled');
CREATE TYPE bond_rating AS ENUM ('AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-');
CREATE TYPE payment_frequency AS ENUM ('monthly', 'quarterly', 'semi_annual', 'annual');
CREATE TYPE investment_tier AS ENUM ('retail', 'institutional', 'accredited');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE loan_status AS ENUM ('pending', 'approved', 'active', 'completed', 'defaulted', 'cancelled');
CREATE TYPE risk_level AS ENUM ('very_low', 'low', 'medium', 'high', 'very_high');
CREATE TYPE income_verification_type AS ENUM ('traditional', 'mobile_money', 'satellite_agriculture', 'social_scoring', 'biometric');

-- Green Bonds Platform Tables

-- Enhanced green bonds table
CREATE TABLE green_bonds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bond_name TEXT NOT NULL,
    bond_symbol TEXT NOT NULL UNIQUE,
    issuer_name TEXT NOT NULL,
    issuer_id UUID REFERENCES profiles(id),
    description TEXT,
    category bond_category NOT NULL,
    total_amount NUMERIC(15,2) NOT NULL,
    available_amount NUMERIC(15,2) NOT NULL,
    minimum_investment NUMERIC(10,2) NOT NULL DEFAULT 1000,
    maximum_investment NUMERIC(15,2),
    interest_rate NUMERIC(5,4) NOT NULL,
    payment_frequency payment_frequency NOT NULL DEFAULT 'quarterly',
    issue_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    bond_rating bond_rating,
    status bond_status NOT NULL DEFAULT 'draft',
    verification_status TEXT DEFAULT 'pending',
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    use_of_proceeds TEXT,
    project_details JSONB DEFAULT '{}',
    environmental_impact JSONB DEFAULT '{}',
    risk_factors TEXT[],
    documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced bond investments table
CREATE TABLE bond_investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bond_id UUID REFERENCES green_bonds(id) ON DELETE CASCADE,
    investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    investment_amount NUMERIC(15,2) NOT NULL,
    purchase_price NUMERIC(8,4) NOT NULL DEFAULT 100.0000,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    maturity_date DATE NOT NULL,
    expected_return NUMERIC(15,2) NOT NULL,
    investment_tier investment_tier NOT NULL DEFAULT 'retail',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Environmental impact tracking
CREATE TABLE environmental_impact_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bond_id UUID REFERENCES green_bonds(id) ON DELETE CASCADE,
    reporting_period_start DATE NOT NULL,
    reporting_period_end DATE NOT NULL,
    carbon_reduction_tons NUMERIC(12,2) DEFAULT 0,
    renewable_energy_mwh NUMERIC(12,2) DEFAULT 0,
    waste_processed_tons NUMERIC(12,2) DEFAULT 0,
    water_saved_liters NUMERIC(15,2) DEFAULT 0,
    biodiversity_score NUMERIC(5,2) DEFAULT 0,
    jobs_created INTEGER DEFAULT 0,
    communities_benefited INTEGER DEFAULT 0,
    verification_status verification_status DEFAULT 'pending',
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    satellite_data JSONB DEFAULT '{}',
    iot_sensor_data JSONB DEFAULT '{}',
    third_party_reports JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI-powered greenwashing detection
CREATE TABLE greenwashing_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bond_id UUID REFERENCES green_bonds(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL,
    severity risk_level NOT NULL,
    description TEXT NOT NULL,
    ai_confidence_score NUMERIC(3,2) NOT NULL,
    evidence JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active',
    resolved_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Smart bond pricing engine
CREATE TABLE bond_pricing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bond_id UUID REFERENCES green_bonds(id) ON DELETE CASCADE,
    price NUMERIC(8,4) NOT NULL,
    pricing_factors JSONB NOT NULL,
    environmental_performance_score NUMERIC(5,2),
    market_conditions JSONB DEFAULT '{}',
    ai_pricing_model_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Micro-Finance Platform Tables

-- Enhanced user profiles for micro-finance
CREATE TABLE microfinance_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    phone_number TEXT,
    alternative_phone TEXT,
    occupation TEXT,
    monthly_income NUMERIC(10,2),
    income_verification_type income_verification_type DEFAULT 'traditional',
    employment_status TEXT,
    business_type TEXT,
    business_registration_number TEXT,
    family_size INTEGER,
    dependents INTEGER,
    education_level TEXT,
    digital_literacy_score NUMERIC(3,2),
    financial_literacy_score NUMERIC(3,2),
    community_standing_score NUMERIC(3,2),
    social_connections INTEGER DEFAULT 0,
    geographic_stability_months INTEGER,
    device_fingerprint TEXT,
    preferred_language TEXT DEFAULT 'en',
    communication_preference TEXT DEFAULT 'sms',
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Alternative credit scoring data
CREATE TABLE alternative_credit_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    mobile_money_history JSONB DEFAULT '{}',
    airtime_purchase_patterns JSONB DEFAULT '{}',
    transaction_history JSONB DEFAULT '{}',
    social_media_scores JSONB DEFAULT '{}',
    location_stability JSONB DEFAULT '{}',
    device_usage_patterns JSONB DEFAULT '{}',
    network_analysis JSONB DEFAULT '{}',
    seasonal_income_patterns JSONB DEFAULT '{}',
    agricultural_data JSONB DEFAULT '{}',
    satellite_crop_data JSONB DEFAULT '{}',
    weather_correlation JSONB DEFAULT '{}',
    market_price_exposure JSONB DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    data_sources TEXT[],
    confidence_score NUMERIC(3,2) DEFAULT 0
);

-- AI-powered credit scores
CREATE TABLE ai_credit_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 300 AND overall_score <= 850),
    traditional_credit_score INTEGER,
    alternative_data_score INTEGER NOT NULL,
    social_score INTEGER,
    behavioral_score INTEGER,
    income_prediction_score INTEGER,
    stability_score INTEGER,
    digital_footprint_score INTEGER,
    model_version TEXT NOT NULL,
    confidence_level NUMERIC(3,2) NOT NULL,
    score_breakdown JSONB NOT NULL,
    risk_factors TEXT[],
    positive_factors TEXT[],
    score_trend JSONB DEFAULT '{}',
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days')
);

-- Loan applications and management
CREATE TABLE microfinance_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    loan_amount NUMERIC(12,2) NOT NULL,
    approved_amount NUMERIC(12,2),
    interest_rate NUMERIC(5,4) NOT NULL,
    term_months INTEGER NOT NULL,
    purpose TEXT NOT NULL,
    loan_type TEXT NOT NULL,
    status loan_status DEFAULT 'pending',
    risk_level risk_level,
    credit_score_at_approval INTEGER,
    collateral_type TEXT,
    collateral_value NUMERIC(12,2),
    guarantor_id UUID REFERENCES profiles(id),
    lending_circle_id UUID,
    application_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    approval_date TIMESTAMP WITH TIME ZONE,
    disbursement_date TIMESTAMP WITH TIME ZONE,
    first_payment_date DATE,
    maturity_date DATE,
    total_interest NUMERIC(12,2),
    total_repayment NUMERIC(12,2),
    outstanding_balance NUMERIC(12,2),
    payments_made INTEGER DEFAULT 0,
    payments_missed INTEGER DEFAULT 0,
    current_payment_status TEXT DEFAULT 'current',
    ai_approval_factors JSONB DEFAULT '{}',
    risk_mitigation_measures JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Community lending circles
CREATE TABLE lending_circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_name TEXT NOT NULL,
    circle_type TEXT DEFAULT 'peer_guarantee',
    organizer_id UUID REFERENCES profiles(id),
    max_members INTEGER DEFAULT 20,
    current_members INTEGER DEFAULT 0,
    minimum_contribution NUMERIC(10,2),
    meeting_frequency TEXT DEFAULT 'weekly',
    meeting_location TEXT,
    social_guarantee_amount NUMERIC(12,2),
    default_protection_fund NUMERIC(12,2) DEFAULT 0,
    circle_status TEXT DEFAULT 'forming',
    formation_date DATE,
    first_meeting_date DATE,
    success_rate NUMERIC(3,2) DEFAULT 0,
    total_loans_issued INTEGER DEFAULT 0,
    total_amount_disbursed NUMERIC(15,2) DEFAULT 0,
    circle_reputation_score NUMERIC(3,2) DEFAULT 0,
    geographic_area TEXT,
    community_ties_strength NUMERIC(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Circle membership
CREATE TABLE circle_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID REFERENCES lending_circles(id) ON DELETE CASCADE,
    member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    join_date DATE DEFAULT CURRENT_DATE,
    contribution_amount NUMERIC(10,2),
    guarantee_commitment NUMERIC(10,2),
    attendance_rate NUMERIC(3,2) DEFAULT 1.0,
    peer_rating NUMERIC(3,2),
    loans_guaranteed INTEGER DEFAULT 0,
    successful_guarantees INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    exit_date DATE,
    exit_reason TEXT,
    UNIQUE(circle_id, member_id)
);

-- Real-time risk monitoring
CREATE TABLE risk_monitoring_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    loan_id UUID REFERENCES microfinance_loans(id),
    alert_type TEXT NOT NULL,
    severity risk_level NOT NULL,
    description TEXT NOT NULL,
    trigger_factors JSONB NOT NULL,
    risk_score_change NUMERIC(5,2),
    recommended_actions TEXT[],
    auto_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payment processing and tracking
CREATE TABLE loan_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID REFERENCES microfinance_loans(id) ON DELETE CASCADE,
    payment_amount NUMERIC(12,2) NOT NULL,
    principal_amount NUMERIC(12,2) NOT NULL,
    interest_amount NUMERIC(12,2) NOT NULL,
    fee_amount NUMERIC(12,2) DEFAULT 0,
    payment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_reference TEXT,
    payment_channel TEXT,
    agent_id UUID REFERENCES profiles(id),
    late_fee NUMERIC(10,2) DEFAULT 0,
    days_late INTEGER DEFAULT 0,
    payment_status TEXT DEFAULT 'completed',
    mobile_money_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Financial education and gamification
CREATE TABLE financial_education_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    module_name TEXT NOT NULL,
    category TEXT NOT NULL,
    progress_percentage NUMERIC(3,2) DEFAULT 0,
    completion_date DATE,
    quiz_scores JSONB DEFAULT '{}',
    time_spent_minutes INTEGER DEFAULT 0,
    badges_earned TEXT[],
    points_earned INTEGER DEFAULT 0,
    language TEXT DEFAULT 'en',
    preferred_format TEXT DEFAULT 'interactive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Biometric authentication logs
CREATE TABLE biometric_authentications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    authentication_type TEXT NOT NULL,
    biometric_hash TEXT NOT NULL,
    device_id TEXT,
    location_data POINT,
    authentication_result BOOLEAN NOT NULL,
    confidence_score NUMERIC(3,2),
    fraud_indicators JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_green_bonds_status ON green_bonds(status);
CREATE INDEX idx_green_bonds_category ON green_bonds(category);
CREATE INDEX idx_green_bonds_issuer ON green_bonds(issuer_id);
CREATE INDEX idx_bond_investments_investor ON bond_investments(investor_id);
CREATE INDEX idx_bond_investments_bond ON bond_investments(bond_id);
CREATE INDEX idx_microfinance_loans_borrower ON microfinance_loans(borrower_id);
CREATE INDEX idx_microfinance_loans_status ON microfinance_loans(status);
CREATE INDEX idx_ai_credit_scores_user ON ai_credit_scores(user_id);
CREATE INDEX idx_ai_credit_scores_expires ON ai_credit_scores(expires_at);
CREATE INDEX idx_loan_payments_loan ON loan_payments(loan_id);
CREATE INDEX idx_loan_payments_date ON loan_payments(due_date);
CREATE INDEX idx_alternative_credit_data_user ON alternative_credit_data(user_id);
CREATE INDEX idx_risk_monitoring_alerts_user ON risk_monitoring_alerts(user_id);
CREATE INDEX idx_circle_memberships_circle ON circle_memberships(circle_id);
CREATE INDEX idx_circle_memberships_member ON circle_memberships(member_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_green_bonds_updated_at
    BEFORE UPDATE ON green_bonds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bond_investments_updated_at
    BEFORE UPDATE ON bond_investments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_microfinance_profiles_updated_at
    BEFORE UPDATE ON microfinance_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_microfinance_loans_updated_at
    BEFORE UPDATE ON microfinance_loans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lending_circles_updated_at
    BEFORE UPDATE ON lending_circles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
