-- Fix RLS policies for hours_requests table
-- Run this in your Supabase SQL Editor to fix the authentication mismatch

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own hour requests" ON hours_requests;
DROP POLICY IF EXISTS "Users can create their own hour requests" ON hours_requests;
DROP POLICY IF EXISTS "Admins can view branch hour requests" ON hours_requests;
DROP POLICY IF EXISTS "Admins can update branch hour requests" ON hours_requests;
DROP POLICY IF EXISTS "Super admins can manage all hour requests" ON hours_requests;

-- Create corrected policies using auth.email() instead of auth.uid()::text

-- Users can view their own requests
CREATE POLICY "Users can view their own hour requests" ON hours_requests
    FOR SELECT USING (
        auth.email() IN (
            SELECT email FROM users WHERE id = hours_requests.user_id
        )
    );

-- Users can insert their own requests  
CREATE POLICY "Users can create their own hour requests" ON hours_requests
    FOR INSERT WITH CHECK (
        auth.email() IN (
            SELECT email FROM users WHERE id = hours_requests.user_id
        )
    );

-- Admins can view all requests in their branch
CREATE POLICY "Admins can view branch hour requests" ON hours_requests
    FOR SELECT USING (
        auth.email() IN (
            SELECT u1.email FROM users u1 
            JOIN users u2 ON u1.branch_id = u2.branch_id
            WHERE u1.role = 'admin' AND u2.id = hours_requests.user_id
        )
    );

-- Admins can update requests (for approval/decline)
CREATE POLICY "Admins can update branch hour requests" ON hours_requests
    FOR UPDATE USING (
        auth.email() IN (
            SELECT u1.email FROM users u1 
            JOIN users u2 ON u1.branch_id = u2.branch_id
            WHERE u1.role = 'admin' AND u2.id = hours_requests.user_id
        )
    );

-- Super admins can view and update all requests
CREATE POLICY "Super admins can manage all hour requests" ON hours_requests
    FOR ALL USING (
        auth.email() IN (
            SELECT email FROM users WHERE role = 'super_admin'
        )
    ); 