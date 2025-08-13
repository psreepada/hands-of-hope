-- Add sponsors table to support school logos from branch creation
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS sponsors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT NOT NULL,
    sponsor_type VARCHAR(50) DEFAULT 'school', -- 'school', 'organization', 'company'
    branch_id INT REFERENCES branches(id) ON DELETE SET NULL, -- Link to branch for school sponsors
    website_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0, -- For controlling order in carousel
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sponsors_type ON sponsors(sponsor_type);
CREATE INDEX IF NOT EXISTS idx_sponsors_branch ON sponsors(branch_id);
CREATE INDEX IF NOT EXISTS idx_sponsors_active_order ON sponsors(is_active, display_order);

-- Enable RLS (Row Level Security)
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Allow public read access to sponsors (for the carousel)
CREATE POLICY "Public can view sponsors" ON sponsors
FOR SELECT USING (is_active = true);

-- Allow authenticated users to manage sponsors
CREATE POLICY "Authenticated users can manage sponsors" ON sponsors
FOR ALL USING (auth.role() = 'authenticated');

-- Insert existing hardcoded sponsors as organization/company sponsors
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
    ('Jukebox', '/images/rotating/jukebox.png', 'company', 12)
ON CONFLICT DO NOTHING;
