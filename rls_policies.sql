-- Row Level Security Policies for Hands of Hope Database
-- Assumes authentication system provides auth.uid() and auth.role() functions

-- Enable RLS on all tables
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user's branch_id
CREATE OR REPLACE FUNCTION get_user_branch()
RETURNS BIGINT AS $$
BEGIN
  RETURN (SELECT branch_id FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- BRANCHES TABLE POLICIES
-- ==============================================

-- Students and branch leaders can read their own branch
CREATE POLICY "Users can read their own branch" ON branches
  FOR SELECT
  USING (
    id = get_user_branch() OR
    get_user_role() = 'admin'
  );

-- Branch leaders can update their own branch
CREATE POLICY "Branch leaders can update their branch" ON branches
  FOR UPDATE
  USING (
    (id = get_user_branch() AND get_user_role() = 'branch_leader') OR
    get_user_role() = 'admin'
  );

-- Only admins can insert new branches
CREATE POLICY "Only admins can create branches" ON branches
  FOR INSERT
  WITH CHECK (get_user_role() = 'admin');

-- Only admins can delete branches
CREATE POLICY "Only admins can delete branches" ON branches
  FOR DELETE
  USING (get_user_role() = 'admin');

-- ==============================================
-- USERS TABLE POLICIES
-- ==============================================

-- Users can read their own profile + branch members can see each other
CREATE POLICY "Users can read accessible profiles" ON users
  FOR SELECT
  USING (
    id = auth.uid() OR  -- Own profile
    (branch_id = get_user_branch() AND get_user_role() IN ('branch_leader', 'admin')) OR  -- Branch members (for leaders)
    get_user_role() = 'admin'  -- Admins see all
  );

-- Users can update their own profile (except role and branch)
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    -- Prevent users from changing their own role or branch (only admins/leaders can)
    (role = (SELECT role FROM users WHERE id = auth.uid()) OR get_user_role() = 'admin') AND
    (branch_id = (SELECT branch_id FROM users WHERE id = auth.uid()) OR get_user_role() IN ('branch_leader', 'admin'))
  );

-- Branch leaders can update users in their branch (role and branch changes)
CREATE POLICY "Branch leaders can manage their users" ON users
  FOR UPDATE
  USING (
    (branch_id = get_user_branch() AND get_user_role() = 'branch_leader') OR
    get_user_role() = 'admin'
  );

-- Allow user registration (insert) - public signup
CREATE POLICY "Allow user registration" ON users
  FOR INSERT
  WITH CHECK (true);  -- Anyone can register, but role defaults to 'student'

-- Only admins can delete users
CREATE POLICY "Only admins can delete users" ON users
  FOR DELETE
  USING (get_user_role() = 'admin');

-- ==============================================
-- EVENTS TABLE POLICIES
-- ==============================================

-- Users can read events from their branch
CREATE POLICY "Users can read branch events" ON events
  FOR SELECT
  USING (
    branch_id = get_user_branch() OR
    get_user_role() = 'admin'
  );

-- Branch leaders can create events for their branch
CREATE POLICY "Branch leaders can create events" ON events
  FOR INSERT
  WITH CHECK (
    (branch_id = get_user_branch() AND get_user_role() = 'branch_leader') OR
    get_user_role() = 'admin'
  );

-- Branch leaders can update events in their branch
CREATE POLICY "Branch leaders can update events" ON events
  FOR UPDATE
  USING (
    (branch_id = get_user_branch() AND get_user_role() = 'branch_leader') OR
    get_user_role() = 'admin'
  );

-- Branch leaders can delete events in their branch
CREATE POLICY "Branch leaders can delete events" ON events
  FOR DELETE
  USING (
    (branch_id = get_user_branch() AND get_user_role() = 'branch_leader') OR
    get_user_role() = 'admin'
  );

-- ==============================================
-- EVENT SIGNUPS TABLE POLICIES
-- ==============================================

-- Users can read their own signups + branch leaders can see all signups for their events
CREATE POLICY "Users can read accessible signups" ON event_signups
  FOR SELECT
  USING (
    user_id = auth.uid() OR  -- Own signups
    (EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_signups.event_id 
      AND e.branch_id = get_user_branch() 
      AND get_user_role() = 'branch_leader'
    )) OR
    get_user_role() = 'admin'
  );

-- Users can create signups for events in their branch
CREATE POLICY "Users can signup for branch events" ON event_signups
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_signups.event_id 
      AND e.branch_id = get_user_branch()
    )
  );

-- Users can update their own signups, branch leaders can update signups for their events
CREATE POLICY "Users can manage relevant signups" ON event_signups
  FOR UPDATE
  USING (
    user_id = auth.uid() OR  -- Own signups
    (EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_signups.event_id 
      AND e.branch_id = get_user_branch() 
      AND get_user_role() = 'branch_leader'
    )) OR
    get_user_role() = 'admin'
  );

-- Users can delete their own signups, branch leaders can delete signups for their events
CREATE POLICY "Users can delete relevant signups" ON event_signups
  FOR DELETE
  USING (
    user_id = auth.uid() OR  -- Own signups
    (EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_signups.event_id 
      AND e.branch_id = get_user_branch() 
      AND get_user_role() = 'branch_leader'
    )) OR
    get_user_role() = 'admin'
  );

-- ==============================================
-- ACHIEVEMENTS TABLE POLICIES
-- ==============================================

-- Everyone can read achievements (public information)
CREATE POLICY "Everyone can read achievements" ON achievements
  FOR SELECT
  USING (true);

