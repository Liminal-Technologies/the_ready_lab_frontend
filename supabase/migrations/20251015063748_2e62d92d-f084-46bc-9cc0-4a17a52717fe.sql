-- Add new columns to existing posts table
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS post_type TEXT NOT NULL DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'video', 'link')),
  ADD COLUMN IF NOT EXISTS media_url TEXT,
  ADD COLUMN IF NOT EXISTS media_duration_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS link_url TEXT,
  ADD COLUMN IF NOT EXISTS link_title TEXT,
  ADD COLUMN IF NOT EXISTS link_description TEXT,
  ADD COLUMN IF NOT EXISTS link_image TEXT,
  ADD COLUMN IF NOT EXISTS likes_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS saves_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS share_url TEXT;

-- Make content nullable for non-text posts
ALTER TABLE public.posts ALTER COLUMN content DROP NOT NULL;
ALTER TABLE public.posts ALTER COLUMN title DROP NOT NULL;

-- Create post reactions table
CREATE TABLE IF NOT EXISTS public.post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL DEFAULT 'like',
  emoji TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- Create post comments table  
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  parent_comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  reactions_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comment reactions table
CREATE TABLE IF NOT EXISTS public.comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.post_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id, emoji)
);

-- Create post bookmarks table (separate from bookmarks table)
CREATE TABLE IF NOT EXISTS public.post_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create post reports table
CREATE TABLE IF NOT EXISTS public.post_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community bans table
CREATE TABLE IF NOT EXISTS public.community_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  banned_by UUID NOT NULL,
  ban_type TEXT NOT NULL CHECK (ban_type IN ('soft', 'hard')),
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(community_id, user_id)
);

-- Create community moderation log table
CREATE TABLE IF NOT EXISTS public.community_moderation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  moderator_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_user_id UUID,
  target_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  target_comment_id UUID REFERENCES public.post_comments(id) ON DELETE SET NULL,
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON public.posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_trending ON public.posts(community_id, likes_count DESC, saves_count DESC);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON public.post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_bans_community_user ON public.community_bans(community_id, user_id);
CREATE INDEX IF NOT EXISTS idx_moderation_log_community ON public.community_moderation_log(community_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_moderation_log ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user is banned
CREATE OR REPLACE FUNCTION public.is_user_banned(_community_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.community_bans
    WHERE community_id = _community_id
      AND user_id = _user_id
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

-- Security definer function to check if user is community moderator
CREATE OR REPLACE FUNCTION public.is_community_moderator(_community_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.community_members
    WHERE community_id = _community_id
      AND user_id = _user_id
      AND role IN ('moderator', 'admin')
  ) OR EXISTS (
    SELECT 1
    FROM public.communities
    WHERE id = _community_id
      AND created_by = _user_id
  );
$$;

-- Update existing policies for posts to check for bans
DROP POLICY IF EXISTS "Community members can view posts" ON public.posts;
CREATE POLICY "Community members can view posts"
ON public.posts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.community_members cm
    WHERE cm.community_id = posts.community_id
      AND cm.user_id = auth.uid()
  )
  AND NOT is_user_banned(posts.community_id, auth.uid())
);

DROP POLICY IF EXISTS "Community members can create posts" ON public.posts;
CREATE POLICY "Community members can create posts"
ON public.posts FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.community_members cm
    WHERE cm.community_id = posts.community_id
      AND cm.user_id = auth.uid()
  )
  AND NOT is_user_banned(posts.community_id, auth.uid())
);

-- Add moderator policies for posts
CREATE POLICY "Moderators can update posts"
ON public.posts FOR UPDATE
USING (is_community_moderator(posts.community_id, auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Moderators can delete posts"
ON public.posts FOR DELETE
USING (
  is_community_moderator(posts.community_id, auth.uid())
  OR auth.uid() = user_id
);

-- RLS Policies for reactions
CREATE POLICY "Members can view reactions"
ON public.post_reactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.posts p
    JOIN public.community_members cm ON cm.community_id = p.community_id
    WHERE p.id = post_reactions.post_id
      AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Members can add reactions"
ON public.post_reactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their reactions"
ON public.post_reactions FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Members can view comments"
ON public.post_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.posts p
    JOIN public.community_members cm ON cm.community_id = p.community_id
    WHERE p.id = post_comments.post_id
      AND cm.user_id = auth.uid()
  )
  AND NOT is_user_banned(
    (SELECT community_id FROM public.posts WHERE id = post_comments.post_id),
    auth.uid()
  )
);

