-- Add trigger to automatically add community creator as admin member
CREATE OR REPLACE FUNCTION public.handle_new_community()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Automatically add creator as admin member
  INSERT INTO public.community_members (community_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_community_created ON public.communities;
CREATE TRIGGER on_community_created
  AFTER INSERT ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_community();