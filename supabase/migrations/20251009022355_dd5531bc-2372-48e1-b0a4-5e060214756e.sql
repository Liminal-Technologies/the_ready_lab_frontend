-- Add WebRTC streaming fields to live_events
ALTER TABLE public.live_events
ADD COLUMN IF NOT EXISTS stream_key TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_recording BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS viewer_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS recording_url TEXT;

-- Create stream_chat_messages table for chat history (optional, can be ephemeral)
CREATE TABLE IF NOT EXISTS public.stream_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.live_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster chat retrieval
CREATE INDEX IF NOT EXISTS idx_stream_chat_event_id ON public.stream_chat_messages(event_id, created_at DESC);

-- Enable RLS on stream_chat_messages
ALTER TABLE public.stream_chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can view chat messages for public events
CREATE POLICY "Anyone can view chat for live events"
ON public.stream_chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.live_events
    WHERE live_events.id = stream_chat_messages.event_id
    AND live_events.status IN ('live', 'scheduled', 'completed')
  )
);

-- Authenticated users can send chat messages
CREATE POLICY "Authenticated users can send chat messages"
ON public.stream_chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
ON public.stream_chat_messages FOR DELETE
USING (auth.uid() = user_id);

-- Instructors can delete any messages in their streams
CREATE POLICY "Instructors can delete messages in their streams"
ON public.stream_chat_messages FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.live_events
    WHERE live_events.id = stream_chat_messages.event_id
    AND live_events.instructor_id = auth.uid()
  )
);

COMMENT ON TABLE public.stream_chat_messages IS 'Stores chat messages for live streaming events';
COMMENT ON COLUMN public.live_events.stream_key IS 'Unique key for WebRTC stream identification';
COMMENT ON COLUMN public.live_events.is_recording IS 'Whether the stream should be recorded for VOD';
COMMENT ON COLUMN public.live_events.recording_url IS 'URL to the recorded stream (VOD)';