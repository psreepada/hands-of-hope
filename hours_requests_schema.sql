-- Hours Requests Table for Hour Logging System
-- This table stores requests from users to log volunteer hours

CREATE TABLE hours_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT REFERENCES events(id) ON DELETE SET NULL, -- Optional: if hours are for a specific registered event
    hours_requested DECIMAL(5,2) NOT NULL CHECK (hours_requested > 0),
    description TEXT NOT NULL, -- User's description of what they did
    image_url TEXT, -- Path to uploaded image in Supabase Storage
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
    admin_notes TEXT, -- Optional notes from admin during review
    admin_hours_awarded DECIMAL(5,2), -- Final hours awarded by admin (might differ from requested)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by BIGINT REFERENCES users(id) ON DELETE SET NULL -- Admin who reviewed the request
);

-- Indexes for better query performance
CREATE INDEX idx_hours_requests_user_id ON hours_requests(user_id);
CREATE INDEX idx_hours_requests_status ON hours_requests(status);
CREATE INDEX idx_hours_requests_created_at ON hours_requests(created_at);
CREATE INDEX idx_hours_requests_event_id ON hours_requests(event_id);

-- RLS (Row Level Security) policies
ALTER TABLE hours_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own hour requests" ON hours_requests
    FOR SELECT USING (
        auth.uid()::text IN (
            SELECT email FROM users WHERE id = hours_requests.user_id
        )
    );

-- Users can insert their own requests  
CREATE POLICY "Users can create their own hour requests" ON hours_requests
    FOR INSERT WITH CHECK (
        auth.uid()::text IN (
            SELECT email FROM users WHERE id = hours_requests.user_id
        )
    );

-- Admins can view all requests in their branch
CREATE POLICY "Admins can view branch hour requests" ON hours_requests
    FOR SELECT USING (
        auth.uid()::text IN (
            SELECT u1.email FROM users u1 
            JOIN users u2 ON u1.branch_id = u2.branch_id
            WHERE u1.role = 'admin' AND u2.id = hours_requests.user_id
        )
    );

-- Admins can update requests (for approval/decline)
CREATE POLICY "Admins can update branch hour requests" ON hours_requests
    FOR UPDATE USING (
        auth.uid()::text IN (
            SELECT u1.email FROM users u1 
            JOIN users u2 ON u1.branch_id = u2.branch_id
            WHERE u1.role = 'admin' AND u2.id = hours_requests.user_id
        )
    );

-- Super admins can view and update all requests
CREATE POLICY "Super admins can manage all hour requests" ON hours_requests
    FOR ALL USING (
        auth.uid()::text IN (
            SELECT email FROM users WHERE role = 'super_admin'
        )
    );

-- Comments for documentation
COMMENT ON TABLE hours_requests IS 'Stores volunteer hour logging requests from users for admin approval';
COMMENT ON COLUMN hours_requests.hours_requested IS 'Number of hours the user is requesting to log';
COMMENT ON COLUMN hours_requests.description IS 'User description of the volunteer work performed';
COMMENT ON COLUMN hours_requests.image_url IS 'URL/path to uploaded proof image in Supabase Storage';
COMMENT ON COLUMN hours_requests.admin_hours_awarded IS 'Final hours awarded by admin (may differ from requested)'; 