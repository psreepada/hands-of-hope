-- Hands of Hope Database Setup for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension for Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Branches table (School chapters/branches)
CREATE TABLE IF NOT EXISTS branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    join_code VARCHAR(6) UNIQUE NOT NULL, -- 6-digit numerical code
    leader_name VARCHAR(255),
    leader_email VARCHAR(255),
    total_hours INT DEFAULT 0,
    total_events INT DEFAULT 0,
    total_users INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table (Students and volunteers) - Updated for Supabase Auth
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT NOT NULL CHECK (age >= 13 AND age <= 25),
    role TEXT CHECK (role IN ('student', 'branch_leader', 'admin')) DEFAULT 'student',
    status TEXT CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING',
    branch_id INT REFERENCES branches(id) ON DELETE SET NULL,
    total_hours DECIMAL(5,2) DEFAULT 0.00,
    total_events_attended INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    email_confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table (Volunteer events and activities)
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    location VARCHAR(255),
    max_participants INT,
    hours_awarded DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    branch_id INT REFERENCES branches(id) ON DELETE CASCADE,
    event_type TEXT CHECK (event_type IN ('volunteer', 'fundraiser', 'kit_packing', 'meeting', 'training')) DEFAULT 'volunteer',
    status TEXT CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Event signups table (Junction table for user-event relationships)
CREATE TABLE IF NOT EXISTS event_signups (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    signup_status TEXT CHECK (signup_status IN ('registered', 'attended', 'no_show', 'cancelled')) DEFAULT 'registered',
    hours_earned DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Achievements table (For awards and recognition)
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    hours_required DECIMAL(5,2),
    events_required INT,
    badge_icon VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User achievements table (Junction table for user achievements)
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_branch ON users(branch_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_branch ON events(branch_id);
CREATE INDEX IF NOT EXISTS idx_signups_user ON event_signups(user_id);
CREATE INDEX IF NOT EXISTS idx_signups_event ON event_signups(event_id);
CREATE INDEX IF NOT EXISTS idx_branches_join_code ON branches(join_code);

-- Sample data for testing
INSERT INTO branches (name, school_name, location, join_code, leader_name, leader_email) VALUES
('Atlanta Central Branch', 'Milton High School', 'Atlanta, Georgia', '123456', 'Sarah Johnson', 'sarah.johnson@example.com'),
('North Georgia Chapter', 'Roswell High School', 'Roswell, Georgia', '234567', 'Michael Chen', 'michael.chen@example.com'),
('Metro Atlanta Branch', 'Northview High School', 'Johns Creek, Georgia', '345678', 'Emma Davis', 'emma.davis@example.com')
ON CONFLICT (join_code) DO NOTHING;

-- Sample achievements
INSERT INTO achievements (name, description, hours_required, events_required, badge_icon) VALUES
('Getting Started', 'Complete your first volunteer event', 0, 1, 'star.png'),
('Dedicated Volunteer', 'Complete 25 hours of service', 25, 0, 'medal.png'),
('Event Enthusiast', 'Attend 10 volunteer events', 0, 10, 'trophy.png'),
('Community Champion', 'Complete 100 hours of service', 100, 0, 'crown.png')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view branches" ON branches FOR SELECT USING (true);
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);

CREATE POLICY "Users can view own signups" ON event_signups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own signups" ON event_signups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own signups" ON event_signups FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id); 