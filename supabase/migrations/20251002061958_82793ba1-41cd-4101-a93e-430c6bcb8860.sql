-- Create user interests table for feed filtering
CREATE TABLE public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, interest_tag)
);

ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own interests"
  ON public.user_interests
  FOR ALL
  USING (auth.uid() = user_id);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bookmarkable_type TEXT NOT NULL, -- 'lesson', 'resource', 'live_event'
  bookmarkable_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, bookmarkable_type, bookmarkable_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bookmarks"
  ON public.bookmarks
  FOR ALL
  USING (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'community_mention', 'community_reply', 'course_update', 'live_event', 'educator_update'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add interest tags to tracks table for filtering
ALTER TABLE public.tracks
ADD COLUMN IF NOT EXISTS interest_tags TEXT[] DEFAULT '{}';

-- Create index for better query performance
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, is_read);
CREATE INDEX idx_user_interests_user_id ON public.user_interests(user_id);