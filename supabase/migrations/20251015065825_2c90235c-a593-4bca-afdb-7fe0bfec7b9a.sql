-- Add trigger to update community member count
CREATE OR REPLACE FUNCTION public.update_community_member_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities
    SET member_count = member_count + 1
    WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities
    SET member_count = GREATEST(0, member_count - 1)
    WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for member count
DROP TRIGGER IF EXISTS update_community_member_count_trigger ON public.community_members;
CREATE TRIGGER update_community_member_count_trigger
  AFTER INSERT OR DELETE ON public.community_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_community_member_count();