-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'educator', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT id, role::public.user_role, created_at
FROM public.profiles
WHERE role IS NOT NULL;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE 
      WHEN role = 'admin' THEN 1
      WHEN role = 'educator' THEN 2
      WHEN role = 'student' THEN 3
    END
  LIMIT 1;
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.user_has_role(_user_id UUID, _role public.user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create function to add role to user
CREATE OR REPLACE FUNCTION public.add_user_role(_user_id UUID, _role public.user_role)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  role_id UUID;
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING
  RETURNING id INTO role_id;
  
  RETURN role_id;
END;
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (has_admin_role(auth.uid(), 'super_admin'));

-- Update trigger for user_roles
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update handle_new_user function to use user_roles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles (without role)
  INSERT INTO public.profiles (id, email, full_name, subscription_status, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'student' THEN 'trial'
      ELSE 'inactive'
    END,
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'educator' THEN 'basic'
      ELSE NULL
    END
  );
  
  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'student')
  );
  
  RETURN NEW;
END;
$$;

-- Update RLS policies that reference profiles.role to use security definer functions

-- Update tracks policies
DROP POLICY IF EXISTS "Educators can create tracks" ON public.tracks;
CREATE POLICY "Educators can create tracks"
ON public.tracks
FOR INSERT
WITH CHECK (
  auth.uid() = created_by 
  AND (
    user_has_role(auth.uid(), 'educator') 
    OR user_has_role(auth.uid(), 'admin')
  )
);

-- Update certifications policies
DROP POLICY IF EXISTS "Admins and track creators can approve certifications" ON public.certifications;
CREATE POLICY "Admins and track creators can approve certifications"
ON public.certifications
FOR UPDATE
USING (
  user_has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1
    FROM tracks
    WHERE tracks.id = certifications.track_id
      AND tracks.created_by = auth.uid()
  )
);

-- Update communities policies
DROP POLICY IF EXISTS "Educators and admins can create communities" ON public.communities;
CREATE POLICY "Educators and admins can create communities"
ON public.communities
FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  AND (
    user_has_role(auth.uid(), 'educator')
    OR user_has_role(auth.uid(), 'admin')
  )
);

-- Remove role column from profiles (keep for backward compatibility during migration)
-- COMMENT: Not dropping the column yet to avoid breaking existing code
-- Will be removed in a future migration after all code is updated