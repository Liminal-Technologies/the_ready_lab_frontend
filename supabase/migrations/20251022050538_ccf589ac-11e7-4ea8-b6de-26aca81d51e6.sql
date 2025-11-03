-- Add language preference columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS show_content_in_language_first boolean DEFAULT true;

-- Add check constraint for valid language codes
ALTER TABLE profiles 
ADD CONSTRAINT valid_language_code 
CHECK (preferred_language IN ('en', 'es', 'fr', 'pt', 'ar', 'zh'));

-- Update existing profiles to have default language preference
UPDATE profiles 
SET preferred_language = 'en', 
    show_content_in_language_first = true 
WHERE preferred_language IS NULL;