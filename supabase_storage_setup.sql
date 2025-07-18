-- Supabase Storage Setup for Hour Request Images
-- Run this in your Supabase SQL editor to create the storage bucket and policies

-- Create storage bucket for hour request images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'hour-request-images',
    'hour-request-images', 
    false, -- Not public, requires authentication
    5242880, -- 5MB file size limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Create storage policies

-- Users can upload images for their own hour requests
CREATE POLICY "Users can upload hour request images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'hour-request-images' 
        AND auth.uid()::text IN (
            SELECT email FROM public.users 
            WHERE email = auth.uid()::text
        )
        AND (storage.foldername(name))[1] = auth.uid()::text -- Images must be in user's folder
    );

-- Users can view their own uploaded images
CREATE POLICY "Users can view their own hour request images" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'hour-request-images'
        AND auth.uid()::text IN (
            SELECT email FROM public.users 
            WHERE email = auth.uid()::text
        )
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Admins can view images from users in their branch
CREATE POLICY "Admins can view branch hour request images" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'hour-request-images'
        AND auth.uid()::text IN (
            SELECT u1.email FROM public.users u1 
            JOIN public.users u2 ON u1.branch_id = u2.branch_id
            WHERE u1.role = 'admin' 
            AND u2.email = (storage.foldername(name))[1]
        )
    );

-- Super admins can view all hour request images
CREATE POLICY "Super admins can view all hour request images" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'hour-request-images'
        AND auth.uid()::text IN (
            SELECT email FROM public.users WHERE role = 'super_admin'
        )
    );

-- Users can delete their own images (if needed)
CREATE POLICY "Users can delete their own hour request images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'hour-request-images'
        AND auth.uid()::text IN (
            SELECT email FROM public.users 
            WHERE email = auth.uid()::text
        )
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Comments
COMMENT ON TABLE storage.buckets IS 'hour-request-images bucket stores proof images for volunteer hour logging requests'; 