-- Add explicit PERMISSIVE policies with auth check to ensure unauthenticated users are blocked
-- Note: The existing policies are RESTRICTIVE (Permissive: No) which means they deny by default
-- Adding PERMISSIVE policies to allow authenticated access while blocking unauthenticated

-- For distributor_applications - ensure only authenticated users with matching user_id can SELECT
DROP POLICY IF EXISTS "Users can view their own applications" ON public.distributor_applications;
CREATE POLICY "Users can view their own applications" 
ON public.distributor_applications 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- For distribution_tokens - update to explicitly require authentication
DROP POLICY IF EXISTS "Distributors can view their own tokens" ON public.distribution_tokens;
CREATE POLICY "Distributors can view their own tokens" 
ON public.distribution_tokens 
FOR SELECT 
TO authenticated
USING (auth.uid() = distributor_id);

-- For purchases - update to explicitly require authentication
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.purchases;
CREATE POLICY "Users can view their own purchases" 
ON public.purchases 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);