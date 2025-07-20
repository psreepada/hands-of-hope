import { useQuery, useQueries } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export const useDashboardData = () => {
  const { user } = useAuth()

  // Parallel queries using useQueries for optimal performance
  const queries = useQueries({
    queries: [
      // User stats query
      {
        queryKey: ['userStats', user?.email],
        queryFn: async () => {
          if (!user?.email) throw new Error('No user email')
          
          const { data, error } = await supabase
            .from('users')
            .select('id, total_hours, total_events_attended')
            .eq('email', user.email)
            .single()
          
          if (error) throw error
          return data
        },
        enabled: !!user?.email,
        staleTime: 2 * 60 * 1000, // 2 minutes
      },

      // Branch events query  
      {
        queryKey: ['branchEvents', user?.branch_id],
        queryFn: async () => {
          if (!user?.branch_id) throw new Error('No branch ID')
          
          const { data, error } = await supabase
            .from('events')
            .select(`
              id,
              name,
              description,
              event_date,
              start_time,
              end_time,
              location,
              max_participants,
              event_type,
              event_signups!inner (
                id,
                user_id,
                signup_status
              )
            `)
            .eq('branch_id', user.branch_id)
            .eq('status', 'upcoming')
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true })
            .limit(20) // Limit to upcoming 20 events
          
          if (error) throw error
          return data || []
        },
        enabled: !!user?.branch_id,
        staleTime: 3 * 60 * 1000, // 3 minutes
      },

      // Branch info query
      {
        queryKey: ['branchInfo', user?.branch_id],
        queryFn: async () => {
          if (!user?.branch_id) throw new Error('No branch ID')
          
          const { data, error } = await supabase
            .from('branches')
            .select('id, name, school_name, location, leader_name, leader_email')
            .eq('id', user.branch_id)
            .single()
          
          if (error) throw error
          return data
        },
        enabled: !!user?.branch_id,
        staleTime: 10 * 60 * 1000, // 10 minutes (branch info changes rarely)
      }
    ]
  })

  // User signups query (depends on user ID from first query)
  const userSignupsQuery = useQuery({
    queryKey: ['userSignups', queries[0].data?.id],
    queryFn: async () => {
      if (!queries[0].data?.id) throw new Error('No user ID')
      
      const { data, error } = await supabase
        .from('event_signups')
        .select('id, event_id, signup_status, hours_earned')
        .eq('user_id', queries[0].data.id)
      
      if (error) throw error
      return data || []
    },
    enabled: !!queries[0].data?.id && !queries[0].isLoading,
    staleTime: 2 * 60 * 1000,
  })

  // Recent activity query (depends on user ID from first query)
  const recentActivityQuery = useQuery({
    queryKey: ['recentActivity', queries[0].data?.id],
    queryFn: async () => {
      if (!queries[0].data?.id) throw new Error('No user ID')
      
      const { data, error } = await supabase
        .from('hours_requests')
        .select(`
          id,
          hours_requested,
          admin_hours_awarded,
          description,
          status,
          created_at,
          reviewed_at,
          admin_notes,
          events (
            name,
            event_type
          )
        `)
        .eq('user_id', queries[0].data.id)
        .in('status', ['pending', 'approved', 'declined'])
        .gte('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) throw error
      
      // Process activities
      const activities = (data || []).map(hourRequest => {
        const isApproved = hourRequest.status === 'approved'
        const isPending = hourRequest.status === 'pending'
        const isAdjusted = isApproved && hourRequest.admin_hours_awarded !== hourRequest.hours_requested
        
        let title, description, icon, color, displayDate

        if (isPending) {
          title = `${hourRequest.hours_requested} hours pending review`
          description = hourRequest.events ? 
            `For ${hourRequest.events.name}` : 
            hourRequest.description.substring(0, 50) + (hourRequest.description.length > 50 ? '...' : '')
          icon = 'clock'
          color = 'blue'
          displayDate = hourRequest.created_at
        } else if (isApproved) {
          if (isAdjusted) {
            title = `${hourRequest.hours_requested} hours adjusted to ${hourRequest.admin_hours_awarded} hours`
            description = `Originally requested ${hourRequest.hours_requested} hrs, admin awarded ${hourRequest.admin_hours_awarded} hrs`
            icon = 'adjust'
            color = 'yellow'
          } else {
            title = `${hourRequest.admin_hours_awarded || hourRequest.hours_requested} volunteer hours approved`
            description = hourRequest.events ? 
              `For ${hourRequest.events.name}` : 
              hourRequest.description.substring(0, 50) + (hourRequest.description.length > 50 ? '...' : '')
            icon = 'check'
            color = 'green'
          }
          displayDate = hourRequest.reviewed_at
        } else {
          title = `${hourRequest.hours_requested} hours declined`
          description = hourRequest.events ? 
            `For ${hourRequest.events.name}` : 
            hourRequest.description.substring(0, 50) + (hourRequest.description.length > 50 ? '...' : '')
          icon = 'x'
          color = 'red'
          displayDate = hourRequest.reviewed_at
        }

        return {
          id: `hours_${hourRequest.id}`,
          type: hourRequest.status,
          title,
          description,
          date: displayDate,
          icon,
          color,
          adminNotes: hourRequest.admin_notes,
          requestedHours: hourRequest.hours_requested,
          awardedHours: hourRequest.admin_hours_awarded,
          eventName: hourRequest.events?.name,
          isPending
        }
      })

      // Sort activities: pending first, then by date (most recent first)
      activities.sort((a, b) => {
        if (a.isPending && !b.isPending) return -1
        if (!a.isPending && b.isPending) return 1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      return activities
    },
    enabled: !!queries[0].data?.id && !queries[0].isLoading,
    staleTime: 1 * 60 * 1000, // 1 minute (activity updates frequently)
  })

  // Derived data
  const isLoading = queries.some(query => query.isLoading) || userSignupsQuery.isLoading || recentActivityQuery.isLoading
  const hasError = queries.some(query => query.error) || userSignupsQuery.error || recentActivityQuery.error

  return {
    // Individual query results
    userStats: {
      data: queries[0].data ? {
        totalHours: queries[0].data.total_hours || 0,
        eventsAttended: queries[0].data.total_events_attended || 0
      } : { totalHours: 0, eventsAttended: 0 },
      isLoading: queries[0].isLoading,
      error: queries[0].error
    },
    branchEvents: {
      data: queries[1].data || [],
      isLoading: queries[1].isLoading,
      error: queries[1].error
    },
    branchInfo: {
      data: queries[2].data,
      isLoading: queries[2].isLoading,
      error: queries[2].error
    },
    userSignups: {
      data: userSignupsQuery.data || [],
      isLoading: userSignupsQuery.isLoading,
      error: userSignupsQuery.error
    },
    recentActivity: {
      data: recentActivityQuery.data || [],
      isLoading: recentActivityQuery.isLoading,
      error: recentActivityQuery.error
    },

    // Overall state
    isLoading,
    hasError,
    databaseUserId: queries[0].data?.id,

    // Refetch functions
    refetch: () => {
      queries.forEach(query => query.refetch())
      userSignupsQuery.refetch()
      recentActivityQuery.refetch()
    }
  }
} 