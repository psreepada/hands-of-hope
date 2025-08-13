-- Setup storage for branch images
-- Run this in your Supabase SQL Editor

-- 1. Create the branch-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('branch-images', 'branch-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access to branch images
CREATE POLICY IF NOT EXISTS "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'branch-images');

-- 3. Allow authenticated users to upload images
CREATE POLICY IF NOT EXISTS "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'branch-images' 
  AND auth.role() = 'authenticated'
);

-- 4. Allow users to update their own images
CREATE POLICY IF NOT EXISTS "Authenticated update access" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'branch-images'
  AND auth.role() = 'authenticated'
);

-- 5. Allow users to delete their own images
CREATE POLICY IF NOT EXISTS "Authenticated delete access" ON storage.objects
FOR DELETE USING (
  bucket_id = 'branch-images'
  AND auth.role() = 'authenticated'
);