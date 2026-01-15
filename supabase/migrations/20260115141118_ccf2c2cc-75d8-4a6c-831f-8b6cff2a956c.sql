-- Drop the existing RESTRICTIVE policies on distributor_applications
DROP POLICY IF EXISTS "Users can insert their own applications" ON public.distributor_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.distributor_applications;

-- Create proper PERMISSIVE policies (default behavior)
-- Users can only view their own applications
CREATE POLICY "Users can view their own applications"
ON public.distributor_applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can only insert their own applications
CREATE POLICY "Users can insert their own applications"
ON public.distributor_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);