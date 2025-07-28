
-- Create a table to store phone numbers
CREATE TABLE public.user_phone_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_phone_numbers ENABLE ROW LEVEL SECURITY;

-- Create policies for phone numbers
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

-- Create a table to store public comments for citizen reports
CREATE TABLE public.report_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.citizen_reports(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.report_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for comments
ALTER TABLE public.report_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for public comments (visible to all users)
CREATE POLICY "Anyone can view report comments" 
  ON public.report_comments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON public.report_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON public.report_comments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.report_comments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at on phone numbers table
CREATE TRIGGER update_user_phone_numbers_updated_at
  BEFORE UPDATE ON public.user_phone_numbers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add trigger for updated_at on comments table
CREATE TRIGGER update_report_comments_updated_at
  BEFORE UPDATE ON public.report_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
