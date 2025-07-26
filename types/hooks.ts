import { type Session } from '@supabase/supabase-js'
import type { User, DashboardData, SupabaseError, Event, EventSignup, Activity } from './database'

// Auth hook types
export interface AuthUser extends User {
  role: 'member' | 'branch_leader' | 'admin' | 'super-admin'
  branch_id: number | null
  db_id?: number
  first_name: string | null
  last_name: string | null
}

export interface UseAuthReturn {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<{ error: SupabaseError | null }>
}

// Auth redirect hook types
export interface UseAuthRedirectReturn {
  // This hook doesn't return anything, it just handles redirects
}

// Dashboard data hook types
export interface UseDashboardDataReturn extends DashboardData {
  // All properties are inherited from DashboardData interface
}

// Mobile hook types
export interface UseIsMobileReturn {
  isMobile: boolean
}

// Toast hook types
export interface ToastOptions {
  id?: string
  title?: string
  description?: string
  action?: React.ReactElement
  duration?: number
  variant?: 'default' | 'destructive'
}

export interface UseToastReturn {
  toast: (options: ToastOptions) => {
    id: string
    dismiss: () => void
    update: (options: Partial<ToastOptions>) => void
  }
  dismiss: (toastId?: string) => void
  toasts: Array<ToastOptions & { id: string }>
}

// Custom hooks for data fetching
export interface UseQueryOptions<T> {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  refetchOnWindowFocus?: boolean
  retry?: number | boolean
  onSuccess?: (data: T) => void
  onError?: (error: unknown) => void
}

export interface UseQueryReturn<T> {
  data: T | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
  refetch: () => void
  isFetching: boolean
  isSuccess: boolean
}

export interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: unknown, variables: TVariables) => void
  onSettled?: (data: TData | undefined, error: unknown | null, variables: TVariables) => void
}

export interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => void
  mutateAsync: (variables: TVariables) => Promise<TData>
  data: TData | undefined
  error: unknown
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  reset: () => void
}

// Specific data fetching hooks
export interface UseUserStatsOptions extends UseQueryOptions<{ totalHours: number; eventsAttended: number }> {
  userId?: number
}

export interface UseUserStatsReturn extends UseQueryReturn<{ totalHours: number; eventsAttended: number }> {}

export interface UseBranchEventsOptions extends UseQueryOptions<Event[]> {
  branchId?: number
  limit?: number
}

export interface UseBranchEventsReturn extends UseQueryReturn<Event[]> {}

export interface UseUserSignupsOptions extends UseQueryOptions<EventSignup[]> {
  userId?: number
}

export interface UseUserSignupsReturn extends UseQueryReturn<EventSignup[]> {}

export interface UseRecentActivityOptions extends UseQueryOptions<Activity[]> {
  userId?: number
  limit?: number
}

export interface UseRecentActivityReturn extends UseQueryReturn<Activity[]> {}

// Form hooks
export interface UseFormOptions<T> {
  defaultValues?: Partial<T>
  validationSchema?: unknown // Could be Zod schema or similar
  onSubmit?: (data: T) => void | Promise<void>
}

export interface UseFormReturn<T> {
  register: (name: keyof T) => {
    name: keyof T
    onChange: (value: unknown) => void
    onBlur: () => void
    value: unknown
  }
  handleSubmit: (onSubmit: (data: T) => void) => (e: React.FormEvent) => void
  formState: {
    errors: Partial<Record<keyof T, string>>
    isSubmitting: boolean
    isValid: boolean
    isDirty: boolean
  }
  setValue: (name: keyof T, value: unknown) => void
  getValues: () => T
  reset: (values?: Partial<T>) => void
  watch: (name?: keyof T) => unknown
}

// Local storage hooks
export interface UseLocalStorageReturn<T> {
  value: T
  setValue: (value: T | ((prev: T) => T)) => void
  removeValue: () => void
}

// Debounce hook
export interface UseDebounceReturn<T> {
  debouncedValue: T
}

// Previous value hook
export interface UsePreviousReturn<T> {
  previousValue: T | undefined
}

// Window size hook
export interface UseWindowSizeReturn {
  width: number | undefined
  height: number | undefined
}

// Intersection observer hook
export interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
}

export interface UseIntersectionObserverReturn {
  ref: (node?: Element | null) => void
  inView: boolean
  entry: IntersectionObserverEntry | undefined
}

// File upload hook
export interface UseFileUploadOptions {
  maxSize?: number
  acceptedTypes?: string[]
  multiple?: boolean
  onSuccess?: (files: File[]) => void
  onError?: (error: string) => void
}

export interface UseFileUploadReturn {
  files: File[]
  isDragging: boolean
  isUploading: boolean
  error: string | null
  uploadFiles: (files: File[]) => Promise<void>
  removeFile: (index: number) => void
  clearFiles: () => void
  getRootProps: () => Record<string, unknown>
  getInputProps: () => Record<string, unknown>
}

// Pagination hook
export interface UsePaginationOptions {
  totalItems: number
  itemsPerPage: number
  initialPage?: number
}

export interface UsePaginationReturn {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void
  startIndex: number
  endIndex: number
}

// Search and filter hooks
export interface UseSearchReturn {
  searchTerm: string
  setSearchTerm: (term: string) => void
  debouncedSearchTerm: string
  clearSearch: () => void
}

export interface UseFiltersReturn<T> {
  filters: T
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void
  clearFilters: () => void
  clearFilter: (key: keyof T) => void
}

// API hooks
export interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Async operation hook
export interface UseAsyncReturn<T, P extends unknown[]> {
  execute: (...args: P) => Promise<T>
  data: T | null
  loading: boolean
  error: string | null
  reset: () => void
}