-- Only admins can manage achievements
CREATE POLICY "Only admins can manage achievements" ON achievements
  FOR ALL
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

-- ==============================================
-- USER ACHIEVEMENTS TABLE POLICIES
-- ==============================================

-- Users can read their own achievements + branch leaders can see achievements for their branch users
CREATE POLICY "Users can read accessible user achievements" ON user_achievements
  FOR SELECT
  USING (
    user_id = auth.uid() OR  -- Own achievements
    (EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = user_achievements.user_id 
      AND u.branch_id = get_user_branch() 
      AND get_user_role() = 'branch_leader'
    )) OR
    get_user_role() = 'admin'
  );

-- Only admins and branch leaders can award achievements
CREATE POLICY "Leaders can award achievements" ON user_achievements
  FOR INSERT
  WITH CHECK (
    get_user_role() = 'admin' OR
    (get_user_role() = 'branch_leader' AND 
     EXISTS (
       SELECT 1 FROM users u 
       WHERE u.id = user_achievements.user_id 
       AND u.branch_id = get_user_branch()
     ))
  );

-- Only admins can update/delete user achievements
CREATE POLICY "Only admins can modify user achievements" ON user_achievements
  FOR UPDATE
  USING (get_user_role() = 'admin');

CREATE POLICY "Only admins can delete user achievements" ON user_achievements
  FOR DELETE
  USING (get_user_role() = 'admin');

-- ==============================================
-- ADDITIONAL SECURITY FUNCTIONS
-- ==============================================

-- Function to check if user can access specific branch data
CREATE OR REPLACE FUNCTION can_access_branch(target_branch_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    target_branch_id = get_user_branch() OR
    get_user_role() = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is branch leader of specific branch
CREATE OR REPLACE FUNCTION is_branch_leader_of(target_branch_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    target_branch_id = get_user_branch() AND
    get_user_role() = 'branch_leader'
  ) OR get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- VIEWS FOR COMMON QUERIES (WITH RLS APPLIED)
-- ==============================================

-- View for user dashboard data
CREATE VIEW user_dashboard AS
SELECT 
  u.id,
  u.first_name,
  u.last_name,
  u.total_hours,
  u.total_events_attended,
  b.name as branch_name,
  b.school_name,
  COUNT(ua.id) as achievements_count
FROM users u
LEFT JOIN branches b ON u.branch_id = b.id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
WHERE u.id = auth.uid()
GROUP BY u.id, u.first_name, u.last_name, u.total_hours, u.total_events_attended, b.name, b.school_name;

-- View for branch leaderboard (only shows users from same branch)
CREATE VIEW branch_leaderboard AS
SELECT 
  u.first_name,
  u.last_name,
  u.total_hours,
  u.total_events_attended,
  COUNT(ua.id) as achievements_count,
  RANK() OVER (ORDER BY u.total_hours DESC, u.total_events_attended DESC) as rank
FROM users u
LEFT JOIN user_achievements ua ON u.id = ua.user_id
WHERE u.branch_id = get_user_branch() AND u.is_active = true
GROUP BY u.id, u.first_name, u.last_name, u.total_hours, u.total_events_attended
ORDER BY rank;

-- View for upcoming events (only shows events from user's branch)
CREATE VIEW upcoming_events AS
SELECT 
  e.*,
  b.name as branch_name,
  COUNT(es.id) as signup_count,
  CASE WHEN EXISTS (
    SELECT 1 FROM event_signups es2 
    WHERE es2.event_id = e.id AND es2.user_id = auth.uid()
  ) THEN true ELSE false END as user_signed_up
FROM events e
LEFT JOIN branches b ON e.branch_id = b.id
LEFT JOIN event_signups es ON e.id = es.event_id
WHERE e.event_date >= CURRENT_DATE 
  AND e.status = 'upcoming'
  AND e.branch_id = get_user_branch()
GROUP BY e.id, b.name
ORDER BY e.event_date, e.start_time;

-- ==============================================
-- EXAMPLE USAGE AND TESTING QUERIES
-- ==============================================

/*
-- Test queries (run these after setting up authentication context)

-- Set current user context (example - this would be done by your auth system)
-- SELECT set_config('request.jwt.claims', '{"sub": "1", "role": "student"}', true);

-- Test branch access
-- SELECT * FROM branches; -- Should only show user's branch

-- Test user profile access
-- SELECT * FROM users; -- Should show own profile + branch members if leader

-- Test event access
-- SELECT * FROM upcoming_events; -- Should only show events from user's branch

-- Test signup functionality
-- INSERT INTO event_signups (event_id, user_id) VALUES (1, auth.uid()); -- Should work for branch events

-- Test achievement viewing
-- SELECT * FROM user_achievements; -- Should show own achievements + branch users if leader
*/

-- ==============================================
-- ROLE-BASED ACCESS SUMMARY
-- ==============================================

/*
STUDENT PERMISSIONS:
- Read: Own profile, own branch info, branch events, own signups, own achievements
- Write: Own profile updates, signup for branch events
- Cannot: Change role/branch, create events, award achievements

BRANCH_LEADER PERMISSIONS:
- Read: All students in their branch, branch events, all signups for branch events
- Write: Update branch info, create/manage branch events, update student profiles in branch
- Cannot: Access other branches, modify global achievements

ADMIN PERMISSIONS:
- Read: Everything
- Write: Everything
- Can: Create branches, change user roles, manage global achievements
*/ 