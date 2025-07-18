import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './useAuth'

export const useAuthRedirect = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/admin', '/super-admin']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    
    // If on a protected route
    if (isProtectedRoute) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login?redirect=' + encodeURIComponent(pathname))
        return
      }

      // Route based on role only (no status checks needed)
      if (pathname === '/super-admin') {
        // Super-admin page is reserved for system-wide administration
        if (user.role === 'super-admin') {
          // Allow super-admin access
          return
        } else if (user.role === 'admin') {
          router.push('/admin') // Redirect admins to their proper admin page
          return
        } else {
          router.push('/dashboard') // Redirect non-admins to dashboard
          return
        }
      }
      
      if (pathname === '/admin' && !['admin', 'branch_leader'].includes(user.role || '')) {
        router.push('/dashboard') // Redirect members away from admin
        return
      }
    }

    // If logged in and on login/signup pages, redirect to appropriate dashboard
    if (user && ['/login', '/signup'].includes(pathname)) {
      // All users (including admins) go to dashboard first
      // Admins can then choose to access admin portal from dashboard
      if (user.role === 'branch_leader') {
        router.push('/admin')
      } else {
        router.push('/dashboard') // This includes both members and admins
      }
    }
  }, [user, loading, pathname, router])
} 