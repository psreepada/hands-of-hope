-- Comprehensive Sponsor Cleanup Script
-- Run this in your Supabase SQL Editor to fix orphaned sponsors and prevent future issues

-- Step 1: Check current sponsors status
SELECT 
    'Current Sponsors Status' as action,
    id, 
    name, 
    logo_url, 
    sponsor_type, 
    branch_id, 
    is_active,
    CASE 
        WHEN branch_id IS NULL AND sponsor_type = 'school' THEN 'ORPHANED'
        WHEN branch_id IS NOT NULL AND sponsor_type = 'school' THEN 'VALID'
        ELSE 'NON-SCHOOL'
    END as status
FROM sponsors 
ORDER BY sponsor_type, display_order;

-- Step 2: Clean up orphaned school sponsors (those with NULL branch_id)
DELETE FROM sponsors 
WHERE branch_id IS NULL 
AND sponsor_type = 'school'
AND logo_url NOT IN (
    '/images/rotating/facfb.png',
    '/images/rotating/IAF.png', 
    '/images/rotating/CamF.png',
    '/images/rotating/alphaF.png',
    '/images/rotating/hoochF.png',
    '/images/rotating/mhs.png',
    '/images/rotating/abc.png',
    '/images/rotating/colc.png'
);

-- Step 3: Clean up any sponsors with obviously broken image URLs
DELETE FROM sponsors 
WHERE sponsor_type = 'school' 
AND branch_id IS NULL
AND (
    logo_url LIKE '%branch-images%' OR 
    logo_url LIKE '%school-logo%' OR
    logo_url LIKE '%supabase%' OR
    logo_url LIKE '%amazonaws%'
);

-- Step 4: Update foreign key constraint to CASCADE DELETE
-- This ensures future branch deletions automatically remove associated sponsors
ALTER TABLE sponsors 
DROP CONSTRAINT IF EXISTS sponsors_branch_id_fkey;

ALTER TABLE sponsors 
ADD CONSTRAINT sponsors_branch_id_fkey 
FOREIGN KEY (branch_id) 
REFERENCES branches(id) 
ON DELETE CASCADE;

-- Step 5: Verify cleanup and show final state
SELECT 
    'After Cleanup' as action,
    id, 
    name, 
    logo_url, 
    sponsor_type, 
    branch_id, 
    is_active,
    CASE 
        WHEN branch_id IS NULL AND sponsor_type = 'school' THEN 'POTENTIAL_ISSUE'
        WHEN branch_id IS NOT NULL AND sponsor_type = 'school' THEN 'VALID'
        ELSE 'NON-SCHOOL'
    END as status
FROM sponsors 
WHERE is_active = true
ORDER BY sponsor_type, display_order;

-- Step 6: Show count of sponsors by type
SELECT 
    'Final Count Summary' as action,
    sponsor_type,
    COUNT(*) as count,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_count,
    COUNT(CASE WHEN branch_id IS NULL THEN 1 END) as orphaned_count
FROM sponsors
GROUP BY sponsor_type;

-- Optional: If you want to completely reset and start fresh with just the original sponsors
-- (Uncomment the lines below ONLY if you want to start completely fresh)
/*
DELETE FROM sponsors;

INSERT INTO sponsors (name, logo_url, sponsor_type, display_order) VALUES
    ('Fulton Academy', '/images/rotating/facfb.png', 'school', 1),
    ('Innovation Academy', '/images/rotating/IAF.png', 'school', 2),
    ('Cambridge High School', '/images/rotating/CamF.png', 'school', 3),
    ('Alpharetta High School', '/images/rotating/alphaF.png', 'school', 4),
    ('Chattahoochee High School', '/images/rotating/hoochF.png', 'school', 5),
    ('Open Hand Atlanta', '/images/rotating/OpenHand.png', 'organization', 6),
    ('Atlanta Mission', '/images/rotating/Atlanta Mission.png', 'organization', 7),
    ('Aiwyn', '/images/rotating/aiwyn-logo-2.jpg', 'organization', 8),
    ('Milton High School', '/images/rotating/mhs.png', 'school', 9),
    ('Aden Bowman Collegiate', '/images/rotating/abc.png', 'school', 10),
    ('Centennial Collegiate', '/images/rotating/colc.png', 'school', 11),
    ('Jukebox', '/images/rotating/jukebox.png', 'company', 12);
*/
