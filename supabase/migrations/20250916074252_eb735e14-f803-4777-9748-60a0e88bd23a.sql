-- Create admin roles enum and table
CREATE TYPE public.admin_role AS ENUM (
  'super_admin',
  'content_admin', 
  'finance_admin',
  'community_admin',
  'compliance_admin',
  'support_agent',
  'institution_manager'
);

-- Create admin_roles table
CREATE TABLE public.admin_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role admin_role NOT NULL,
  granted_by UUID REFERENCES public.profiles(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  feature_flags JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID NOT NULL REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create institutions table for pilot program
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  logo_url TEXT,
  seat_limit INTEGER NOT NULL DEFAULT 50,
  seats_used INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial')),
  billing_contact_email TEXT,
  admin_contact_email TEXT,
  created_by UUID REFERENCES public.profiles(id),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create institution_members table
CREATE TABLE public.institution_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(institution_id, user_id)
);

-- Create feature_flags table
CREATE TABLE public.feature_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flag_name TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default feature flags
INSERT INTO public.feature_flags (flag_name, is_enabled, description) VALUES
('ai_tutor', false, 'Enable AI tutor functionality'),
('live_streaming', false, 'Enable live streaming features'),
('products', false, 'Enable digital products marketplace'),
('institution_portal', false, 'Enable institution management portal'),
('advanced_analytics', false, 'Enable advanced analytics dashboard'),
('community_moderation', true, 'Enable community moderation tools');

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
  options JSONB, -- For multiple choice questions
  correct_answer JSONB NOT NULL,
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create digital_products table
CREATE TABLE public.digital_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  educator_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  product_type TEXT NOT NULL CHECK (product_type IN ('ebook', 'template', 'toolkit', 'video', 'audio')),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  file_url TEXT,
  preview_url TEXT,
  thumbnail_url TEXT,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published', 'unpublished')),
  approval_notes TEXT,
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  downloads_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin roles
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id UUID, _role admin_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  ) OR EXISTS (
    SELECT 1
    FROM public.admin_roles
    WHERE user_id = _user_id
      AND role = 'super_admin'
      AND is_active = true
  );
$$;

-- Create function to check if user is any kind of admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_roles
    WHERE user_id = _user_id
      AND is_active = true
  );
$$;

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  _action TEXT,
  _entity_type TEXT,
  _entity_id UUID DEFAULT NULL,
  _old_values JSONB DEFAULT NULL,
  _new_values JSONB DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    actor_id, action, entity_type, entity_id, old_values, new_values, metadata
  ) VALUES (
    auth.uid(), _action, _entity_type, _entity_id, _old_values, _new_values, _metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- RLS Policies for admin_roles
CREATE POLICY "Super admins can manage all admin roles" ON public.admin_roles
  FOR ALL USING (public.has_admin_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view their own roles" ON public.admin_roles
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin(auth.uid()));

-- RLS Policies for institutions
CREATE POLICY "Super admins can manage institutions" ON public.institutions
  FOR ALL USING (public.has_admin_role(auth.uid(), 'super_admin') OR public.has_admin_role(auth.uid(), 'institution_manager'));

CREATE POLICY "Institution admins can view their institution" ON public.institutions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.institution_members 
    WHERE institution_id = institutions.id 
      AND user_id = auth.uid() 
      AND role = 'admin'
      AND is_active = true
  ));

-- RLS Policies for institution_members
CREATE POLICY "Institution admins can manage members" ON public.institution_members
  FOR ALL USING (
    public.has_admin_role(auth.uid(), 'super_admin') OR
    public.has_admin_role(auth.uid(), 'institution_manager') OR
    EXISTS (
      SELECT 1 FROM public.institution_members im
      WHERE im.institution_id = institution_members.institution_id
        AND im.user_id = auth.uid()
        AND im.role = 'admin'
        AND im.is_active = true
    )
  );

-- RLS Policies for feature_flags
CREATE POLICY "Admins can manage feature flags" ON public.feature_flags
  FOR ALL USING (public.has_admin_role(auth.uid(), 'super_admin'));

CREATE POLICY "Anyone can view enabled feature flags" ON public.feature_flags
  FOR SELECT USING (is_enabled = true);

-- RLS Policies for quiz_questions
CREATE POLICY "Track owners can manage quiz questions" ON public.quiz_questions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.modules m ON l.module_id = m.id
    JOIN public.tracks t ON m.track_id = t.id
    WHERE l.id = quiz_questions.lesson_id
      AND t.created_by = auth.uid()
  ));

CREATE POLICY "Admins can manage all quiz questions" ON public.quiz_questions
  FOR ALL USING (public.has_admin_role(auth.uid(), 'super_admin') OR public.has_admin_role(auth.uid(), 'content_admin'));

CREATE POLICY "Students can view quiz questions for enrolled tracks" ON public.quiz_questions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.modules m ON l.module_id = m.id
    JOIN public.tracks t ON m.track_id = t.id
    JOIN public.enrollments e ON t.id = e.track_id
    WHERE l.id = quiz_questions.lesson_id
      AND e.user_id = auth.uid()
      AND e.status = 'active'
  ));

-- RLS Policies for digital_products
CREATE POLICY "Educators can manage their own products" ON public.digital_products
  FOR ALL USING (educator_id = auth.uid());

CREATE POLICY "Admins can manage all products" ON public.digital_products
  FOR ALL USING (public.has_admin_role(auth.uid(), 'super_admin') OR public.has_admin_role(auth.uid(), 'content_admin'));

CREATE POLICY "Anyone can view published products" ON public.digital_products
  FOR SELECT USING (status = 'published');

-- Create triggers for updated_at columns
CREATE TRIGGER update_admin_roles_updated_at
  BEFORE UPDATE ON public.admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_institutions_updated_at
  BEFORE UPDATE ON public.institutions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_digital_products_updated_at
  BEFORE UPDATE ON public.digital_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();