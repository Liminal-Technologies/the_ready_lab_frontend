-- Add video_captions table for storing subtitle/caption tracks
CREATE TABLE IF NOT EXISTS public.video_captions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL DEFAULT 'en',
  caption_url TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'vtt',
  is_auto_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(lesson_id, language_code)
);

-- Enable RLS on video_captions
ALTER TABLE public.video_captions ENABLE ROW LEVEL SECURITY;

-- Anyone can view captions for published lessons
CREATE POLICY "Anyone can view captions for published lessons"
ON public.video_captions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lessons l
    WHERE l.id = video_captions.lesson_id
    AND (
      l.is_standalone = true
      OR EXISTS (
        SELECT 1 FROM public.modules m
        JOIN public.tracks t ON m.track_id = t.id
        WHERE m.id = l.module_id AND t.is_active = true
      )
    )
  )
);

-- Educators can manage captions for their lessons
CREATE POLICY "Educators can manage their lesson captions"
ON public.video_captions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.lessons l
    LEFT JOIN public.modules m ON l.module_id = m.id
    LEFT JOIN public.tracks t ON m.track_id = t.id
    WHERE l.id = video_captions.lesson_id
    AND (
      (l.is_standalone = true)
      OR (t.created_by = auth.uid())
    )
  )
);

-- Add thumbnail_url and poster_url to lessons table
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS poster_url TEXT;

-- Add multilingual metadata support to tracks
ALTER TABLE public.tracks
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Add multilingual metadata support to digital_products
ALTER TABLE public.digital_products
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Create index for faster language lookups
CREATE INDEX IF NOT EXISTS idx_video_captions_lesson_language 
ON public.video_captions(lesson_id, language_code);

-- Create updated_at trigger for video_captions
CREATE TRIGGER update_video_captions_updated_at
BEFORE UPDATE ON public.video_captions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.video_captions IS 'Stores subtitle/caption tracks for video lessons in multiple languages';
COMMENT ON COLUMN public.video_captions.language_code IS 'ISO 639-1 language code (e.g., en, es, fr)';
COMMENT ON COLUMN public.video_captions.format IS 'Caption file format: vtt, srt, or json';
COMMENT ON COLUMN public.video_captions.is_auto_generated IS 'Whether captions were auto-generated vs manually uploaded';
COMMENT ON COLUMN public.tracks.translations IS 'Multilingual metadata: {"es": {"title": "...", "description": "..."}}';
COMMENT ON COLUMN public.digital_products.translations IS 'Multilingual metadata: {"es": {"title": "...", "description": "..."}}';