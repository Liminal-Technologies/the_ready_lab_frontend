-- =====================================================
-- SUPABASE DATABASE FIX
-- Complete fix for handle_new_user trigger + backfill
-- =====================================================

-- Step 1: Recreate the handle_new_user function with correct logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile for new user
  INSERT INTO public.profiles (id, email, full_name, role, subscription_status, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data ->> 'role', 'student') = 'student' THEN 'trial'
      ELSE 'inactive'
    END,
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data ->> 'role', 'student') = 'educator' THEN 'basic'
      ELSE NULL
    END
  );
  
  -- Insert user role with error handling
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
      NEW.id,
      COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'student'::public.user_role)
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to insert user_role: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;

-- Step 2: Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Backfill profile for existing user (ben@enterliminal.com)
-- This handles the user that already signed up before the fix
DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find users in auth.users that don't have profiles
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE p.id IS NULL
  LOOP
    -- Create profile for each missing user
    INSERT INTO public.profiles (id, email, full_name, role, subscription_status, subscription_tier)
    VALUES (
      user_record.id,
      user_record.email,
      user_record.raw_user_meta_data ->> 'full_name',
      COALESCE(user_record.raw_user_meta_data ->> 'role', 'student'),
      CASE 
        WHEN COALESCE(user_record.raw_user_meta_data ->> 'role', 'student') = 'student' THEN 'trial'
        ELSE 'inactive'
      END,
      CASE 
        WHEN COALESCE(user_record.raw_user_meta_data ->> 'role', 'student') = 'educator' THEN 'basic'
        ELSE NULL
      END
    );
    
    -- Create user role
    BEGIN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (
        user_record.id,
        COALESCE((user_record.raw_user_meta_data ->> 'role')::public.user_role, 'student'::public.user_role)
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to insert user_role for %: %', user_record.email, SQLERRM;
    END;
    
    RAISE NOTICE 'Created profile for user: %', user_record.email;
  END LOOP;
END $$;

-- Step 4: Verify the fix
SELECT 
  'Profiles created: ' || COUNT(*) as result
FROM public.profiles;

SELECT 
  'Users without profiles: ' || COUNT(*) as result
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;
