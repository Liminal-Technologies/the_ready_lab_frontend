-- Create post comments table first
DO $$ BEGIN
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
END $$;

-- Create index for comments
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments(post_id);

-- Enable RLS on comments
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Members can view comments" ON public.post_comments;
DROP POLICY IF EXISTS "Members can create comments" ON public.post_comments;
DROP POLICY IF EXISTS "Users can update their comments" ON public.post_comments;
DROP POLICY IF EXISTS "Moderators can delete comments" ON public.post_comments;

-- Create post reactions table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS public.post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    reaction_type TEXT NOT NULL DEFAULT 'like',
    emoji TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(post_id, user_id, reaction_type)
  );
END $$;

CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON public.post_reactions(post_id);
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

-- Create comment reactions table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS public.comment_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES public.post_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(comment_id, user_id, emoji)
  );
END $$;

ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;

-- Create post reports table
DO $$ BEGIN
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
END $$;

ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY;

-- Create community bans table
DO $$ BEGIN
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
END $$;

CREATE INDEX IF NOT EXISTS idx_community_bans_community_user ON public.community_bans(community_id, user_id);
ALTER TABLE public.community_bans ENABLE ROW LEVEL SECURITY;

-- Create community moderation log table
DO $$ BEGIN
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
END $$;

CREATE INDEX IF NOT EXISTS idx_moderation_log_community ON public.community_moderation_log(community_id, created_at DESC);
ALTER TABLE public.community_moderation_log ENABLE ROW LEVEL SECURITY;

-- Security definer functions
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

-- RLS Policies for post reactions
DROP POLICY IF EXISTS "Members can view reactions" ON public.post_reactions;
DROP POLICY IF EXISTS "Members can add reactions" ON public.post_reactions;
DROP POLICY IF EXISTS "Users can delete their reactions" ON public.post_reactions;

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

-- RLS Policies for comment reactions
DROP POLICY IF EXISTS "Members can view comment reactions" ON public.comment_reactions;
DROP POLICY IF EXISTS "Members can add comment reactions" ON public.comment_reactions;
DROP POLICY IF EXISTS "Users can delete their comment reactions" ON public.comment_reactions;

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

-- RLS Policies for reports
DROP POLICY IF EXISTS "Users can create reports" ON public.post_reports;
DROP POLICY IF EXISTS "Moderators can view reports" ON public.post_reports;
DROP POLICY IF EXISTS "Moderators can update reports" ON public.post_reports;

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
DROP POLICY IF EXISTS "Moderators can manage bans" ON public.community_bans;

CREATE POLICY "Moderators can manage bans"
ON public.community_bans FOR ALL
USING (
  is_community_moderator(community_bans.community_id, auth.uid())
  OR is_admin(auth.uid())
);

-- RLS Policies for moderation log
DROP POLICY IF EXISTS "Moderators can view moderation log" ON public.community_moderation_log;
DROP POLICY IF EXISTS "Moderators can create log entries" ON public.community_moderation_log;

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

-- Trigger for updated_at on comments
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