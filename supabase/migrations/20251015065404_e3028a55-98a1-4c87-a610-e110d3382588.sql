-- Fix infinite recursion in community_members RLS policies
-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view community memberships" ON public.community_members;

-- Create simpler policies without circular dependencies
-- Allow users to view memberships of open communities
CREATE POLICY "Users can view memberships of open communities"
ON public.community_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.communities
    WHERE id = community_members.community_id
    AND visibility = 'open'
  )
);

-- Allow users to view their own memberships in any community
CREATE POLICY "Users can view their own memberships"
ON public.community_members
FOR SELECT
USING (auth.uid() = user_id);

-- Allow moderators and admins to view all memberships in their communities
CREATE POLICY "Moderators can view community memberships"
ON public.community_members
FOR SELECT
USING (
  is_community_moderator(community_id, auth.uid())
  OR is_admin(auth.uid())
);