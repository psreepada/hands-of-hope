import React from 'react'

// Re-export all types from different modules
export * from './database'
export * from './components'
export * from './hooks'

// Additional utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

// Common utility types for the application
export type ID = number | string
export type Timestamp = string
export type Email = string
export type URL = string

// Status types
export type Status = 'pending' | 'approved' | 'declined' | 'active' | 'inactive'
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Event handler types
export type EventHandler<T = void> = (event: T) => void
export type AsyncEventHandler<T = void> = (event: T) => Promise<void>

// API types
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type ContentType = 'application/json' | 'multipart/form-data' | 'text/plain'

// Form types
export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'time'
export type ValidationRule = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: unknown) => boolean | string
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'
export type ColorScheme = 'teal' | 'blue' | 'green' | 'purple' | 'red' | 'yellow'

// Size types
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'

// Layout types
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type Direction = 'horizontal' | 'vertical'
export type Alignment = 'start' | 'center' | 'end' | 'stretch'
export type Justification = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

// Navigation types
export type NavigationItem = {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  current?: boolean
  children?: NavigationItem[]
}

// Permission types
export type Permission = 'read' | 'write' | 'delete' | 'admin'
export type Role = 'member' | 'branch_leader' | 'admin' | 'super-admin'

// File types
export type FileType = 'image' | 'document' | 'video' | 'audio'
export type ImageFormat = 'jpeg' | 'jpg' | 'png' | 'gif' | 'webp' | 'svg'
export type DocumentFormat = 'pdf' | 'doc' | 'docx' | 'txt' | 'csv' | 'xlsx'

// Date and time types
export type DateFormat = 'short' | 'medium' | 'long' | 'full'
export type TimeFormat = '12h' | '24h'

// Error types
export type ErrorType = 'validation' | 'network' | 'server' | 'client' | 'unknown'
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export type NotificationPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

// Chart types
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter'
export type ChartData = {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

// Filter types
export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between'
export type SortDirection = 'asc' | 'desc'
export type SortOption<T> = {
  key: keyof T
  direction: SortDirection
}

// Pagination types
export type PaginationInfo = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// Search types
export type SearchOptions = {
  query: string
  filters?: Record<string, unknown>
  sort?: SortOption<unknown>[]
  pagination?: Pick<PaginationInfo, 'page' | 'pageSize'>
}

// Modal types
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type ModalPosition = 'center' | 'top' | 'bottom'

// Animation types
export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce'
export type AnimationDuration = 'fast' | 'normal' | 'slow'
export type AnimationEasing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'

// State management types
export type ActionType = string
export type Action<T = unknown> = {
  type: ActionType
  payload?: T
}

export type Reducer<S, A> = (state: S, action: A) => S

// Generic utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

export type Flatten<T> = T extends Array<infer U> ? U : T

export type NonNullable<T> = T extends null | undefined ? never : T

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

export type ValuesOfType<T, U> = T[KeysOfType<T, U>]

// Function types
export type AsyncFunction<T extends unknown[] = [], R = void> = (...args: T) => Promise<R>
export type SyncFunction<T extends unknown[] = [], R = void> = (...args: T) => R
export type AnyFunction<T extends unknown[] = [], R = unknown> = AsyncFunction<T, R> | SyncFunction<T, R>

// Component types
export type ComponentWithChildren<P = {}> = React.FC<P & { children: React.ReactNode }>
export type ComponentWithOptionalChildren<P = {}> = React.FC<P & { children?: React.ReactNode }>

// Event types
export type MouseEventHandler = React.MouseEventHandler<HTMLElement>
export type ChangeEventHandler = React.ChangeEventHandler<HTMLInputElement>
export type FormEventHandler = React.FormEventHandler<HTMLFormElement>
export type KeyboardEventHandler = React.KeyboardEventHandler<HTMLElement>

// Ref types
export type ElementRef<T extends keyof JSX.IntrinsicElements> = React.ElementRef<T>
export type ComponentRef<T extends React.ComponentType<unknown>> = React.ComponentRef<T>
