
-- Create report_votes table for voting functionality
CREATE TABLE public.report_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES public.citizen_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(report_id, user_id)
);

-- Create report_comments table for comments functionality
CREATE TABLE public.report_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES public.citizen_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security for report_votes
ALTER TABLE public.report_votes ENABLE ROW LEVEL SECURITY;

-- Users can vote on reports
CREATE POLICY "Users can vote on reports" 
  ON public.report_votes 
  FOR ALL 
  USING (true);

-- Add Row Level Security for report_comments  
ALTER TABLE public.report_comments ENABLE ROW LEVEL SECURITY;

-- Users can comment on reports
CREATE POLICY "Users can comment on reports" 
  ON public.report_comments 
  FOR ALL 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_report_votes_report_id ON public.report_votes(report_id);
CREATE INDEX idx_report_votes_user_id ON public.report_votes(user_id);
CREATE INDEX idx_report_comments_report_id ON public.report_comments(report_id);
CREATE INDEX idx_report_comments_user_id ON public.report_comments(user_id);
