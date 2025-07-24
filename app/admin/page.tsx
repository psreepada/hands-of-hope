"use client"

import { useAuth } from "@/hooks/useAuth"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Shield, Users, Building, Calendar, BarChart3, School, X, Plus, MapPin, Clock, ChevronDown, CheckCircle, Trash2, AlertTriangle } from "lucide-react"
import { useState, useEffect, memo } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { AdminSkeleton } from "@/components/ui/skeleton-loader"
import toast, { Toaster } from 'react-hot-toast'

export default function AdminPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [branchData, setBranchData] = useState<any>(null)
  const [branchUsers, setBranchUsers] = useState<any[]>([])
  const [branchEvents, setBranchEvents] = useState<any[]>([])
  const [totalHours, setTotalHours] = useState(0)
  const [dataLoading, setDataLoading] = useState(true)
  
  // Create Event Modal State
  const [showCreateEventModal, setShowCreateEventModal] = useState(false)
  const [eventFormData, setEventFormData] = useState({
    name: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    location: "",
    max_participants: "",
    event_type: "volunteer"
  })
  const [createEventLoading, setCreateEventLoading] = useState(false)
  
  // View Registrations Modal State
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false)
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState<any>(null)
  const [eventRegistrations, setEventRegistrations] = useState<any[]>([])
  const [registrationsLoading, setRegistrationsLoading] = useState(false)
  
  // Role Management State
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null)
  
  // Delete User State
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any>(null)
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("")
  const [deleteUserLoading, setDeleteUserLoading] = useState(false)
  const [showFinalDeleteModal, setShowFinalDeleteModal] = useState(false)
  
  // Search State
  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  
  // Filter State
  const [roleFilter, setRoleFilter] = useState("all") // all, admin, member
  const [hoursFilter, setHoursFilter] = useState("all") // all, 0-10, 11-25, 26-50, 51+
  const [eventsFilter, setEventsFilter] = useState("all") // all, 0-2, 3-5, 6-10, 11+
  
  // Approve Hours State
  const [showApproveHoursModal, setShowApproveHoursModal] = useState(false)
  const [hourRequests, setHourRequests] = useState<any[]>([])
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [approveHoursLoading, setApproveHoursLoading] = useState(false)
  const [editingHours, setEditingHours] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending") // pending, approved, declined
  const [showDeclineConfirmModal, setShowDeclineConfirmModal] = useState(false)
  
  // Protect this route
  useAuthRedirect()

  const handleSignOut = async () => {
    await signOut()
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateEventLoading(true)

    try {
      console.log("🎪 Creating event with data:", eventFormData)

      // Validate required fields
      if (!eventFormData.name || !eventFormData.event_date || !eventFormData.start_time) {
        toast.error("Please fill in all required fields (Name, Date, Start Time)")
        setCreateEventLoading(false)
        return
      }

      // Prepare the event data
      const eventData = {
        name: eventFormData.name,
        description: eventFormData.description || null,
        event_date: eventFormData.event_date,
        start_time: eventFormData.start_time,
        end_time: eventFormData.end_time || null,
        location: eventFormData.location || null,
        max_participants: eventFormData.max_participants ? parseInt(eventFormData.max_participants) : null,
        hours_awarded: 0.00, // Will be set later by admin
        branch_id: user?.branch_id,
        event_type: eventFormData.event_type,
        status: 'upcoming'
      }

      console.log("📤 Inserting event:", eventData)

      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()

      if (error) {
        console.error("❌ Event creation failed:", error)
        toast.error("Failed to create event: " + error.message)
        return
      }

      console.log("✅ Event created successfully:", data)
      
      // Reset form and close modal
      setEventFormData({
        name: "",
        description: "",
        event_date: "",
        start_time: "",
        end_time: "",
        location: "",
        max_participants: "",
        event_type: "volunteer"
      })
      setShowCreateEventModal(false)
      
      // Refresh the events list by re-fetching all data
      await fetchBranchData()
      
      toast.success("🎉 Event created successfully!")

    } catch (error) {
      console.error("❌ Unexpected error creating event:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setCreateEventLoading(false)
    }
  }

  const handleEventFormChange = (field: string, value: string) => {
    setEventFormData(prev => ({ ...prev, [field]: value }))
  }

  const getEventSignupCount = (event: any) => {
    return event.event_signups?.filter(
      (signup: any) => signup.signup_status === 'registered'
    ).length || 0
  }

  const handleViewRegistrations = async (event: any) => {
    setSelectedEventForRegistrations(event)
    setShowRegistrationsModal(true)
    setRegistrationsLoading(true)

    try {
      console.log("👥 Fetching registrations for event:", event.id)

      // Fetch detailed user information for all registrations
      const { data: registrations, error } = await supabase
        .from('event_signups')
        .select(`
          *,
          users:user_id (
            id,
            first_name,
            last_name,
            email,
            total_hours,
            total_events_attended
          )
        `)
        .eq('event_id', event.id)
        .eq('signup_status', 'registered')

      if (error) {
        console.error("❌ Registrations fetch error:", error)
        toast.error("Failed to fetch registrations: " + error.message)
        return
      }

      console.log("✅ Event registrations:", registrations)
      setEventRegistrations(registrations || [])

    } catch (error) {
      console.error("❌ Error fetching registrations:", error)
      toast.error("An error occurred while fetching registrations.")
    } finally {
      setRegistrationsLoading(false)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: 'admin' | 'member') => {
    setRoleUpdating(userId)

    try {
      console.log("🔄 Updating role for user:", userId, "to:", newRole)

      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) {
        console.error("❌ Role update failed:", error)
        toast.error("Failed to update role: " + error.message)
        return
      }

      console.log("✅ Role updated successfully")
      
      // Refresh the branch data to show updated roles
      await fetchBranchData()
      
      toast.success(`Role updated to ${newRole} successfully!`)

    } catch (error) {
      console.error("❌ Error updating role:", error)
      toast.error("An error occurred while updating the role.")
    } finally {
      setRoleUpdating(null)
    }
  }

  const handleDeleteUser = async () => {
    if (deleteConfirmationText !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm user deletion")
      return
    }

    if (!userToDelete) return

    setShowFinalDeleteModal(true)
  }

  const confirmUserDeletion = async () => {
    setDeleteUserLoading(true)

    try {
      // Get user's hour requests to delete associated images
      const { data: hourRequests, error: hourRequestsError } = await supabase
        .from('hours_requests')
        .select('image_url')
        .eq('user_id', userToDelete.id)

      if (hourRequestsError) {
        console.error("❌ Error fetching user's hour requests:", hourRequestsError)
        // Continue with deletion even if we can't fetch hour requests
      }

      // Delete images from storage if they exist
      if (hourRequests && hourRequests.length > 0) {
        const imageUrls = hourRequests
          .filter(req => req.image_url)
          .map(req => {
            // Extract filename from Supabase storage URL
            try {
              const url = new URL(req.image_url)
              return url.pathname.split('/').slice(-2).join('/') // Get user_folder/filename
            } catch {
              return null
            }
          })
          .filter((url): url is string => url !== null)

        if (imageUrls.length > 0) {
          console.log("🗑️ Deleting images from storage:", imageUrls)
          const { error: storageError } = await supabase
            .storage
            .from('hour-request-images')
            .remove(imageUrls)

          if (storageError) {
            console.error("❌ Error deleting images:", storageError)
            // Continue with user deletion even if image deletion fails
          }
        }
      }

      // Update branch statistics before deleting user
      if (userToDelete.total_hours > 0 || userToDelete.total_events_attended > 0) {
        const { error: branchUpdateError } = await supabase
          .from('branches')
          .update({
            total_hours: Math.max(0, (branchData?.total_hours || 0) - (userToDelete.total_hours || 0)),
            total_events_attended: Math.max(0, (branchData?.total_events_attended || 0) - (userToDelete.total_events_attended || 0)),
            total_members: Math.max(0, (branchData?.total_members || 0) - 1)
          })
          .eq('id', user?.branch_id)

        if (branchUpdateError) {
          console.error("❌ Branch stats update error:", branchUpdateError)
          // Continue with deletion
        }
      }

      // Delete user from database (this will cascade delete related records due to foreign key constraints)
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userToDelete.id)

      if (deleteError) {
        console.error("❌ User deletion error:", deleteError)
        toast.error("Failed to delete user: " + deleteError.message)
        return
      }

      // If user has Supabase Auth account, delete it (this requires admin privileges)
      // Note: This step might fail if the user was created differently, but we'll continue anyway
      try {
        const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userToDelete.id)
        if (authDeleteError) {
          console.error("❌ Auth user deletion error:", authDeleteError)
          // This is non-critical, continue
        }
      } catch (authError) {
        console.error("❌ Auth deletion failed:", authError)
        // This is non-critical, continue
      }

      toast.success(`✅ User ${userToDelete.first_name} ${userToDelete.last_name} has been successfully deleted.`)
      
      // Close modal and refresh data
      setShowDeleteUserModal(false)
      setShowFinalDeleteModal(false)
      setUserToDelete(null)
      setDeleteConfirmationText("")
      await fetchBranchData()
      await fetchHourRequests()

    } catch (error) {
      console.error("❌ Unexpected error during user deletion:", error)
      toast.error("An unexpected error occurred during deletion. Please try again.")
    } finally {
      setDeleteUserLoading(false)
    }
  }

  const filteredBranchUsers = branchUsers.filter(member => {
    // Search filter
    if (memberSearchQuery.trim()) {
      const searchLower = memberSearchQuery.toLowerCase()
      const fullName = `${member.first_name} ${member.last_name}`.toLowerCase()
      const email = member.email.toLowerCase()
      
      if (!fullName.includes(searchLower) && !email.includes(searchLower)) {
        return false
      }
    }
    
    // Role filter
    if (roleFilter !== "all" && member.role !== roleFilter) {
      return false
    }
    
    // Hours filter
    const memberHours = member.total_hours || 0
    if (hoursFilter !== "all") {
      if (hoursFilter === "0-10" && (memberHours < 0 || memberHours > 10)) return false
      if (hoursFilter === "11-25" && (memberHours < 11 || memberHours > 25)) return false
      if (hoursFilter === "26-50" && (memberHours < 26 || memberHours > 50)) return false
      if (hoursFilter === "51+" && memberHours < 51) return false
    }
    
    // Events filter
    const memberEvents = member.total_events_attended || 0
    if (eventsFilter !== "all") {
      if (eventsFilter === "0-2" && (memberEvents < 0 || memberEvents > 2)) return false
      if (eventsFilter === "3-5" && (memberEvents < 3 || memberEvents > 5)) return false
      if (eventsFilter === "6-10" && (memberEvents < 6 || memberEvents > 10)) return false
      if (eventsFilter === "11+" && memberEvents < 11) return false
    }
    
    return true
  })

  const clearAllFilters = () => {
    setMemberSearchQuery("")
    setRoleFilter("all")
    setHoursFilter("all")
    setEventsFilter("all")
  }

  const hasActiveFilters = memberSearchQuery.trim() || roleFilter !== "all" || hoursFilter !== "all" || eventsFilter !== "all"

  const fetchHourRequests = async () => {
    if (!user?.branch_id) {
      console.warn("⚠️ Admin user doesn't have a branch_id for hour requests")
      setHourRequests([])
      return
    }
    
    try {
      console.log("🔍 Fetching hour requests for branch:", user.branch_id)

      const { data: requests, error } = await supabase
        .from('hours_requests')
        .select(`
          *,
          users:user_id (
            id,
            first_name,
            last_name,
            email,
            branch_id
          ),
          events:event_id (
            id,
            name,
            event_date
          )
        `)
        .eq('users.branch_id', user.branch_id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error("❌ Hour requests fetch error:", error)
        setHourRequests([])
      } else {
        console.log("✅ Hour requests:", requests)
        setHourRequests(requests || [])
      }
    } catch (error) {
      console.error("❌ Error fetching hour requests:", error)
      setHourRequests([])
    }
  }

  const handleApproveHours = async (requestId: string, action: 'approve' | 'decline') => {
    setApproveHoursLoading(true)

    try {
      console.log(`🔄 ${action === 'approve' ? 'Approving' : 'Declining'} hour request:`, requestId)

      // Get current user database ID for reviewed_by
      const { data: currentDbUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user?.email)
        .single()

      if (userError || !currentDbUser) {
        console.error("❌ Admin user lookup failed:", userError)
        toast.error("Unable to find your admin account. Please contact support.")
        setApproveHoursLoading(false)
        return
      }

      const updateData: any = {
        status: action === 'approve' ? 'approved' : 'declined',
        reviewed_at: new Date().toISOString(),
        reviewed_by: currentDbUser.id,
        admin_notes: adminNotes || null
      }

      // If approving, set the awarded hours
      if (action === 'approve') {
        const hoursToAward = editingHours ? parseFloat(editingHours) : selectedRequest?.hours_requested
        updateData.admin_hours_awarded = hoursToAward
      }

      const { error } = await supabase
        .from('hours_requests')
        .update(updateData)
        .eq('id', requestId)

      if (error) {
        console.error(`❌ ${action} failed:`, error)
        toast.error(`Failed to ${action} request: ` + error.message)
        return
      }

      // If approved, update user's total hours and events attended
      if (action === 'approve') {
        const hoursToAward = updateData.admin_hours_awarded
        const userId = selectedRequest?.user_id

        // Update user's total hours
        const { error: userUpdateError } = await supabase
          .rpc('increment_user_hours', {
            user_id: userId,
            hours_to_add: hoursToAward
          })

        if (userUpdateError) {
          console.error("❌ Failed to update user hours:", userUpdateError)
          // We'll try a direct update instead
          const { data: currentUser, error: fetchError } = await supabase
            .from('users')
            .select('total_hours, total_events_attended')
            .eq('id', userId)
            .single()

          if (!fetchError && currentUser) {
            const newTotalHours = (currentUser.total_hours || 0) + hoursToAward
            let newEventsAttended = currentUser.total_events_attended || 0

            // Only increment events_attended if this hour request is linked to an event
            // AND the user hasn't already been marked as attended for this specific event
            if (selectedRequest?.event_id) {
              // Check if user is already marked as 'attended' for this specific event
              const { data: existingSignup, error: signupError } = await supabase
                .from('event_signups')
                .select('signup_status')
                .eq('user_id', userId)
                .eq('event_id', selectedRequest.event_id)
                .single()

              if (signupError && signupError.code !== 'PGRST116') {
                console.error("❌ Error checking event signup:", signupError)
              }

              // Only increment if:
              // 1. User has no signup record for this event, OR
              // 2. User has a signup but isn't marked as 'attended' yet
              if (!existingSignup || existingSignup.signup_status !== 'attended') {
                newEventsAttended += 1
                
                // Also update the event signup status to 'attended' if a signup exists
                if (existingSignup) {
                  await supabase
                    .from('event_signups')
                    .update({ 
                      signup_status: 'attended',
                      hours_earned: hoursToAward 
                    })
                    .eq('user_id', userId)
                    .eq('event_id', selectedRequest.event_id)
                }
              }
            }

            await supabase
              .from('users')
              .update({
                total_hours: newTotalHours,
                total_events_attended: newEventsAttended
              })
              .eq('id', userId)
          }
        }
      }

      console.log(`✅ Hour request ${action}d successfully`)
      
      // Reset modal state and refresh data
      setSelectedRequest(null)
      setEditingHours("")
      setAdminNotes("")
      
      await fetchHourRequests()
      await fetchBranchData() // Refresh to update user stats
      
      toast.success(`🎉 Hour request ${action}d successfully!`)

    } catch (error) {
      console.error(`❌ Error ${action}ing request:`, error)
      toast.error(`An error occurred while ${action}ing the request.`)
    } finally {
      setApproveHoursLoading(false)
    }
  }

