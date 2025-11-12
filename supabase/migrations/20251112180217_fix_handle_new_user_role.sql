-- Fix handle_new_user function to properly handle role insertion
-- The profiles table still has a NOT NULL constraint on role column
-- but the function wasn't inserting it

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles (with role for backward compatibility)
  INSERT INTO public.profiles (id, email, full_name, role, subscription_status, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'), -- Add role back with fallback to 'student'
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data ->> 'role', 'student') = 'student' THEN 'trial'
      ELSE 'inactive'
    END,
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data ->> 'role', 'student') = 'educator' THEN 'basic'
      ELSE NULL
    END
  );
  
  -- Insert into user_roles with proper error handling
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
      NEW.id,
      COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'student'::public.user_role)
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the whole transaction
    RAISE WARNING 'Failed to insert user_role: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;
