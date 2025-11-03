-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pass_threshold INTEGER NOT NULL DEFAULT 70,
  time_limit_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT quiz_parent_check CHECK (
    (lesson_id IS NOT NULL AND module_id IS NULL) OR
    (lesson_id IS NULL AND module_id IS NOT NULL)
  )
);

-- Enable RLS on quizzes
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Anyone can view quizzes for active tracks
CREATE POLICY "Anyone can view quizzes for active tracks"
ON public.quizzes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM lessons l
    JOIN modules m ON l.module_id = m.id
    JOIN tracks t ON m.track_id = t.id
    WHERE l.id = quizzes.lesson_id
    AND t.is_active = true
  )
  OR EXISTS (
    SELECT 1 FROM modules m
    JOIN tracks t ON m.track_id = t.id
    WHERE m.id = quizzes.module_id
    AND t.is_active = true
  )
);

-- Track owners can manage quizzes
CREATE POLICY "Track owners can manage quizzes"
ON public.quizzes
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM lessons l
    JOIN modules m ON l.module_id = m.id
    JOIN tracks t ON m.track_id = t.id
    WHERE l.id = quizzes.lesson_id
    AND t.created_by = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM modules m
    JOIN tracks t ON m.track_id = t.id
    WHERE m.id = quizzes.module_id
    AND t.created_by = auth.uid()
  )
);

-- Update quiz_questions to reference quizzes
ALTER TABLE public.quiz_questions
DROP CONSTRAINT IF EXISTS quiz_questions_lesson_id_fkey,
ADD COLUMN IF NOT EXISTS quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE;

-- Migrate existing quiz_questions to use quizzes
-- (This is a one-time migration for existing data)
DO $$
BEGIN
  -- Create quizzes for existing quiz_questions
  INSERT INTO public.quizzes (lesson_id, title, pass_threshold)
  SELECT DISTINCT 
    lesson_id, 
    'Lesson Quiz',
    70
  FROM public.quiz_questions
  WHERE NOT EXISTS (
    SELECT 1 FROM public.quizzes q WHERE q.lesson_id = quiz_questions.lesson_id
  );
  
  -- Update quiz_questions to reference the new quizzes
  UPDATE public.quiz_questions qq
  SET quiz_id = q.id
  FROM public.quizzes q
  WHERE q.lesson_id = qq.lesson_id
  AND qq.quiz_id IS NULL;
END $$;

-- Now make quiz_id required
ALTER TABLE public.quiz_questions
ALTER COLUMN quiz_id SET NOT NULL;

-- Update quiz_attempts table
ALTER TABLE public.quiz_attempts
ADD COLUMN IF NOT EXISTS quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Migrate existing quiz_attempts
DO $$
BEGIN
  UPDATE public.quiz_attempts qa
  SET quiz_id = q.id
  FROM public.quizzes q
  WHERE q.lesson_id = qa.lesson_id
  AND qa.quiz_id IS NULL;
END $$;

-- Update certificates table for completion and certified types
ALTER TABLE public.certifications
ADD COLUMN IF NOT EXISTS cert_type TEXT NOT NULL DEFAULT 'completion' CHECK (cert_type IN ('completion', 'certified')),
ADD COLUMN IF NOT EXISTS issued_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS share_url TEXT,
ADD COLUMN IF NOT EXISTS serial TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS issuer_name TEXT,
ADD COLUMN IF NOT EXISTS issuer_id UUID,
ADD COLUMN IF NOT EXISTS price_min NUMERIC,
ADD COLUMN IF NOT EXISTS disclaimer_text TEXT DEFAULT 'This certificate is issued as acknowledgment of professional development participation and does not represent an accredited academic degree or formal credential.';

-- Generate serial numbers for existing certificates
UPDATE public.certifications
SET serial = 'CERT-' || UPPER(SUBSTR(MD5(id::TEXT || created_at::TEXT), 1, 12))
WHERE serial IS NULL;

-- Create index on serial for faster lookups
CREATE INDEX IF NOT EXISTS idx_certifications_serial ON public.certifications(serial);

-- Create trigger for updated_at
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();