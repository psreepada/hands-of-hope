import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const useHomepageStats = () => {
  return useQuery({
    queryKey: ['homepageStats'],
    queryFn: async () => {
      // Get branch count
      const { data: branches, error: branchesError } = await supabase
        .from('branches')
        .select('id')
      
      if (branchesError) throw branchesError

      // Get total members count
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
      
      if (usersError) throw usersError

      // Get total hours across all users
      const { data: totalHours, error: hoursError } = await supabase
        .from('users')
        .select('total_hours')
      
      if (hoursError) throw hoursError

      // Calculate total hours
      const totalHoursSum = totalHours?.reduce((sum, user) => sum + (user.total_hours || 0), 0) || 0

      return {
        branchCount: branches?.length || 0,
        totalMembers: users?.length || 0,
        totalHours: totalHoursSum,
        // Static values for other metrics
        shelterPartnerships: 13,
        mealsServed: 19000,
        fundsRaised: 9300
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  })
} 