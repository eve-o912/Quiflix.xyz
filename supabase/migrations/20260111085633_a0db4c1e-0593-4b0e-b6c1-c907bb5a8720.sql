-- Create films table
CREATE TABLE public.films (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  duration TEXT,
  poster_url TEXT NOT NULL,
  trailer_url TEXT,
  film_url TEXT NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE NOT NULL,
  distributor_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('wallet', 'custodial', 'mpesa')),
  transaction_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create distribution_tokens table
CREATE TABLE public.distribution_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  distributor_id UUID NOT NULL,
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE NOT NULL,
  token_code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(distributor_id, film_id)
);

-- Enable Row Level Security
ALTER TABLE public.films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribution_tokens ENABLE ROW LEVEL SECURITY;

-- Films RLS policies
CREATE POLICY "Anyone can view approved films" 
ON public.films 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can view their own films" 
ON public.films 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own films" 
ON public.films 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own films" 
ON public.films 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Purchases RLS policies
CREATE POLICY "Users can view their own purchases" 
ON public.purchases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases" 
ON public.purchases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Distribution tokens RLS policies
CREATE POLICY "Distributors can view their own tokens" 
ON public.distribution_tokens 
FOR SELECT 
USING (auth.uid() = distributor_id);

CREATE POLICY "Anyone can view active tokens for lookup" 
ON public.distribution_tokens 
FOR SELECT 
USING (is_active = true);

-- Create storage buckets for posters and trailers
INSERT INTO storage.buckets (id, name, public) VALUES ('posters', 'posters', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('trailers', 'trailers', true);

-- Storage policies for posters
CREATE POLICY "Anyone can view posters" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'posters');

CREATE POLICY "Authenticated users can upload posters" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'posters' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own posters" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'posters' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for trailers
CREATE POLICY "Anyone can view trailers" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'trailers');

CREATE POLICY "Authenticated users can upload trailers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'trailers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own trailers" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'trailers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for films
CREATE TRIGGER update_films_updated_at
BEFORE UPDATE ON public.films
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();