// Image component that handles async signed URL loading (memoized to prevent reloading)
const ImageDisplay = memo(({ imagePath, className, alt }: { imagePath: string, className: string, alt: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImage = async () => {
      if (!imagePath) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.storage
          .from('hour-request-images')
          .createSignedUrl(imagePath, 3600) // 1 hour expiry
        
        if (error) {
          console.error("Error creating signed URL:", error)
          setImageUrl('/placeholder.jpg')
        } else {
          setImageUrl(data.signedUrl)
        }
      } catch (error) {
        console.error("Error getting image URL:", error)
        setImageUrl('/placeholder.jpg')
      } finally {
        setLoading(false)
      }
    }

    loadImage()
  }, [imagePath])

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <img
      src={imageUrl || '/placeholder.jpg'}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = '/placeholder.jpg'
      }}
    />
  )
})

  const fetchBranchData = async () => {
    if (!user?.branch_id) {
      console.warn("⚠️ Admin user doesn't have a branch_id")
      setDataLoading(false)
      return
    }
    
    console.log("🔍 Fetching data for branch_id:", user.branch_id)

    try {
      // 🚀 PERFORMANCE OPTIMIZATION: Execute all queries in parallel
      const [
        { data: branch, error: branchError },
        { data: users, error: usersError },
        { data: events, error: eventsError }
      ] = await Promise.all([
        // Fetch branch information
        supabase
          .from('branches')
          .select('id, name, school_name, location, leader_name, leader_email, join_code')
          .eq('id', user.branch_id)
          .single(),

        // Fetch users in this branch (limit fields for better performance)
        supabase
          .from('users')
          .select('id, first_name, last_name, email, role, total_hours, total_events_attended, created_at')
          .eq('branch_id', user.branch_id)
          .order('created_at', { ascending: false })
          .limit(100), // Limit to 100 users for better performance

        // Fetch branch events (limit fields and results)
        supabase
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
            status,
            event_signups (
              id,
              user_id,
              signup_status
            )
          `)
          .eq('branch_id', user.branch_id)
          .order('event_date', { ascending: false })
          .limit(50) // Limit to 50 events for better performance
      ])

      // Process branch data
      if (branchError) {
        console.error("❌ Branch fetch error:", branchError)
        setBranchData(null)
      } else {
        console.log("✅ Branch data:", branch)
        setBranchData(branch)
      }

      // Process users data
      if (usersError) {
        console.error("❌ Users fetch error:", usersError)
        setBranchUsers([])
        setTotalHours(0)
      } else {
        console.log("✅ Branch users:", users)
        setBranchUsers(users || [])
        
        // Calculate total volunteer hours for this branch
        const totalBranchHours = (users || []).reduce((sum, user) => sum + (user.total_hours || 0), 0)
        setTotalHours(totalBranchHours)
      }

      // Process events data
      if (eventsError) {
        console.error("❌ Events fetch error:", eventsError)
        setBranchEvents([])
      } else {
        console.log("✅ Branch events:", events)
        setBranchEvents(events || [])
      }

    } catch (error) {
      console.error("❌ Error fetching branch data:", error)
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    if (user?.branch_id) {
      fetchBranchData()
      fetchHourRequests()
    } else if (user && !user.branch_id) {
      // If user is loaded but doesn't have a branch_id, set loading to false
      setDataLoading(false)
    }
  }, [user?.branch_id, user])

  if (loading || dataLoading) {
    return <AdminSkeleton />
  }

  // Handle case where admin doesn't have a branch_id
  if (user && !user.branch_id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
                <School className="h-8 w-8" />
                Branch Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Branch management and oversight</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-600 mb-2">No Branch Assigned</h2>
                <p className="text-gray-600 mb-4">
                  Your admin account is not associated with any branch. Please contact a super admin to assign you to a branch.
                </p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
              <School className="h-8 w-8" />
              Branch Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              {branchData ? `Managing ${branchData.school_name}` : 'Branch management and oversight'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Branch Info Card */}
        {branchData && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Building className="h-5 w-5" />
                Branch Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">School</p>
                  <p className="font-semibold text-blue-800">{branchData.school_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Join Code</p>
                  <p className="font-mono font-semibold text-blue-800">{branchData.join_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Volunteer Hours</p>
                  <p className="font-semibold text-blue-800">{totalHours.toLocaleString()} hrs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Branch Admin Actions
            </CardTitle>
            <CardDescription>
              Quick administrative actions for your branch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2 relative"
                onClick={() => setShowApproveHoursModal(true)}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Approve Hours</span>
                {hourRequests.filter(req => req.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {hourRequests.filter(req => req.status === 'pending').length}
                  </span>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => setShowCreateEventModal(true)}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Create Event</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Branch Management Sections */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Branch Members ({branchUsers.length})
              </CardTitle>
              <CardDescription>
                Manage volunteers in your branch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div>
                  <Input
                    placeholder="Search members by name or email..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Role</Label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Hours</Label>
                    <select
                      value={hoursFilter}
                      onChange={(e) => setHoursFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Hours</option>
                      <option value="0-10">0-10 hours</option>
                      <option value="11-25">11-25 hours</option>
                      <option value="26-50">26-50 hours</option>
                      <option value="51+">51+ hours</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Events</Label>
                    <select
                      value={eventsFilter}
                      onChange={(e) => setEventsFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Events</option>
                      <option value="0-2">0-2 events</option>
                      <option value="3-5">3-5 events</option>
                      <option value="6-10">6-10 events</option>
                      <option value="11+">11+ events</option>
                    </select>
                  </div>
                </div>
                
                {/* Filter Summary and Clear Button */}
                {hasActiveFilters && (
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <span className="text-sm text-blue-800">
                      Showing {filteredBranchUsers.length} of {branchUsers.length} members
                    </span>
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-100"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {filteredBranchUsers.length > 0 ? (
                  filteredBranchUsers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{member.first_name} {member.last_name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-xs text-gray-500">
                          Hours: {member.total_hours || 0} • Events: {member.total_events_attended || 0}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleUpdate(member.id, e.target.value as 'admin' | 'member')}
                            disabled={roleUpdating === member.id}
                            className={`
                              appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm font-medium
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                              ${member.role === 'admin' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-gray-700'}
                              ${roleUpdating === member.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
                            `}
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                          
                          {roleUpdating === member.id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUserToDelete(member)
                            setShowDeleteUserModal(true)
                          }}
                          className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                          title={`Delete ${member.first_name} ${member.last_name}'s account`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : hasActiveFilters ? (
                  <p className="text-gray-500 text-center py-4">
                    No members found matching the current filters.
                  </p>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No members in your branch yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Branch Events ({branchEvents.length})
              </CardTitle>
              <CardDescription>
                Events organized by your branch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {branchEvents.length > 0 ? (
                  branchEvents.map((event) => (
                    <div key={event.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-blue-800">{event.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.event_type === 'volunteer' ? 'bg-green-100 text-green-800' :
                          event.event_type === 'fundraising' ? 'bg-blue-100 text-blue-800' :
                          event.event_type === 'awareness' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.event_type}
                        </span>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      )}
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            {event.start_time}
                            {event.end_time && ` - ${event.end_time}`}
                          </span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>
                            {getEventSignupCount(event)} registered
                            {event.max_participants && ` / ${event.max_participants} max`}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3" />
                          <span className={`capitalize ${
                            event.status === 'upcoming' ? 'text-green-600' :
                            event.status === 'completed' ? 'text-blue-600' :
                            'text-gray-600'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <Button
                          onClick={() => handleViewRegistrations(event)}
                          variant="outline"
                          size="sm"
                          className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View Registrations ({getEventSignupCount(event)})
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    <p>No events created yet.</p>
                    <p className="text-xs mt-2">Create your first event using the button above.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Event Modal */}
        {showCreateEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-blue-800">Create New Event</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateEventModal(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
                {/* Event Name */}
                <div className="space-y-2">
                  <Label htmlFor="eventName" className="text-sm font-medium text-gray-700">
                    Event Name *
                  </Label>
                  <Input
                    id="eventName"
                    type="text"
                    placeholder="e.g., Community Food Drive"
                    value={eventFormData.name}
                    onChange={(e) => handleEventFormChange("name", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="eventDescription" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id="eventDescription"
                    placeholder="Describe the event and what volunteers will do..."
                    value={eventFormData.description}
                    onChange={(e) => handleEventFormChange("description", e.target.value)}
                    className="w-full"
                    rows={3}
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate" className="text-sm font-medium text-gray-700">
                      Event Date *
                    </Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={eventFormData.event_date}
                      onChange={(e) => handleEventFormChange("event_date", e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                      Start Time *
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={eventFormData.start_time}
                      onChange={(e) => handleEventFormChange("start_time", e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={eventFormData.end_time}
                      onChange={(e) => handleEventFormChange("end_time", e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="eventLocation" className="text-sm font-medium text-gray-700">
                    Location
                  </Label>
                  <Input
                    id="eventLocation"
                    type="text"
                    placeholder="e.g., Local Food Bank, 123 Main St"
                    value={eventFormData.location}
                    onChange={(e) => handleEventFormChange("location", e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Max Participants */}
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants" className="text-sm font-medium text-gray-700">
                    Max Participants
                  </Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="e.g., 20"
                    value={eventFormData.max_participants}
                    onChange={(e) => handleEventFormChange("max_participants", e.target.value)}
                    className="w-full"
                    min="1"
                  />
                </div>

                {/* Event Type */}
                <div className="space-y-2">
                  <Label htmlFor="eventType" className="text-sm font-medium text-gray-700">
                    Event Type
                  </Label>
                  <select
                    id="eventType"
                    value={eventFormData.event_type}
                    onChange={(e) => handleEventFormChange("event_type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="fundraising">Fundraising</option>
                    <option value="awareness">Awareness</option>
                    <option value="community">Community</option>
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateEventModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createEventLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {createEventLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Registrations Modal */}
        {showRegistrationsModal && selectedEventForRegistrations && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Event Registrations</h3>
                  <p className="text-sm text-gray-600">{selectedEventForRegistrations.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowRegistrationsModal(false)
                    setSelectedEventForRegistrations(null)
                    setEventRegistrations([])
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6">
                {registrationsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading registrations...</p>
                  </div>
                ) : eventRegistrations.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>{eventRegistrations.length}</strong> volunteers registered for this event
                      </p>
                    </div>
                    
                    {eventRegistrations.map((registration, index) => (
                      <div key={registration.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {registration.users?.first_name} {registration.users?.last_name}
                            </h4>
                            <p className="text-sm text-gray-600">{registration.users?.email}</p>
                            
                            <div className="mt-2 flex gap-4 text-xs text-gray-500">
                              <span>Total Hours: {registration.users?.total_hours || 0}</span>
                              <span>Events Attended: {registration.users?.total_events_attended || 0}</span>
                            </div>
                            
                            <div className="mt-2">
                              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                {registration.signup_status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right text-xs text-gray-500">
                            <p>Registered on</p>
                            <p>{new Date(registration.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No registrations yet</p>
                    <p className="text-sm text-gray-500">Users will appear here when they sign up for this event</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Approve Hours Modal */}
        {showApproveHoursModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-blue-800">Approve Volunteer Hours</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowApproveHoursModal(false)
                    setSelectedRequest(null)
                    setEditingHours("")
                    setAdminNotes("")
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6">
                {hourRequests.length > 0 ? (
                  <div className="space-y-4">
                    {/* Status Filter Tabs */}
                    <div className="flex gap-2 mb-6">
                      {['pending', 'approved', 'declined'].map((status) => (
                        <Button
                          key={status}
                          variant={status === statusFilter ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setStatusFilter(status)}
                          className={status === statusFilter ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)} 
                          ({hourRequests.filter(req => req.status === status).length})
                        </Button>
                      ))}
                    </div>

                    {/* Compact Requests List */}
                    <div className="space-y-2">
                      {hourRequests.filter(req => req.status === statusFilter).map((request) => (
                        <div 
                          key={request.id} 
                          className={`border rounded-lg p-3 bg-white hover:bg-blue-50 cursor-pointer transition-colors border-l-4 ${
                            request.status === 'pending' ? 'border-l-yellow-500' :
                            request.status === 'approved' ? 'border-l-green-500' :
                            'border-l-red-500'
                          }`}
                          onClick={() => {
                            setSelectedRequest(request)
                            setEditingHours(request.hours_requested.toString())
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* User Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  {request.users?.first_name} {request.users?.last_name}
                                </h4>
                                <p className="text-sm text-gray-600 truncate">{request.users?.email}</p>
                              </div>
                              
                              {/* Quick Details */}
                              <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
                                <span className="font-medium">{request.hours_requested} hrs</span>
                                {request.events && (
                                  <span className="truncate max-w-32">{request.events.name}</span>
                                )}
                                <span>{new Date(request.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            {/* Status & Arrow */}
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {request.status}
                              </span>
                              <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                            </div>
                          </div>
                          
                          {/* Mobile-only quick details */}
                          <div className="sm:hidden mt-2 flex items-center gap-3 text-xs text-gray-500">
                            <span className="font-medium">{request.hours_requested} hrs</span>
                            <span>•</span>
                            <span>{new Date(request.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {hourRequests.filter(req => req.status === statusFilter).length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <p className="text-gray-600">No {statusFilter} hour requests</p>
                        <p className="text-sm text-gray-500">
                          {statusFilter === 'pending' ? 'All requests have been processed' :
                           statusFilter === 'approved' ? 'No requests have been approved yet' :
                           'No requests have been declined yet'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hour requests yet</p>
                    <p className="text-sm text-gray-500">Requests will appear here when volunteers log their hours</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Review Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-blue-800">Review Hour Request</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(null)
                    setEditingHours("")
                    setAdminNotes("")
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Volunteer Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">
                    {selectedRequest.users?.first_name} {selectedRequest.users?.last_name}
                  </h4>
                  <p className="text-sm text-blue-700">{selectedRequest.users?.email}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Submitted: {new Date(selectedRequest.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Request Details */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Description of Work</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border text-sm">
                      {selectedRequest.description}
                    </div>
                  </div>

                  {selectedRequest.events && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Related Event</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded border text-sm">
                        {selectedRequest.events.name} - {new Date(selectedRequest.events.event_date).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {/* Hours Adjustment */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Label htmlFor="editHours" className="text-sm font-medium text-gray-700">
                      Hours to Award
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 min-w-0">Requested:</span>
                        <span className="font-medium text-gray-900">{selectedRequest.hours_requested} hours</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 min-w-0">Award:</span>
                        <Input
                          id="editHours"
                          type="number"
                          step="0.5"
                          min="0"
                          max="24"
                          value={editingHours}
                          onChange={(e) => setEditingHours(e.target.value)}
                          className="w-24 font-medium"
                          placeholder="Hours"
                        />
                        <span className="text-sm text-gray-500">hours</span>
                      </div>
                      <p className="text-xs text-blue-600">
                        💡 You can adjust the hours if the request seems too high or low
                      </p>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <Label htmlFor="adminNotes" className="text-sm font-medium text-gray-700">
                      Admin Notes (Optional)
                    </Label>
                    <Textarea
                      id="adminNotes"
                      placeholder="Add any notes about this approval..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {/* Proof Image */}
                  {selectedRequest.image_url && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Proof Photo</Label>
                      <div className="mt-1 border rounded-lg overflow-hidden shadow-lg">
                        <ImageDisplay
                          imagePath={selectedRequest.image_url}
                          alt="Volunteer work proof"
                          className="w-full h-[36rem] object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setSelectedRequest(null)
                      setEditingHours("")
                      setAdminNotes("")
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDeclineConfirmModal(true)
                    }}
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    disabled={approveHoursLoading}
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={() => handleApproveHours(selectedRequest.id, 'approve')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={approveHoursLoading || !editingHours}
                  >
                    {approveHoursLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve ({editingHours} hrs)
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete User Modal */}
        {showDeleteUserModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-red-800">Delete User Account</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDeleteUserModal(false)
                    setUserToDelete(null)
                    setDeleteConfirmationText("")
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4">
                {/* User Info */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900">
                    {userToDelete.first_name} {userToDelete.last_name}
                  </h4>
                  <p className="text-sm text-red-700">{userToDelete.email}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Total Hours: {userToDelete.total_hours || 0} • Events: {userToDelete.total_events_attended || 0}
                  </p>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <div className="text-yellow-600 mt-0.5">⚠️</div>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Permanent Deletion Warning</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• User's account will be permanently deleted</li>
                        <li>• All hour requests and images will be removed</li>
                        <li>• Event registrations will be cancelled</li>
                        <li>• Branch statistics will be updated</li>
                        <li>• This action cannot be undone</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Confirmation Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Type <span className="font-mono bg-gray-100 px-1 rounded">DELETE</span> to confirm:
                  </Label>
                  <Input
                    type="text"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="w-full"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteUserModal(false)
                      setUserToDelete(null)
                      setDeleteConfirmationText("")
                    }}
                    className="flex-1"
                    disabled={deleteUserLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={confirmUserDeletion}
                    disabled={deleteUserLoading || deleteConfirmationText !== "DELETE"}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {deleteUserLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Decline Hour Request Confirmation Modal */}
        {showDeclineConfirmModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-red-800">Decline Hour Request</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeclineConfirmModal(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg text-red-700 mb-4">
                  Are you sure you want to decline this hour request?
                </p>
                <p className="text-sm text-red-600 mb-6">
                  This will reject {selectedRequest.hours_requested} hours for {selectedRequest.users?.first_name} {selectedRequest.users?.last_name}.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeclineConfirmModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      handleApproveHours(selectedRequest.id, 'decline')
                      setShowDeclineConfirmModal(false)
                    }}
                    disabled={approveHoursLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {approveHoursLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Declining...
                      </>
                    ) : (
                      'Decline Request'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final User Deletion Confirmation Modal */}
        {showFinalDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-red-800">Confirm User Deletion</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFinalDeleteModal(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 text-center">
                <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg text-red-700 mb-4">
                  Are you absolutely sure you want to delete {userToDelete.first_name} {userToDelete.last_name}'s account?
                </p>
                <p className="text-sm text-red-600 mb-6">
                  This will permanently delete all their volunteer hours, event registrations, and hour requests. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowFinalDeleteModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmUserDeletion}
                    disabled={deleteUserLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {deleteUserLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete User'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
} 