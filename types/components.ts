import { type ReactNode } from 'react'
import { Branch, Event, Activity, User } from './database'

// Common component props
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// Animated Counter Props
export interface AnimatedCounterProps {
  end: number
  duration?: number
  className?: string
  prefix?: string
  decimals?: number
  suffix?: string
}

// Branch Card Props
export interface BranchCardProps {
  branch: {
    id: number
    name: string
    image: string
    phone: string
    email: string
    address: string
    volunteers: number
    events: number
    description: string
    meetingDay: string
    meetingTime: string
    leadName: string
    leadTitle: string
  }
}

// Impact Counter Props
export interface ImpactCounterProps {
  title: string
  value: number
  suffix?: string
  prefix?: string
  className?: string
}

// Navbar Props
export interface NavbarProps {
  className?: string
}

// Footer Props
export interface FooterProps {
  className?: string
}

// Sponsor Carousel Props
export interface SponsorCarouselProps {
  sponsors: Array<{
    id: number
    name: string
    logo: string
    website?: string
  }>
  className?: string
}

// Testimonial Slider Props
export interface TestimonialSliderProps {
  testimonials: Array<{
    id: number
    name: string
    role: string
    content: string
    image?: string
    rating?: number
  }>
  className?: string
}

// Theme Provider Props
export interface ThemeProviderProps {
  children: ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

// Upcoming Events Props
export interface UpcomingEventsProps {
  events: Event[]
  isLoading?: boolean
  error?: string | null
  onEventClick?: (event: Event) => void
  className?: string
}

// Donation Modal Provider Props
export interface DonationModalProviderProps {
  children: ReactNode
}

// Supabase Config Error Props
export interface SupabaseConfigErrorProps {
  error: string
  className?: string
}

// Dashboard specific component props
export interface DashboardStatsCardProps {
  title: string
  value: number | string
  icon: ReactNode
  description?: string
  className?: string
}

export interface EventCardProps {
  event: Event & {
    event_signups?: Array<{
      id: number
      user_id: number
      signup_status: string
    }>
  }
  isSignedUp: boolean
  onSignup: (event: Event) => void
  formatDate: (date: string) => string
  formatTime: (time: string) => string
  className?: string
}

export interface ActivityItemProps {
  activity: Activity
  className?: string
}

export interface RecentActivityListProps {
  activities: Activity[]
  isLoading: boolean
  className?: string
}

// Modal component props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface EventSignupModalProps extends ModalProps {
  event: Event | null
  onConfirm: () => void
  isLoading: boolean
  formatDate: (date: string) => string
  formatTime: (time: string) => string
}

export interface LogHoursModalProps extends ModalProps {
  onSubmit: (data: FormData) => void
  isLoading: boolean
  availableEvents: Event[]
}

export interface SettingsModalProps extends ModalProps {
  user: User | null
  branchInfo: Branch | null
  onBranchTransfer: (code: string) => void
  onAccountDelete: () => void
  isTransferLoading: boolean
  isDeleteLoading: boolean
}

// Form component props
export interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file'
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  className?: string
  error?: string
}

export interface FormProps {
  onSubmit: (data: Record<string, unknown>) => void
  fields: FormFieldProps[]
  submitLabel?: string
  isLoading?: boolean
  className?: string
}

// Table component props
export interface TableColumn<T> {
  key: keyof T | string
  label: string
  render?: (value: unknown, row: T) => ReactNode
  sortable?: boolean
  className?: string
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  className?: string
}

// Pagination props
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

// Search and filter props
export interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export interface FilterProps {
  filters: Array<{
    key: string
    label: string
    options: Array<{ value: string; label: string }>
  }>
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  className?: string
}

// Loading and error state props
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  className?: string
}

export interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: ReactNode
  className?: string
}

// Layout component props
export interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
}

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  navigation: Array<{
    name: string
    href: string
    icon: ReactNode
    current?: boolean
  }>
  className?: string
}

export interface HeaderProps {
  user: User | null
  onMenuClick: () => void
  onSignOut: () => void
  className?: string
}

// Chart component props
export interface ChartProps {
  data: Array<Record<string, unknown>>
  xKey: string
  yKey: string
  title?: string
  className?: string
}

export interface StatsCardProps {
  title: string
  value: number | string
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: ReactNode
  className?: string
}
