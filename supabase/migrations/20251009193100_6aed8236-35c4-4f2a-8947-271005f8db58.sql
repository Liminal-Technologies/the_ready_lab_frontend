-- Create a separate table for sensitive live event credentials
CREATE TABLE IF NOT EXISTS public.live_event_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.live_events(id) ON DELETE CASCADE,
  stream_key text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(event_id)
);

-- Enable RLS on the credentials table
ALTER TABLE public.live_event_credentials ENABLE ROW LEVEL SECURITY;

-- Only instructors can view their own event credentials
CREATE POLICY "Instructors can view their own event credentials"
ON public.live_event_credentials
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.live_events
    WHERE live_events.id = live_event_credentials.event_id
    AND live_events.instructor_id = auth.uid()
  )
);

-- Only instructors can insert credentials for their events
CREATE POLICY "Instructors can create credentials for their events"
ON public.live_event_credentials
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.live_events
    WHERE live_events.id = live_event_credentials.event_id
    AND live_events.instructor_id = auth.uid()
  )
);

-- Only instructors can update their own event credentials
CREATE POLICY "Instructors can update their own event credentials"
ON public.live_event_credentials
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.live_events
    WHERE live_events.id = live_event_credentials.event_id
    AND live_events.instructor_id = auth.uid()
  )
);

-- Migrate existing stream_key data
INSERT INTO public.live_event_credentials (event_id, stream_key)
SELECT id, stream_key
FROM public.live_events
WHERE stream_key IS NOT NULL
ON CONFLICT (event_id) DO NOTHING;

-- Remove stream_key column from live_events (making public data safe)
ALTER TABLE public.live_events DROP COLUMN IF EXISTS stream_key;

-- Add trigger for updated_at
CREATE TRIGGER update_live_event_credentials_updated_at
BEFORE UPDATE ON public.live_event_credentials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();