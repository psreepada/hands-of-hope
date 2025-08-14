-- Fix CASCADE deletion for all tables related to branches
-- This ensures that when a branch is deleted, ALL related data is properly cleaned up
-- Run this in your Supabase SQL Editor

-- 1. Fix USERS table - currently ON DELETE SET NULL, should leave as is for user safety
-- Users will have their branch_id set to NULL when branch is deleted (safer approach)
-- This allows users to be reassigned to other branches

-- 2. Fix EVENTS table - should CASCADE delete when branch is deleted
ALTER TABLE events 
DROP CONSTRAINT IF EXISTS events_branch_id_fkey;

ALTER TABLE events 
ADD CONSTRAINT events_branch_id_fkey 
FOREIGN KEY (branch_id) 
REFERENCES branches(id) 
ON DELETE CASCADE;

-- 3. Fix BRANCH_LEADERS table - should CASCADE delete when branch is deleted  
ALTER TABLE branch_leaders 
DROP CONSTRAINT IF EXISTS branch_leaders_branch_id_fkey;

ALTER TABLE branch_leaders 
ADD CONSTRAINT branch_leaders_branch_id_fkey 
FOREIGN KEY (branch_id) 
REFERENCES branches(id) 
ON DELETE CASCADE;

-- 4. Fix SPONSORS table - should CASCADE delete when branch is deleted
-- (This was already fixed in previous scripts but ensuring it's correct)
ALTER TABLE sponsors 
DROP CONSTRAINT IF EXISTS sponsors_branch_id_fkey;

ALTER TABLE sponsors 
ADD CONSTRAINT sponsors_branch_id_fkey 
FOREIGN KEY (branch_id) 
REFERENCES branches(id) 
ON DELETE CASCADE;

-- 5. Fix HOURS_REQUESTS table relationships
-- Hours requests are linked to users, not directly to branches
-- When users are moved to NULL branch_id, their hours requests should remain
-- But when a user is deleted completely, their hours requests should be deleted
-- This should already be set up correctly with:
-- user_id REFERENCES users(id) ON DELETE CASCADE

-- Verify current foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY' 
    AND (ccu.table_name = 'branches' OR tc.table_name = 'branches')
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- Test query to see what would be affected by deleting a specific branch
-- Replace 'BRANCH_ID_HERE' with actual branch ID to test
/*
-- Uncomment and modify to test before actual deletion:
SELECT 
    'users' as table_name, 
    count(*) as count,
    'branch_id will be set to NULL' as action
FROM users 
WHERE branch_id = BRANCH_ID_HERE

UNION ALL

SELECT 
    'events' as table_name, 
    count(*) as count,
    'will be DELETED' as action
FROM events 
WHERE branch_id = BRANCH_ID_HERE

UNION ALL

SELECT 
    'branch_leaders' as table_name, 
    count(*) as count,
    'will be DELETED' as action
FROM branch_leaders 
WHERE branch_id = BRANCH_ID_HERE

UNION ALL

SELECT 
    'sponsors' as table_name, 
    count(*) as count,
    'will be DELETED' as action
FROM sponsors 
WHERE branch_id = BRANCH_ID_HERE;
*/
