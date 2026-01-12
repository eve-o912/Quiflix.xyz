-- Fix distributor_applications: Add policy for admins to view all (for now, just owner can view)
-- The existing policies are fine - users can only view their own applications

-- Fix distribution_tokens: Remove the public lookup policy that exposes token_code
-- Replace with a more secure lookup function
DROP POLICY IF EXISTS "Anyone can view active tokens for lookup" ON public.distribution_tokens;

-- Create a security definer function for token validation (doesn't expose actual token)
CREATE OR REPLACE FUNCTION public.validate_distribution_token(token_to_check TEXT, film_id_to_check UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.distribution_tokens
    WHERE token_code = token_to_check
      AND film_id = film_id_to_check
      AND is_active = true
  )
$$;

-- Create function to get distributor_id from token (for purchase attribution)
CREATE OR REPLACE FUNCTION public.get_distributor_from_token(token_to_check TEXT, film_id_to_check UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT distributor_id
  FROM public.distribution_tokens
  WHERE token_code = token_to_check
    AND film_id = film_id_to_check
    AND is_active = true
  LIMIT 1
$$;