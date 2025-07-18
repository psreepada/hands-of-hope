-- Migration to add missing fields for authentication workflow
-- Run this in your Supabase SQL Editor to update your existing database

-- Add status field for user approval workflow
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING';

-- Add email confirmation tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT FALSE;

-- Add supabase_user_id to link with Supabase Auth (if using Supabase Auth)
ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_user_id UUID UNIQUE;

-- Add check constraint for status
ALTER TABLE users ADD CONSTRAINT check_user_status 
CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'));

-- Add check constraint for role
ALTER TABLE users ADD CONSTRAINT check_user_role 
CHECK (role IN ('student', 'branch_leader', 'admin'));

-- Add check constraint for event_type
ALTER TABLE events ADD CONSTRAINT check_event_type 
CHECK (event_type IN ('volunteer', 'fundraiser', 'kit_packing', 'meeting', 'training'));

-- Add check constraint for event status
ALTER TABLE events ADD CONSTRAINT check_event_status 
CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled'));

-- Add check constraint for signup status
ALTER TABLE event_signups ADD CONSTRAINT check_signup_status 
CHECK (signup_status IN ('registered', 'attended', 'no_show', 'cancelled'));

-- Insert sample branch data if not exists
INSERT INTO branches (name, school_name, location, join_code, leader_name, leader_email) 
VALUES 
    ('Atlanta Central Branch', 'Milton High School', 'Atlanta, Georgia', '123456', 'Sarah Johnson', 'sarah.johnson@example.com'),
    ('North Georgia Chapter', 'Roswell High School', 'Roswell, Georgia', '234567', 'Michael Chen', 'michael.chen@example.com'),
    ('Metro Atlanta Branch', 'Northview High School', 'Johns Creek, Georgia', '345678', 'Emma Davis', 'emma.davis@example.com')
ON CONFLICT (join_code) DO NOTHING;

-- Insert sample achievements if not exists  
INSERT INTO achievements (name, description, hours_required, events_required, badge_icon) 
VALUES
    ('Getting Started', 'Complete your first volunteer event', 0, 1, 'star.png'),
    ('Dedicated Volunteer', 'Complete 25 hours of service', 25, 0, 'medal.png'),
    ('Event Enthusiast', 'Attend 10 volunteer events', 0, 10, 'trophy.png'),
    ('Community Champion', 'Complete 100 hours of service', 100, 0, 'crown.png'); 