import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { AuthUser, UseAuthReturn, SupabaseError } from '@/types'

// Re-export AuthUser for backward compatibility
export type { AuthUser }

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      if (session?.user) {
        await getUserProfile(session.user)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (session?.user) {
          await getUserProfile(session.user)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const getUserProfile = async (authUser: User) => {
    try {
      const { data: userRecord, error } = await supabase
        .from('users')
        .select('role, id, branch_id, first_name, last_name')
        .eq('email', authUser.email)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        
        // If user doesn't exist in our users table (PGRST116 = not found)
        if (error.code === 'PGRST116') {
          console.log('User not found in users table, signing out...')
          await supabase.auth.signOut()
          setUser(null)
          return
        }
        
        // For other errors, sign out as well to be safe
        console.log('Database error, signing out for security...')
        await supabase.auth.signOut()
        setUser(null)
        return
      }

      // Only set user if they exist in our users table
      setUser({
        ...authUser,
        role: userRecord.role,
        branch_id: userRecord.branch_id,
        db_id: userRecord.id,
        first_name: userRecord.first_name,
        last_name: userRecord.last_name
      })
    } catch (error) {
      console.error('Error in getUserProfile:', error)
      // On any unexpected error, sign out to be safe
      await supabase.auth.signOut()
      setUser(null)
    }
  }

  const signOut = async (): Promise<{ error: SupabaseError | null }> => {
    const { error } = await supabase.auth.signOut()
    return { error: error as SupabaseError | null }
  }

  return {
    user,
    session,
    loading,
    signOut
  }
} 