-- Fix the overly permissive notification insert policy
-- Drop the old permissive policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Create a more restrictive policy - notifications can only be created by the actor themselves
-- The triggers run as security definer so they bypass RLS anyway
CREATE POLICY "Authenticated users can create notifications" 
ON public.notifications FOR INSERT 
WITH CHECK (auth.uid() = actor_id);