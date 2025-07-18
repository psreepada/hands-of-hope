-- Storage policies for hour-request-images bucket
-- Run this in your Supabase SQL Editor AFTER creating the bucket through the dashboard

-- Enable Row Level Security on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Users can upload images for their own hour requests
CREATE POLICY "Users can upload hour request images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'hour-request-images' 
        AND auth.uid()::text IN (
            SELECT email FROM public.users 
            WHERE email = auth.uid()::text
        )
        AND (storage.foldername(name))[1] = auth.uid()::text
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