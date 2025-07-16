
-- Create municipalities table
CREATE TABLE municipalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    area_boundaries JSONB, -- GeoJSON polygon for coverage area
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    head_officer VARCHAR(255),
    performance_score DECIMAL(3,2) DEFAULT 0,
    total_reports INTEGER DEFAULT 0,
    resolved_reports INTEGER DEFAULT 0,
    avg_resolution_time_hours DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resolutions table
CREATE TABLE resolutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL,
    resolved_by UUID NOT NULL, -- municipal staff user ID
    resolution_date TIMESTAMP WITH TIME ZONE NOT NULL,
    before_photo_url TEXT, -- from original report
    after_photo_url TEXT, -- resolution evidence
    description TEXT,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verified_by UUID, -- verifier user ID
    verified_at TIMESTAMP WITH TIME ZONE,
    citizen_feedback_score INTEGER CHECK (citizen_feedback_score >= 1 AND citizen_feedback_score <= 5),
    citizen_feedback_text TEXT,
    resolution_method VARCHAR(255),
    resources_used TEXT,
    cost_estimate DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (report_id) REFERENCES citizen_reports(id) ON DELETE CASCADE
);

-- Create municipal_staff table
CREATE TABLE municipal_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    municipality_id UUID NOT NULL,
    role VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('staff', 'supervisor', 'admin')),
    department VARCHAR(100),
    permissions JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE CASCADE,
    UNIQUE(user_id, municipality_id)
);

-- Create verification_logs table
CREATE TABLE verification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resolution_id UUID NOT NULL,
    verifier_id UUID NOT NULL,
    verification_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('approved', 'rejected', 'needs_review')),
    notes TEXT,
    checklist_items JSONB DEFAULT '{}', -- verification criteria
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (resolution_id) REFERENCES resolutions(id) ON DELETE CASCADE
);

-- Create analytics_metrics table
CREATE TABLE analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID,
    metric_type VARCHAR(50) CHECK (metric_type IN ('resolution_rate', 'avg_response_time', 'citizen_satisfaction', 'monthly_reports')),
    metric_value DECIMAL(10,2),
    calculation_date DATE,
    period_start DATE,
    period_end DATE,
    additional_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE SET NULL
);

-- Add new columns to existing citizen_reports table
ALTER TABLE citizen_reports 
ADD COLUMN IF NOT EXISTS municipality_id UUID,
ADD COLUMN IF NOT EXISTS assigned_to UUID,
ADD COLUMN IF NOT EXISTS resolution_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
ADD COLUMN IF NOT EXISTS auto_assigned BOOLEAN DEFAULT TRUE;

-- Update status column to include new statuses
ALTER TABLE citizen_reports 
DROP CONSTRAINT IF EXISTS citizen_reports_status_check;

ALTER TABLE citizen_reports 
ADD CONSTRAINT citizen_reports_status_check 
CHECK (status IN ('pending', 'in_progress', 'resolved', 'invalid', 'reopened'));

-- Add foreign key constraints
ALTER TABLE citizen_reports 
ADD CONSTRAINT fk_municipality FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE SET NULL;

-- Enable RLS on new tables
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipal_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for municipalities
CREATE POLICY "Anyone can view municipalities" ON municipalities 
FOR SELECT USING (true);

CREATE POLICY "Municipal admin can manage municipalities" ON municipalities 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM municipal_staff 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for resolutions
CREATE POLICY "Users can view resolutions" ON resolutions 
FOR SELECT USING (true);

CREATE POLICY "Municipal staff can create resolutions" ON resolutions 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM municipal_staff 
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "Resolution creator can update" ON resolutions 
FOR UPDATE USING (resolved_by = auth.uid());

-- RLS Policies for municipal_staff
CREATE POLICY "Municipal staff can view their own records" ON municipal_staff 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Municipal admin can manage staff" ON municipal_staff 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM municipal_staff ms 
    WHERE ms.user_id = auth.uid() AND ms.role = 'admin'
  )
);

-- RLS Policies for verification_logs
CREATE POLICY "Users can view verification logs" ON verification_logs 
FOR SELECT USING (true);

CREATE POLICY "Municipal supervisor can create verification logs" ON verification_logs 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM municipal_staff 
    WHERE user_id = auth.uid() AND role IN ('supervisor', 'admin')
  )
);

-- RLS Policies for analytics_metrics
CREATE POLICY "Anyone can view analytics metrics" ON analytics_metrics 
FOR SELECT USING (true);

CREATE POLICY "System can manage analytics" ON analytics_metrics 
FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_citizen_reports_municipality ON citizen_reports(municipality_id);
CREATE INDEX idx_citizen_reports_status ON citizen_reports(status);
CREATE INDEX idx_resolutions_report_id ON resolutions(report_id);
CREATE INDEX idx_municipal_staff_user_id ON municipal_staff(user_id);
CREATE INDEX idx_analytics_metrics_municipality ON analytics_metrics(municipality_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_municipalities_updated_at 
    BEFORE UPDATE ON municipalities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
