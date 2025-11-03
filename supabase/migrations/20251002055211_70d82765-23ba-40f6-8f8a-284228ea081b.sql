-- Add roadmap_tags to tracks table
ALTER TABLE public.tracks
ADD COLUMN IF NOT EXISTS roadmap_tags TEXT[] DEFAULT '{}';

-- Create live_events table
CREATE TABLE IF NOT EXISTS public.live_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  meeting_url TEXT,
  recording_url TEXT,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  max_attendees INTEGER,
  attendee_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on live_events
ALTER TABLE public.live_events ENABLE ROW LEVEL SECURITY;

-- Anyone can view scheduled and live events
CREATE POLICY "Anyone can view public live events"
ON public.live_events
FOR SELECT
USING (status IN ('scheduled', 'live', 'completed'));

-- Educators can create and manage their own events
CREATE POLICY "Educators can manage their own events"
ON public.live_events
FOR ALL
USING (instructor_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_live_events_updated_at
  BEFORE UPDATE ON public.live_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed Funding Readiness 101 track
INSERT INTO public.tracks (title, description, level, category, estimated_hours, roadmap_tags, thumbnail_url, is_active)
VALUES (
  'Funding Readiness 101',
  'Master the fundamentals of securing funding for your educational initiative or nonprofit. Learn pitch strategies, financial modeling, and investor relations.',
  'beginner',
  'Entrepreneurship',
  18,
  ARRAY['funding', 'entrepreneurship', 'nonprofit', 'startup'],
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
  true
)
ON CONFLICT DO NOTHING
RETURNING id;

-- Note: We'll seed modules and lessons via a separate edge function or admin interface
-- to avoid making this migration too large