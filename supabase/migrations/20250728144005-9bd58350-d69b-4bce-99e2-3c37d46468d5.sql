
-- Create user_phone_numbers table for storing phone numbers
CREATE TABLE public.user_phone_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_phone_numbers ENABLE ROW LEVEL SECURITY;

-- Create policies for user_phone_numbers
CREATE POLICY "Users can view their own phone numbers" 
  ON public.user_phone_numbers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own phone numbers" 
  ON public.user_phone_numbers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own phone numbers" 
  ON public.user_phone_numbers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own phone numbers" 
  ON public.user_phone_numbers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add parent_comment_id column to report_comments table
ALTER TABLE public.report_comments 
ADD COLUMN parent_comment_id UUID REFERENCES public.report_comments(id) ON DELETE CASCADE;

-- Create index for better performance on nested comments
CREATE INDEX idx_report_comments_parent_id ON public.report_comments(parent_comment_id);
