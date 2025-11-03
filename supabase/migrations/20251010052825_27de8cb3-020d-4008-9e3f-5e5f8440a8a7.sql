-- Drop and recreate the view with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.public_live_events;

CREATE VIEW public.public_live_events
WITH (security_invoker = true)
AS
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

-- Add comment explaining the security model
COMMENT ON VIEW public.public_live_events IS 'Public view of live events that excludes instructor_id to prevent instructor tracking. Uses SECURITY INVOKER to respect RLS policies. Use is_event_instructor() function to check instructor status.';