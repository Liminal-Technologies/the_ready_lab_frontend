-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  524288000, -- 500MB limit
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']
);

-- Storage policies for videos bucket
CREATE POLICY "Educators can upload videos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'videos' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'educator') OR
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  )
);

CREATE POLICY "Anyone can view public videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Educators can update their own videos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Educators can delete their own videos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Make module_id nullable in lessons table to support standalone microlearning
ALTER TABLE public.lessons ALTER COLUMN module_id DROP NOT NULL;

-- Add lesson_type to distinguish between microlearning and regular lessons
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS lesson_type text DEFAULT 'regular' CHECK (lesson_type IN ('microlearning', 'regular', 'live_replay'));

-- Add video_duration for better tracking
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS video_duration_seconds integer;

-- Add is_standalone flag for microlearning
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS is_standalone boolean DEFAULT false;

-- Update RLS policies for lessons to allow standalone lessons
DROP POLICY IF EXISTS "Anyone can view lessons of active tracks" ON public.lessons;
DROP POLICY IF EXISTS "Track owners can manage lessons" ON public.lessons;

-- New policy: Anyone can view published lessons
CREATE POLICY "Anyone can view published lessons"
ON public.lessons
FOR SELECT
USING (
  is_standalone = true OR
  (EXISTS (
    SELECT 1 FROM modules m
    JOIN tracks t ON m.track_id = t.id
    WHERE m.id = lessons.module_id AND t.is_active = true
  ))
);

-- New policy: Educators can manage their own lessons
CREATE POLICY "Educators can manage their own lessons"
ON public.lessons
FOR ALL
USING (
  (is_standalone = true AND EXISTS (
    SELECT 1 FROM tracks WHERE id = lessons.module_id AND created_by = auth.uid()
  )) OR
  (EXISTS (
    SELECT 1 FROM modules m
    JOIN tracks t ON m.track_id = t.id
    WHERE m.id = lessons.module_id AND t.created_by = auth.uid()
  ))
);

-- Create index for faster standalone lesson queries
CREATE INDEX IF NOT EXISTS idx_lessons_standalone ON public.lessons(is_standalone) WHERE is_standalone = true;
CREATE INDEX IF NOT EXISTS idx_lessons_type ON public.lessons(lesson_type);