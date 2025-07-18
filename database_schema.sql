-- Hands of Hope Volunteer Management Database Schema

-- Branches table (School chapters/branches)
CREATE TABLE branches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    join_code VARCHAR(6) UNIQUE NOT NULL, -- 6-digit numerical code
    leader_name VARCHAR(255),
    leader_email VARCHAR(255),
    total_hours INT DEFAULT 0,
    total_events INT DEFAULT 0,
    total_users INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table (Students and volunteers)
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY, -- Changed to VARCHAR to match Supabase UUID
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT NOT NULL CHECK (age >= 13 AND age <= 25),
    role ENUM('student', 'branch_leader', 'admin') DEFAULT 'student',
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING', -- Added status field
    branch_id INT,
    total_hours DECIMAL(5,2) DEFAULT 0.00,
    total_events_attended INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    email_confirmed BOOLEAN DEFAULT FALSE, -- Added for email verification tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

-- Events table (Volunteer events and activities)
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    location VARCHAR(255),
    max_participants INT,
    hours_awarded DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    branch_id INT,
    event_type ENUM('volunteer', 'fundraiser', 'kit_packing', 'meeting', 'training') DEFAULT 'volunteer',
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- Event signups table (Junction table for user-event relationships)
CREATE TABLE event_signups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    signup_status ENUM('registered', 'attended', 'no_show', 'cancelled') DEFAULT 'registered',
    hours_earned DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_signup (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Additional useful tables for a complete system

-- Achievements table (For awards and recognition)
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    hours_required DECIMAL(5,2),
    events_required INT,
    badge_icon VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements table (Junction table for user achievements)
CREATE TABLE user_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_branch ON events(branch_id);
CREATE INDEX idx_signups_user ON event_signups(user_id);
CREATE INDEX idx_signups_event ON event_signups(event_id);
CREATE INDEX idx_branches_join_code ON branches(join_code);

-- Sample data for testing
INSERT INTO branches (name, school_name, location, join_code, leader_name, leader_email) VALUES
('Atlanta Central Branch', 'Milton High School', 'Atlanta, Georgia', '123456', 'Sarah Johnson', 'sarah.johnson@example.com'),
('North Georgia Chapter', 'Roswell High School', 'Roswell, Georgia', '234567', 'Michael Chen', 'michael.chen@example.com'),
('Metro Atlanta Branch', 'Northview High School', 'Johns Creek, Georgia', '345678', 'Emma Davis', 'emma.davis@example.com');

INSERT INTO users (first_name, last_name, email, password_hash, age, role, branch_id) VALUES
('John', 'Doe', 'john.doe@example.com', '$2b$10$hashedpassword1', 16, 'student', 1),
('Jane', 'Smith', 'jane.smith@example.com', '$2b$10$hashedpassword2', 17, 'student', 1),
('Alex', 'Johnson', 'alex.johnson@example.com', '$2b$10$hashedpassword3', 18, 'branch_leader', 2);

INSERT INTO events (name, description, event_date, start_time, end_time, location, max_participants, hours_awarded, branch_id, event_type) VALUES
('Food Bank Volunteer Day', 'Help sort and pack food for local families in need', '2024-02-15', '09:00:00', '15:00:00', 'Atlanta Community Food Bank', 25, 6.00, 1, 'volunteer'),
('Fundraiser Car Wash', 'Raise money for homeless shelter supplies', '2024-02-20', '10:00:00', '16:00:00', 'Milton High School Parking Lot', 15, 6.00, 1, 'fundraiser'),
('Care Package Assembly', 'Assemble care packages for homeless individuals', '2024-02-25', '14:00:00', '17:00:00', 'Community Center', 20, 3.00, 2, 'kit_packing');

INSERT INTO achievements (name, description, hours_required, events_required, badge_icon) VALUES
('Getting Started', 'Complete your first volunteer event', 0, 1, 'star.png'),
('Dedicated Volunteer', 'Complete 25 hours of service', 25, 0, 'medal.png'),
('Event Enthusiast', 'Attend 10 volunteer events', 0, 10, 'trophy.png'),
('Community Champion', 'Complete 100 hours of service', 100, 0, 'crown.png');

-- Triggers to automatically update totals

DELIMITER //

-- Update user totals when event signup status changes
CREATE TRIGGER update_user_stats_after_signup 
AFTER UPDATE ON event_signups
FOR EACH ROW
BEGIN
    IF NEW.signup_status = 'attended' AND OLD.signup_status != 'attended' THEN
        UPDATE users 
        SET total_hours = total_hours + NEW.hours_earned,
            total_events_attended = total_events_attended + 1
        WHERE id = NEW.user_id;
    ELSEIF OLD.signup_status = 'attended' AND NEW.signup_status != 'attended' THEN
        UPDATE users 
        SET total_hours = total_hours - OLD.hours_earned,
            total_events_attended = total_events_attended - 1
        WHERE id = NEW.user_id;
    END IF;
END//

-- Update branch totals when user stats change
CREATE TRIGGER update_branch_stats_after_user_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF OLD.branch_id IS NOT NULL THEN
        UPDATE branches 
        SET total_hours = (
            SELECT COALESCE(SUM(total_hours), 0) 
            FROM users 
            WHERE branch_id = OLD.branch_id
        ),
        total_events = (
            SELECT COALESCE(SUM(total_events_attended), 0) 
            FROM users 
            WHERE branch_id = OLD.branch_id
        )
        WHERE id = OLD.branch_id;
    END IF;
    
    IF NEW.branch_id IS NOT NULL THEN
        UPDATE branches 
        SET total_hours = (
            SELECT COALESCE(SUM(total_hours), 0) 
            FROM users 
            WHERE branch_id = NEW.branch_id
        ),
        total_events = (
            SELECT COALESCE(SUM(total_events_attended), 0) 
            FROM users 
            WHERE branch_id = NEW.branch_id
        )
        WHERE id = NEW.branch_id;
    END IF;
END//

-- Update branch user count when users are added/removed
CREATE TRIGGER update_branch_user_count_after_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.branch_id IS NOT NULL THEN
        UPDATE branches 
        SET total_users = (
            SELECT COUNT(*) 
            FROM users 
            WHERE branch_id = NEW.branch_id AND is_active = TRUE
        )
        WHERE id = NEW.branch_id;
    END IF;
END//

CREATE TRIGGER update_branch_user_count_after_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF OLD.branch_id IS NOT NULL THEN
        UPDATE branches 
        SET total_users = (
            SELECT COUNT(*) 
            FROM users 
            WHERE branch_id = OLD.branch_id AND is_active = TRUE
        )
        WHERE id = OLD.branch_id;
    END IF;
    
    IF NEW.branch_id IS NOT NULL AND NEW.branch_id != OLD.branch_id THEN
        UPDATE branches 
        SET total_users = (
            SELECT COUNT(*) 
            FROM users 
            WHERE branch_id = NEW.branch_id AND is_active = TRUE
        )
        WHERE id = NEW.branch_id;
    END IF;
END//

DELIMITER ;

-- Useful queries for the application

-- Get all users in a specific branch with their stats
-- SELECT u.*, b.name as branch_name 
-- FROM users u 
-- JOIN branches b ON u.branch_id = b.id 
-- WHERE b.join_code = '123456';

-- Get upcoming events for a specific branch
-- SELECT * FROM events 
-- WHERE branch_id = 1 AND event_date >= CURDATE() AND status = 'upcoming'
-- ORDER BY event_date, start_time;

-- Get user's event history
-- SELECT e.name, e.event_date, es.signup_status, es.hours_earned
-- FROM event_signups es
-- JOIN events e ON es.event_id = e.id
-- WHERE es.user_id = 1
-- ORDER BY e.event_date DESC;

-- Get branch leaderboard by hours
-- SELECT first_name, last_name, total_hours, total_events_attended
-- FROM users 
-- WHERE branch_id = 1 AND is_active = TRUE
-- ORDER BY total_hours DESC, total_events_attended DESC
-- LIMIT 10; 