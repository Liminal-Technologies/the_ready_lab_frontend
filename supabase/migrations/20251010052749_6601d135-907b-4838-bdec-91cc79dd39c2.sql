-- Create a view for public event access that excludes instructor_id
CREATE OR REPLACE VIEW public.public_live_events AS
SELECT 
  id,
  title,
  description,
  scheduled_at,
  duration_minutes,
  status,
  viewer_count,
  attendee_count,
  max_attendees,
  is_recording,
  thumbnail_url,
  recording_url,
  meeting_url,
  created_at,
  updated_at,
  track_id
FROM public.live_events
WHERE status IN ('scheduled', 'live', 'completed');

-- Grant SELECT on the view to authenticated and anon users
GRANT SELECT ON public.public_live_events TO authenticated, anon;

-- Create a security definer function to check if a user is the instructor for an event
-- This allows authenticated users to check their role without exposing all instructor_ids
CREATE OR REPLACE FUNCTION public.is_event_instructor(_event_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.live_events
    WHERE id = _event_id
      AND instructor_id = _user_id
  );
$$;

-- Add comment explaining the security model
COMMENT ON VIEW public.public_live_events IS 'Public view of live events that excludes instructor_id to prevent instructor tracking. Use is_event_instructor() function to check instructor status.';
COMMENT ON FUNCTION public.is_event_instructor IS 'Security definer function to check if a user is the instructor of an event without exposing instructor_id to public queries.';