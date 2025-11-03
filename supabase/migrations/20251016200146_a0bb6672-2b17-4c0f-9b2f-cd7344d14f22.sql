-- Fix infinite recursion in communities RLS policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Members can view private communities" ON public.communities;

-- Create corrected policy that doesn't cause recursion
CREATE POLICY "Members can view private communities" 
ON public.communities 
FOR SELECT 
USING (
  (visibility = 'private') 
  AND EXISTS (
    SELECT 1 
    FROM community_members 
    WHERE community_members.community_id = communities.id 
    AND community_members.user_id = auth.uid()
  )
);