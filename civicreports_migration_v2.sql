-- CivicReports Migration V2: RLS fix + Resolve + Rewards + Auto-cleanup
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Fix RLS: Auto-set user_id on insert via trigger
CREATE OR REPLACE FUNCTION set_citizen_report_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_set_report_user_id ON citizen_reports;
CREATE TRIGGER tr_set_report_user_id
  BEFORE INSERT ON citizen_reports
  FOR EACH ROW
  EXECUTE FUNCTION set_citizen_report_user_id();

-- 2. Add resolve + activity columns
ALTER TABLE citizen_reports ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;
ALTER TABLE citizen_reports ADD COLUMN IF NOT EXISTS resolved_by TEXT;
ALTER TABLE citizen_reports ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Create report_comments table
CREATE TABLE IF NOT EXISTS report_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES citizen_reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE report_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "comments_public_read" ON report_comments;
CREATE POLICY "comments_public_read" ON report_comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "comments_auth_insert" ON report_comments;
CREATE POLICY "comments_auth_insert" ON report_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Create report_votes table
CREATE TABLE IF NOT EXISTS report_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES citizen_reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(report_id, user_id)
);
ALTER TABLE report_votes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "votes_public_read" ON report_votes;
CREATE POLICY "votes_public_read" ON report_votes FOR SELECT USING (true);
DROP POLICY IF EXISTS "votes_auth_insert" ON report_votes;
CREATE POLICY "votes_auth_insert" ON report_votes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 5. Create representative_rewards table
CREATE TABLE IF NOT EXISTS representative_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ward_id INTEGER,
  ward_name TEXT,
  representative_type TEXT CHECK (representative_type IN ('mla', 'mp')),
  representative_name TEXT,
  party TEXT,
  report_id UUID REFERENCES citizen_reports(id),
  resolution_hours INTEGER,
  reward_points INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE representative_rewards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rewards_public_read" ON representative_rewards;
CREATE POLICY "rewards_public_read" ON representative_rewards FOR SELECT USING (true);
DROP POLICY IF EXISTS "rewards_auth_insert" ON representative_rewards;
CREATE POLICY "rewards_auth_insert" ON representative_rewards FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 6. Ensure citizen_reports RLS allows authenticated inserts with new columns
-- Drop and recreate INSERT policy to be permissive
DROP POLICY IF EXISTS "citizen_reports_insert" ON citizen_reports;
CREATE POLICY "citizen_reports_insert" ON citizen_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure UPDATE policy exists for resolving
DROP POLICY IF EXISTS "citizen_reports_update_own" ON citizen_reports;
CREATE POLICY "citizen_reports_update_own" ON citizen_reports
  FOR UPDATE USING (auth.uid() = user_id);

-- 7. Municipality responses table (if not exists)
CREATE TABLE IF NOT EXISTS municipality_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES citizen_reports(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  status_update TEXT,
  responder_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE municipality_responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "responses_public_read" ON municipality_responses;
CREATE POLICY "responses_public_read" ON municipality_responses FOR SELECT USING (true);
DROP POLICY IF EXISTS "responses_auth_insert" ON municipality_responses;
CREATE POLICY "responses_auth_insert" ON municipality_responses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Done!
