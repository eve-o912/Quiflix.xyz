-- Block unauthenticated/anonymous access to distributor_applications
CREATE POLICY "Block public access"
ON public.distributor_applications
FOR SELECT
TO anon
USING (false);