CREATE POLICY "Members can create comments"
ON public.post_comments FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND NOT is_user_banned(
    (SELECT community_id FROM public.posts WHERE id = post_comments.post_id),
    auth.uid()
  )
);

CREATE POLICY "Users can update their comments"
ON public.post_comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Moderators can delete comments"
ON public.post_comments FOR DELETE
USING (
  auth.uid() = user_id
  OR is_community_moderator(
    (SELECT community_id FROM public.posts WHERE id = post_comments.post_id),
    auth.uid()
  )
);

-- RLS Policies for comment reactions
CREATE POLICY "Members can view comment reactions"
ON public.comment_reactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.post_comments pc
    JOIN public.posts p ON p.id = pc.post_id
    JOIN public.community_members cm ON cm.community_id = p.community_id
    WHERE pc.id = comment_reactions.comment_id
      AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Members can add comment reactions"
ON public.comment_reactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their comment reactions"
ON public.comment_reactions FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for bookmarks
CREATE POLICY "Users can manage their bookmarks"
ON public.post_bookmarks FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for reports
CREATE POLICY "Users can create reports"
ON public.post_reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Moderators can view reports"
ON public.post_reports FOR SELECT
USING (
  is_community_moderator(
    COALESCE(
      (SELECT community_id FROM public.posts WHERE id = post_reports.post_id),
      (SELECT p.community_id FROM public.posts p 
       JOIN public.post_comments pc ON pc.post_id = p.id 
       WHERE pc.id = post_reports.comment_id)
    ),
    auth.uid()
  )
  OR is_admin(auth.uid())
);

CREATE POLICY "Moderators can update reports"
ON public.post_reports FOR UPDATE
USING (
  is_community_moderator(
    COALESCE(
      (SELECT community_id FROM public.posts WHERE id = post_reports.post_id),
      (SELECT p.community_id FROM public.posts p 
       JOIN public.post_comments pc ON pc.post_id = p.id 
       WHERE pc.id = post_reports.comment_id)
    ),
    auth.uid()
  )
  OR is_admin(auth.uid())
);

-- RLS Policies for bans
CREATE POLICY "Moderators can manage bans"
ON public.community_bans FOR ALL
USING (
  is_community_moderator(community_bans.community_id, auth.uid())
  OR is_admin(auth.uid())
);

-- RLS Policies for moderation log
CREATE POLICY "Moderators can view moderation log"
ON public.community_moderation_log FOR SELECT
USING (
  is_community_moderator(community_moderation_log.community_id, auth.uid())
  OR is_admin(auth.uid())
);

CREATE POLICY "Moderators can create log entries"
ON public.community_moderation_log FOR INSERT
WITH CHECK (
  auth.uid() = moderator_id
  AND (
    is_community_moderator(community_moderation_log.community_id, auth.uid())
    OR is_admin(auth.uid())
  )
);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_post_comments_updated_at ON public.post_comments;
CREATE TRIGGER update_post_comments_updated_at
  BEFORE UPDATE ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update reaction counts
CREATE OR REPLACE FUNCTION public.update_post_reactions_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_post_reactions_count_trigger ON public.post_reactions;
CREATE TRIGGER update_post_reactions_count_trigger
  AFTER INSERT OR DELETE ON public.post_reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_reactions_count();

-- Function to update comment counts
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_post_comments_count_trigger ON public.post_comments;
CREATE TRIGGER update_post_comments_count_trigger
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_comments_count();

-- Function to update saves counts
CREATE OR REPLACE FUNCTION public.update_post_saves_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET saves_count = saves_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET saves_count = GREATEST(0, saves_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_post_saves_count_trigger
  AFTER INSERT OR DELETE ON public.post_bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_saves_count();

-- Function to update comment reaction counts
CREATE OR REPLACE FUNCTION public.update_comment_reactions_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.post_comments
    SET reactions_count = reactions_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.post_comments
    SET reactions_count = GREATEST(0, reactions_count - 1)
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_comment_reactions_count_trigger ON public.comment_reactions;
CREATE TRIGGER update_comment_reactions_count_trigger
  AFTER INSERT OR DELETE ON public.comment_reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comment_reactions_count();