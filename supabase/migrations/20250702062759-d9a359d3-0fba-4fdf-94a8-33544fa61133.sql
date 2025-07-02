
-- Enable RLS on all new tables
ALTER TABLE green_bonds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bond_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_impact_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE greenwashing_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bond_pricing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE microfinance_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternative_credit_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE microfinance_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE lending_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_education_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_authentications ENABLE ROW LEVEL SECURITY;

-- Green Bonds RLS Policies

-- Green bonds policies
CREATE POLICY "Anyone can view active bonds" ON green_bonds 
  FOR SELECT USING (status = 'active');

CREATE POLICY "Issuers can manage their bonds" ON green_bonds 
  FOR ALL USING (issuer_id = auth.uid());

-- Bond investments policies
CREATE POLICY "Investors can view their investments" ON bond_investments 
  FOR SELECT USING (investor_id = auth.uid());

CREATE POLICY "Investors can create investments" ON bond_investments 
  FOR INSERT WITH CHECK (investor_id = auth.uid());

CREATE POLICY "Investors can update their investments" ON bond_investments 
  FOR UPDATE USING (investor_id = auth.uid());

-- Environmental impact tracking policies
CREATE POLICY "Anyone can view verified impact data" ON environmental_impact_tracking 
  FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Bond issuers can manage impact data" ON environmental_impact_tracking 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM green_bonds 
      WHERE id = environmental_impact_tracking.bond_id 
      AND issuer_id = auth.uid()
    )
  );

-- Greenwashing alerts policies
CREATE POLICY "Anyone can view active alerts" ON greenwashing_alerts 
  FOR SELECT USING (status = 'active');

CREATE POLICY "System can manage alerts" ON greenwashing_alerts 
  FOR ALL USING (true);

-- Bond pricing history policies
CREATE POLICY "Anyone can view pricing history" ON bond_pricing_history 
  FOR SELECT USING (true);

CREATE POLICY "System can create pricing data" ON bond_pricing_history 
  FOR INSERT WITH CHECK (true);

-- Micro-Finance RLS Policies

-- Microfinance profiles policies
CREATE POLICY "Users can view their own microfinance profile" ON microfinance_profiles 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own microfinance profile" ON microfinance_profiles 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own microfinance profile" ON microfinance_profiles 
  FOR UPDATE USING (user_id = auth.uid());

-- Alternative credit data policies
CREATE POLICY "Users can view their own credit data" ON alternative_credit_data 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage credit data" ON alternative_credit_data 
  FOR ALL USING (user_id = auth.uid() OR auth.jwt()->>'role' = 'service_role');

-- AI credit scores policies
CREATE POLICY "Users can view their own credit scores" ON ai_credit_scores 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage credit scores" ON ai_credit_scores 
  FOR ALL USING (user_id = auth.uid() OR auth.jwt()->>'role' = 'service_role');

-- Microfinance loans policies
CREATE POLICY "Borrowers can view their loans" ON microfinance_loans 
  FOR SELECT USING (borrower_id = auth.uid() OR guarantor_id = auth.uid());

CREATE POLICY "Users can create loan applications" ON microfinance_loans 
  FOR INSERT WITH CHECK (borrower_id = auth.uid());

CREATE POLICY "Borrowers can update their loans" ON microfinance_loans 
  FOR UPDATE USING (borrower_id = auth.uid());

-- Lending circles policies
CREATE POLICY "Anyone can view active circles" ON lending_circles 
  FOR SELECT USING (circle_status = 'active');

CREATE POLICY "Organizers can manage their circles" ON lending_circles 
  FOR ALL USING (organizer_id = auth.uid());

CREATE POLICY "Users can create circles" ON lending_circles 
  FOR INSERT WITH CHECK (organizer_id = auth.uid());

-- Circle memberships policies
CREATE POLICY "Members can view their memberships" ON circle_memberships 
  FOR SELECT USING (member_id = auth.uid() OR EXISTS (
    SELECT 1 FROM lending_circles 
    WHERE id = circle_memberships.circle_id 
    AND organizer_id = auth.uid()
  ));

CREATE POLICY "Users can join circles" ON circle_memberships 
  FOR INSERT WITH CHECK (member_id = auth.uid());

CREATE POLICY "Members can update their memberships" ON circle_memberships 
  FOR UPDATE USING (member_id = auth.uid() OR EXISTS (
    SELECT 1 FROM lending_circles 
    WHERE id = circle_memberships.circle_id 
    AND organizer_id = auth.uid()
  ));

-- Risk monitoring alerts policies
CREATE POLICY "Users can view their alerts" ON risk_monitoring_alerts 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage alerts" ON risk_monitoring_alerts 
  FOR ALL USING (user_id = auth.uid() OR auth.jwt()->>'role' = 'service_role');

-- Loan payments policies
CREATE POLICY "Borrowers can view their payments" ON loan_payments 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM microfinance_loans 
    WHERE id = loan_payments.loan_id 
    AND borrower_id = auth.uid()
  ));

CREATE POLICY "System can manage payments" ON loan_payments 
  FOR ALL USING (EXISTS (
    SELECT 1 FROM microfinance_loans 
    WHERE id = loan_payments.loan_id 
    AND borrower_id = auth.uid()
  ) OR auth.jwt()->>'role' = 'service_role');

-- Financial education progress policies
CREATE POLICY "Users can view their education progress" ON financial_education_progress 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their education progress" ON financial_education_progress 
  FOR ALL USING (user_id = auth.uid());

-- Biometric authentications policies
CREATE POLICY "Users can view their biometric logs" ON biometric_authentications 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create biometric logs" ON biometric_authentications 
  FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.jwt()->>'role' = 'service_role');
