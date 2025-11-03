-- Add cover_photo column to communities table
ALTER TABLE public.communities
ADD COLUMN cover_photo text;

-- Add comment
COMMENT ON COLUMN public.communities.cover_photo IS 'URL to the community cover photo image';