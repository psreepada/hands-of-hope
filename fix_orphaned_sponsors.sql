-- Fix orphaned sponsors and improve foreign key constraints
-- Run this in your Supabase SQL Editor

-- First, let's see what sponsors currently exist
-- (You can run this query first to see the current state)
SELECT 
    id, 
    name, 
    logo_url, 
    sponsor_type, 
    branch_id, 
    is_active 
FROM sponsors 
ORDER BY sponsor_type, display_order;

-- Delete any sponsors that have NULL branch_id AND are of type 'school'
-- (These are likely orphaned from deleted test branches)
DELETE FROM sponsors 
WHERE branch_id IS NULL 
AND sponsor_type = 'school';

-- Also delete any sponsors whose logo_url points to non-existent files
-- (This will clean up sponsors with broken image links)
DELETE FROM sponsors 
WHERE sponsor_type = 'school' 
AND (
    logo_url LIKE '%branch-images%' OR 
    logo_url LIKE '%school-logo%'
) 
AND branch_id IS NULL;

-- Update the foreign key constraint to CASCADE DELETE instead of SET NULL
-- This will ensure that when a branch is deleted, its associated sponsor is also deleted
ALTER TABLE sponsors 
DROP CONSTRAINT IF EXISTS sponsors_branch_id_fkey;

ALTER TABLE sponsors 
ADD CONSTRAINT sponsors_branch_id_fkey 
FOREIGN KEY (branch_id) 
REFERENCES branches(id) 
ON DELETE CASCADE;

-- Verify the cleanup worked
SELECT 
    id, 
    name, 
    logo_url, 
    sponsor_type, 
    branch_id, 
    is_active 
FROM sponsors 
WHERE is_active = true
ORDER BY sponsor_type, display_order;
