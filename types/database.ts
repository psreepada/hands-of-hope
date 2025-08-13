// Database schema types for Supabase tables

export interface User {
  id: number
  email: string
  first_name: string | null
  last_name: string | null
  role: 'member' | 'branch_leader' | 'admin' | 'super-admin'
  branch_id: number | null
  total_hours: number
  total_events_attended: number
  status: 'pending' | 'approved' | 'declined'
  created_at: string
  updated_at: string
}

export interface Branch {
  id: number
  name: string
  school_name: string
  location: string
  leader_name: string | null
  leader_email: string | null
  leader_description: string | null
  leader_image_url: string | null
  image_url: string | null
  phone: string | null
  email: string | null
  address: string | null
  description: string | null
  join_code: string
  total_hours: number
  total_events: number
  total_users: number
  created_at: string
  updated_at: string
}

export interface Event {
  id: number
  name: string
  description: string | null
  event_date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  max_participants: number | null
  event_type: 'volunteer' | 'fundraising' | 'awareness' | 'social'
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  branch_id: number
  created_by: number
  created_at: string
  updated_at: string
}

export interface EventSignup {
  id: number
  event_id: number
  user_id: number
  signup_status: 'registered' | 'attended' | 'no_show' | 'cancelled'
  hours_earned: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface HoursRequest {
  id: number
  user_id: number
  event_id: number | null
  hours_requested: number
  admin_hours_awarded: number | null
  description: string
  image_url: string | null
  status: 'pending' | 'approved' | 'declined'
  admin_notes: string | null
  reviewed_by: number | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  criteria_type: 'hours' | 'events' | 'special'
  criteria_value: number | null
  badge_color: string
  created_at: string
}

export interface UserAchievement {
  id: number
  user_id: number
  achievement_id: number
  earned_at: string
}

// Extended types with relations
export interface EventWithSignups extends Event {
  event_signups: EventSignup[]
}

export interface HoursRequestWithEvent extends HoursRequest {
  events: Pick<Event, 'name' | 'event_type'> | null
}

export interface HoursRequestWithUser extends HoursRequest {
  users: Pick<User, 'first_name' | 'last_name' | 'email'>
}

export interface UserWithBranch extends User {
  branches: Pick<Branch, 'name' | 'school_name'> | null
}

// Database query result types
export interface UserStats {
  totalHours: number
  eventsAttended: number
}

export interface BranchStats {
  totalHours: number
  totalEvents: number
  totalUsers: number
  activeMembers: number
}

// Activity types for dashboard
export interface Activity {
  id: string
  type: 'pending' | 'approved' | 'declined'
  title: string
  description: string
  date: string
  icon: 'clock' | 'check' | 'x' | 'adjust'
  color: 'blue' | 'green' | 'red' | 'yellow'
  adminNotes?: string | null
  requestedHours?: number
  awardedHours?: number | null
  eventName?: string | null
  isPending: boolean
}

// Form data types
export interface LogHoursFormData {
  hours: string
  description: string
  eventId: string
}

export interface Sponsor {
  id: number
  name: string
  logo_url: string
  sponsor_type: 'school' | 'organization' | 'company'
  branch_id: number | null
  website_url: string | null
  description: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface BranchFormData {
  name: string
  schoolName: string
  location: string
  leaderName: string
  leaderEmail: string
  leaderDescription: string
  imageUrl?: string
  leaderImageUrl?: string
  schoolLogoUrl?: string
  phone?: string
  email?: string
  address?: string
  description?: string
}

export interface EventFormData {
  name: string
  description?: string
  eventDate: string
  startTime?: string
  endTime?: string
  location?: string
  maxParticipants?: number
  eventType: Event['event_type']
}

// API response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

// Supabase specific types
export interface SupabaseError {
  message: string
  details: string | null
  hint: string | null
  code: string
}

export interface SupabaseResponse<T> {
  data: T | null
  error: SupabaseError | null
}

// File upload types
export interface FileUploadResult {
  path: string | null
  error: string | null
}

// Dashboard data types
export interface DashboardData {
  userStats: {
    data: UserStats
    isLoading: boolean
    error: unknown
  }
  branchEvents: {
    data: EventWithSignups[]
    isLoading: boolean
    error: unknown
  }
  branchInfo: {
    data: Branch | null
    isLoading: boolean
    error: unknown
  }
  userSignups: {
    data: EventSignup[]
    isLoading: boolean
    error: unknown
  }
  recentActivity: {
    data: Activity[]
    isLoading: boolean
    error: unknown
  }
  isLoading: boolean
  hasError: boolean
  databaseUserId?: number
  refetch: () => void
}
