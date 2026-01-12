-- Create distributor_applications table
CREATE TABLE public.distributor_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  portfolio_url TEXT,
  distribution_plan TEXT NOT NULL,
  target_films TEXT NOT NULL,
  target_customers INTEGER NOT NULL,
  timeline_months INTEGER NOT NULL,
  experience TEXT,
  social_media_links TEXT,
  additional_info TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.distributor_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view their own applications" 
ON public.distributor_applications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own applications
CREATE POLICY "Users can insert their own applications" 
ON public.distributor_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_distributor_applications_updated_at
BEFORE UPDATE ON public.distributor_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();