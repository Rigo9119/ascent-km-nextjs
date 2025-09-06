-- Create storage bucket for user avatars (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 
  'user_avatars',
  'user_avatars', 
  true,
  52428800, -- 50MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'user_avatars'
);

-- Create RLS policy to allow users to upload their own avatars (only if it doesn't exist)
DO $$ BEGIN
  CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user_avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Create RLS policy to allow public read access to avatars (only if it doesn't exist)
DO $$ BEGIN
  CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'user_avatars');
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Create RLS policy to allow users to update their own avatar (only if it doesn't exist)
DO $$ BEGIN
  CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'user_avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Create RLS policy to allow users to delete their own avatar (only if it doesn't exist)
DO $$ BEGIN
  CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'user_avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;