-- Create core learning platform tables for The Ready Lab

-- Tracks (like "Funding Readiness 101", "Infrastructure", etc.)
CREATE TABLE public.tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  certification_type TEXT NOT NULL CHECK (certification_type IN ('completion', 'verified')) DEFAULT 'completion',
  completion_requirement INTEGER NOT NULL DEFAULT 70, -- percentage required to complete
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  estimated_hours INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Modules (sections within a track)
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lessons (individual content pieces within modules)
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'pdf', 'template', 'link', 'poll', 'prompt')) DEFAULT 'video',
  content_url TEXT,
  content_data JSONB, -- for storing quiz questions, poll options, etc.
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  is_required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User enrollments in tracks
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completion_date TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'dropped')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id)
);

-- Lesson progress tracking
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  completion_date TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Certifications
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  certificate_type TEXT NOT NULL CHECK (certificate_type IN ('completion', 'verified')) DEFAULT 'completion',
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'issued', 'rejected')) DEFAULT 'pending',
  issue_date TIMESTAMP WITH TIME ZONE,
  certificate_url TEXT,
  shareable_url TEXT,
  approved_by UUID REFERENCES public.profiles(id),
  instructor_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id)
);

-- Communities
CREATE TABLE public.communities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  visibility TEXT NOT NULL CHECK (visibility IN ('open', 'private')) DEFAULT 'open',
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  member_count INTEGER NOT NULL DEFAULT 0,
  rules TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community memberships
CREATE TABLE public.community_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('member', 'moderator', 'admin')) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- Community posts
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  passed BOOLEAN NOT NULL DEFAULT false,
  answers JSONB, -- store user's answers
  attempt_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tracks (publicly viewable, educators can create)
CREATE POLICY "Anyone can view active tracks" ON public.tracks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Educators can create tracks" ON public.tracks
  FOR INSERT WITH CHECK (auth.uid() = created_by AND 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('educator', 'admin'));

CREATE POLICY "Educators can update their own tracks" ON public.tracks
  FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for modules (follow track visibility)
CREATE POLICY "Anyone can view modules of active tracks" ON public.modules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.tracks WHERE id = track_id AND is_active = true)
  );

CREATE POLICY "Track owners can manage modules" ON public.modules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.tracks WHERE id = track_id AND created_by = auth.uid())
  );

-- RLS Policies for lessons (follow module/track visibility)
CREATE POLICY "Anyone can view lessons of active tracks" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modules m 
      JOIN public.tracks t ON m.track_id = t.id 
      WHERE m.id = module_id AND t.is_active = true
    )
  );

CREATE POLICY "Track owners can manage lessons" ON public.lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.modules m 
      JOIN public.tracks t ON m.track_id = t.id 
      WHERE m.id = module_id AND t.created_by = auth.uid()
    )
  );

-- RLS Policies for enrollments (users can see their own)
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" ON public.enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for lesson progress (users can see their own)
CREATE POLICY "Users can view their own progress" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" ON public.lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for certifications
CREATE POLICY "Users can view their own certifications" ON public.certifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create certification requests" ON public.certifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and track creators can approve certifications" ON public.certifications
  FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR
    EXISTS (SELECT 1 FROM public.tracks WHERE id = track_id AND created_by = auth.uid())
  );

-- RLS Policies for communities
CREATE POLICY "Anyone can view open communities" ON public.communities
  FOR SELECT USING (visibility = 'open');

CREATE POLICY "Members can view private communities" ON public.communities
  FOR SELECT USING (
    visibility = 'private' AND 
    EXISTS (SELECT 1 FROM public.community_members WHERE community_id = id AND user_id = auth.uid())
  );

CREATE POLICY "Educators and admins can create communities" ON public.communities
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('educator', 'admin')
  );

-- RLS Policies for community members
CREATE POLICY "Users can view community memberships" ON public.community_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.communities c 
      WHERE c.id = community_id AND (
        c.visibility = 'open' OR 
        EXISTS (SELECT 1 FROM public.community_members cm WHERE cm.community_id = c.id AND cm.user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can join communities" ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for posts
CREATE POLICY "Community members can view posts" ON public.posts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
  );

CREATE POLICY "Community members can create posts" ON public.posts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM public.community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
  );

-- RLS Policies for quiz attempts
CREATE POLICY "Users can view their own quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_tracks_category ON public.tracks(category);
CREATE INDEX idx_tracks_level ON public.tracks(level);
CREATE INDEX idx_modules_track_id ON public.modules(track_id);
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_track_id ON public.enrollments(track_id);
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_certifications_user_id ON public.certifications(user_id);
CREATE INDEX idx_community_members_user_id ON public.community_members(user_id);
CREATE INDEX idx_posts_community_id ON public.posts(community_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON public.tracks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communities_updated_at
  BEFORE UPDATE ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();