-- Add preferences column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{
  "theme": "system",
  "notifications": {
    "email": true,
    "community_updates": true,
    "new_discussions": false,
    "new_comments": true
  },
  "privacy": {
    "profile_visibility": "public",
    "show_email": false
  },
  "language": "es"
}'::jsonb;

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_profiles_preferences ON profiles USING GIN (preferences);

-- Add RLS policy for preferences (users can only update their own)
DO $$ BEGIN
  CREATE POLICY "Users can update own preferences" ON profiles
    FOR UPDATE USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;