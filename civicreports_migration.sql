-- CivicReports Migration: Adds ward data + citizen_reports enhancements
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Add new columns to citizen_reports (if they don't already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'citizen_reports' AND column_name = 'category') THEN
    ALTER TABLE citizen_reports ADD COLUMN category TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'citizen_reports' AND column_name = 'ward_id') THEN
    ALTER TABLE citizen_reports ADD COLUMN ward_id INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'citizen_reports' AND column_name = 'ward_name') THEN
    ALTER TABLE citizen_reports ADD COLUMN ward_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'citizen_reports' AND column_name = 'vote_count') THEN
    ALTER TABLE citizen_reports ADD COLUMN vote_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- 2. Create wards table for lookup (optional, data is also embedded in frontend)
CREATE TABLE IF NOT EXISTS wards (
  ward_id INTEGER PRIMARY KEY,
  ward_name VARCHAR(200) NOT NULL,
  zone VARCHAR(100),
  assembly_constituency VARCHAR(200),
  mla_name VARCHAR(200),
  mla_party VARCHAR(50),
  mp_constituency VARCHAR(200),
  mp_name VARCHAR(200),
  mp_party VARCHAR(50),
  corporator TEXT,
  local_administrator TEXT,
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS policies
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;

-- Allow public read access to wards
CREATE POLICY IF NOT EXISTS "wards_public_read" ON wards
  FOR SELECT USING (true);

-- Ensure citizen_reports allows insert with new columns
-- (existing RLS policies should already handle this)

-- 4. Add index for ward_id lookups on citizen_reports
CREATE INDEX IF NOT EXISTS idx_citizen_reports_ward_id ON citizen_reports(ward_id);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_category ON citizen_reports(category);

-- Done! The wards data is embedded in the frontend TypeScript file (src/data/bbmpWards.ts)
-- so no seed data INSERT is required for the wards table unless you want DB-level lookups.
