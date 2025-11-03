-- Ensure posts table supports soft deletes
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for better performance on deleted posts
CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON public.posts(deleted_at) WHERE deleted_at IS NULL;

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- Enable realtime for post_comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;

-- Enable realtime for post_reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_reactions;

-- Enable realtime for community_members
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_members;
