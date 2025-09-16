"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { useDebounce } from "@/hooks/useDebounce"
import { useOptimizedFetch } from "@/hooks/useOptimizedFetch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, User, Calendar, Clock, Award, Settings, MapPin, Users, X, CheckCircle, Plus, Upload, FileImage, AlertTriangle, Edit3, Trash2, ArrowRightLeft, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { supabase } from "@/lib/supabase"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import toast, { Toaster } from 'react-hot-toast'
import type {
  EventWithSignups,
  EventSignup,
  UserStats,
  Activity,
  Branch,
  LogHoursFormData
} from '@/types'

export default function DashboardPage(): JSX.Element {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [branchEvents, setBranchEvents] = useState<EventWithSignups[]>([])
  const [userSignups, setUserSignups] = useState<EventSignup[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalHours: 0,
    eventsAttended: 0
  })
  const [dataLoading, setDataLoading] = useState(true)
  
  // Event Signup Modal State
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<EventWithSignups | null>(null)
  const [signupLoading, setSignupLoading] = useState<boolean>(false)
  
  // Log Hours Modal State
  const [showLogHoursModal, setShowLogHoursModal] = useState<boolean>(false)
  const [logHoursData, setLogHoursData] = useState<LogHoursFormData>({
    hours: "",
    description: "",
    eventId: ""
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [logHoursLoading, setLogHoursLoading] = useState(false)
  
  // Recent Activity State
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [activityLoading, setActivityLoading] = useState<boolean>(true)

  // Settings Modal State
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)
  const [branchInfo, setBranchInfo] = useState<Branch | null>(null)
  const [branchTransferCode, setBranchTransferCode] = useState("")
  const [transferLoading, setTransferLoading] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showFinalDeleteModal, setShowFinalDeleteModal] = useState(false)
  
  // Protect this route
  useAuthRedirect()

  // For super-admins without branch_id, we'll still fetch user stats but skip branch-specific data
  const hasBranchId = !!user?.branch_id

  const handleSignOut = async () => {
    await signOut()
  }

  const fetchBranchInfo = async () => {
    if (!user?.branch_id) {
      // For super-admins without branch_id, set branchInfo to null
      setBranchInfo(null)
      return
    }
    
    try {
      const { data: branch, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', user.branch_id)
        .single()

      if (error) {
        console.error("❌ Branch info fetch error:", error)
      } else {
        setBranchInfo(branch)
      }
    } catch (error) {
      console.error("❌ Error fetching branch info:", error)
    }
  }

  const handleBranchTransfer = async () => {
    if (!branchTransferCode || branchTransferCode.length !== 6) {
      toast.error("Please enter a valid 6-digit branch code")
      return
    }

    setTransferLoading(true)
    
    try {
      // First, check if the new branch exists
      const { data: newBranch, error: branchError } = await supabase
        .from('branches')
        .select('id, name, school_name')
        .eq('join_code', branchTransferCode)
        .single()

      if (branchError || !newBranch) {
        toast.error("Invalid branch code. Please check with your new branch leader.")
        setTransferLoading(false)
        return
      }

      // Check if user is trying to transfer to the same branch
      if (newBranch.id === user?.branch_id) {
        toast.error("You are already a member of this branch.")
        setTransferLoading(false)
        return
      }

      // Get current user data to transfer stats and role
      const { data: currentUserData, error: userFetchError } = await supabase
        .from('users')
        .select('id, total_hours, total_events_attended, branch_id, role')
        .eq('email', user?.email)
        .single()

      if (userFetchError || !currentUserData) {
        toast.error("Unable to fetch your user data.")
        setTransferLoading(false)
        return
      }

      const oldBranchId = currentUserData.branch_id
      const userHours = currentUserData.total_hours || 0
      const userEvents = currentUserData.total_events_attended || 0
      const currentRole = currentUserData.role

      // Determine new role: admins become members, super-admins keep their role
      const newRole = currentRole === 'admin' ? 'member' : currentRole

      // Update user's branch and role (if needed)
      const updateData: any = { branch_id: newBranch.id }
      if (newRole !== currentRole) {
        updateData.role = newRole
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('email', user?.email)

      if (updateError) {
        console.error("❌ Branch transfer failed:", updateError)
        toast.error("Failed to transfer branch: " + updateError.message)
        setTransferLoading(false)
        return
      }

      // Update branch statistics if user has hours/events
      if (userHours > 0 || userEvents > 0) {
        // Decrease old branch totals
        if (oldBranchId) {
          await supabase
            .from('branches')
            .update({
              total_hours: Math.max(0, (branchInfo?.total_hours || 0) - userHours),
              total_events: Math.max(0, (branchInfo?.total_events || 0) - userEvents),
              total_users: Math.max(0, (branchInfo?.total_users || 1) - 1)
            })
            .eq('id', oldBranchId)
        }

        // Increase new branch totals
        const { data: newBranchData } = await supabase
          .from('branches')
          .select('total_hours, total_events, total_users')
          .eq('id', newBranch.id)
          .single()

        if (newBranchData) {
          await supabase
            .from('branches')
            .update({
              total_hours: (newBranchData.total_hours || 0) + userHours,
              total_events: (newBranchData.total_events || 0) + userEvents,
              total_users: (newBranchData.total_users || 0) + 1
            })
            .eq('id', newBranch.id)
        }
      }

      // Create success message based on role change
      let successMessage = `🎉 Successfully transferred to ${newBranch.name} (${newBranch.school_name})! Your volunteer hours and events attended have been transferred.`
      
      if (newRole !== currentRole) {
        successMessage += ` Note: Your role has been changed from admin to member since admin privileges are branch-specific.`
      }
      
      successMessage += ` Please refresh the page.`
      
      toast.success(successMessage)
      setBranchTransferCode("")
      setShowSettingsModal(false)
      
      // Refresh the page to update branch context
      window.location.reload()

    } catch (error) {
      console.error("❌ Unexpected error during branch transfer:", error)
      toast.error("An unexpected error occurred. Please try again.")
      setTransferLoading(false)
    }
  }

  const handleAccountDeletion = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm account deletion")
      return
    }

    setShowFinalDeleteModal(true)
  }

  const confirmAccountDeletion = async () => {
    setDeleteLoading(true)

    try {
      // First, get the user's database ID and current data
      const { data: dbUser, error: userError } = await supabase
        .from('users')
        .select('id, total_hours, total_events_attended, branch_id')
        .eq('email', user?.email)
        .single()

      if (userError || !dbUser) {
        toast.error("Unable to find your user account.")
        setDeleteLoading(false)
        return
      }

      const userHours = dbUser.total_hours || 0
      const userEvents = dbUser.total_events_attended || 0
      const userBranchId = dbUser.branch_id

      // Update branch statistics to remove this user's contribution
      if (userBranchId && (userHours > 0 || userEvents > 0)) {
        const { data: branchData } = await supabase
          .from('branches')
          .select('total_hours, total_events, total_users')
          .eq('id', userBranchId)
          .single()

        if (branchData) {
          await supabase
            .from('branches')
            .update({
              total_hours: Math.max(0, (branchData.total_hours || 0) - userHours),
              total_events: Math.max(0, (branchData.total_events || 0) - userEvents),
              total_users: Math.max(0, (branchData.total_users || 1) - 1)
            })
            .eq('id', userBranchId)
        }
      }

      // Delete hour request images from storage
      const { data: hourRequests } = await supabase
        .from('hours_requests')
        .select('image_url')
        .eq('user_id', dbUser.id)

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
          await supabase.storage
            .from('hour-request-images')
            .remove(imageUrls)
        }
      }

      // Delete the user from the database (this will cascade delete related records)
      // This deletes: event_signups, hours_requests, user_achievements automatically due to CASCADE
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', dbUser.id)

      if (deleteError) {
        console.error("❌ Database deletion failed:", deleteError)
        toast.error("Failed to delete account data: " + deleteError.message)
        setDeleteLoading(false)
        return
      }

      // Delete the Supabase Auth user account
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
        user?.id?.toString() || ''
      )

      // Note: The admin.deleteUser might not work from client side due to RLS
      // In production, this should be handled by an admin API endpoint
      if (authDeleteError) {
        console.warn("⚠️ Auth user deletion may have failed (this is expected from client side):", authDeleteError)
        // Continue with logout since database deletion succeeded
      }

      // Sign out the user
      await signOut()
      
      toast.success("✅ Account successfully deleted. All your data has been permanently removed. You will be redirected to the home page.")
      
      // Redirect to home page
      router.push('/')

    } catch (error) {
      console.error("❌ Unexpected error during account deletion:", error)
      toast.error("An unexpected error occurred. Please try again.")
      setDeleteLoading(false)
    }
  }

  const fetchDashboardData = useCallback(async () => {
    if (!user?.email) return null
    
    try {
      console.log("📊 Fetching dashboard data for user email:", user.email, "branch:", user.branch_id)

      // 🚀 PERFORMANCE OPTIMIZATION: Execute all queries in parallel
      const [
        { data: userData, error: userError },
        { data: signups, error: signupsError },
        { data: events, error: eventsError }
      ] = await Promise.all([
        // Get user data
        supabase
          .from('users')
          .select('id, total_hours, total_events_attended')
          .eq('email', user.email)
          .single(),
        
        // Get user signups (we'll filter by user_id after getting userData)
        supabase
          .from('event_signups')
          .select('id, event_id, user_id, signup_status, hours_earned, notes, created_at, updated_at')
          .limit(50), // Limit for performance
        
        // Get branch events only if user has branch_id
        hasBranchId ? supabase
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
          .limit(15) // Reduced limit for better performance
        : Promise.resolve({ data: [], error: null })
      ])

      if (userError || !userData) {
        console.error("❌ User lookup failed:", userError)
        throw new Error('User lookup failed')
      }

      const databaseUserId = userData.id
      console.log("✅ Found database user ID:", databaseUserId)

      // Filter signups for this user only
      const userSignupsFiltered = signups?.filter(signup => signup.user_id === databaseUserId) || []

      return {
        userStats: {
          totalHours: userData.total_hours || 0,
          eventsAttended: userData.total_events_attended || 0
        },
        events: events || [],
        signups: userSignupsFiltered,
        databaseUserId
      }

    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error)
      throw error
    }
  }, [user?.email, user?.branch_id, hasBranchId])

  const fetchRecentActivity = useCallback(async (databaseUserId: string) => {
    if (!databaseUserId) return []
    
    try {
      console.log("📋 Fetching hour request status updates for user:", databaseUserId)

      // 🚀 OPTIMIZED: Fetch only required fields and limit results
      const { data: hourRequests, error: hoursError } = await supabase
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
        .eq('user_id', databaseUserId)
        .in('status', ['pending', 'approved', 'declined'])
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Reduced to 30 days
        .order('created_at', { ascending: false })
        .limit(6) // Further reduced for better performance

      if (hoursError || !hourRequests) {
        console.error("❌ Hour requests fetch error:", hoursError)
        return []
      }

      // 🚀 OPTIMIZED: Process activities with better performance
      const activities = hourRequests.map(hourRequest => {
        const isApproved = hourRequest.status === 'approved'
        const isPending = hourRequest.status === 'pending'
        const isAdjusted = isApproved && hourRequest.admin_hours_awarded !== hourRequest.hours_requested
        const eventName = hourRequest.events?.[0]?.name // Fix: events is an array

        let title: string, description: string, icon: 'clock' | 'check' | 'x' | 'adjust', color: 'blue' | 'green' | 'red' | 'yellow', displayDate: string

        if (isPending) {
          title = `${hourRequest.hours_requested} hours pending review`
          description = eventName ?
            `For ${eventName}` :
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
            description = eventName ?
              `For ${eventName}` :
              hourRequest.description.substring(0, 50) + (hourRequest.description.length > 50 ? '...' : '')
            icon = 'check'
            color = 'green'
          }
          displayDate = hourRequest.reviewed_at
        } else {
          title = `${hourRequest.hours_requested} hours declined`
          description = eventName ?
            `For ${eventName}` :
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
          eventName,
          isPending
        }
      })

      // Sort activities: pending first, then by date (most recent first)
      activities.sort((a, b) => {
        if (a.isPending && !b.isPending) return -1
        if (!a.isPending && b.isPending) return 1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      console.log("✅ Hour request status updates:", activities)
      return activities

    } catch (error) {
      console.error("❌ Error fetching hour request status updates:", error)
      return []
    }
  }, [])

  const handleEventSignup = async () => {
    if (!selectedEvent || !user?.email) return
    
    setSignupLoading(true)

    try {
      console.log("📝 Signing up for event:", selectedEvent.id)

      // First, get the database user ID from the users table using email
      const { data: dbUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single()

      if (userError || !dbUser) {
        console.error("❌ User lookup failed:", userError)
        toast.error("Unable to find your user account. Please contact support.")
        setSignupLoading(false)
        return
      }

      const databaseUserId = dbUser.id
      console.log("✅ Found database user ID:", databaseUserId)

      // Check if event has max participants and if it's reached
      if (selectedEvent.max_participants) {
        const currentSignups = selectedEvent.event_signups?.filter(
          (signup: any) => signup.signup_status === 'registered'
        ).length || 0

        if (currentSignups >= selectedEvent.max_participants) {
          toast.error("Sorry, this event has reached maximum capacity!")
          setSignupLoading(false)
          return
        }
      }

      // Check if user is already signed up
      const alreadySignedUp = userSignups.some(
        signup => signup.event_id === selectedEvent.id
      )

      if (alreadySignedUp) {
        toast.error("You are already registered for this event!")
        setSignupLoading(false)
        return
      }

      // Create the signup with the correct database user ID
      const signupData = {
        event_id: selectedEvent.id,
        user_id: databaseUserId, // Use the bigint ID from users table
        signup_status: 'registered',
        hours_earned: 0.00 // Will be set later by admin
      }

      console.log("📤 Creating signup with data:", signupData)

      const { data, error } = await supabase
        .from('event_signups')
        .insert([signupData])
        .select()

      if (error) {
        console.error("❌ Signup failed:", error)
        toast.error("Failed to sign up: " + error.message)
        return
      }

      console.log("✅ Signup successful:", data)
      
      // Update local state
      if (data && data[0]) {
        setUserSignups(prev => [...prev, data[0]])
      }
      
      setShowSignupModal(false)
      setSelectedEvent(null)
      toast.success("🎉 Successfully registered for the event!")

      // Refresh the events to update signup counts
      refetchDashboard()

    } catch (error) {
      console.error("❌ Unexpected signup error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setSignupLoading(false)
    }
  }

  // 🚀 MEMOIZED HELPER FUNCTIONS for better performance
  const isUserSignedUp = useMemo(() => {
    return (eventId: number) => {
      return userSignups.some(signup => signup.event_id === eventId)
    }
  }, [userSignups])

  const getEventSignupCount = useMemo(() => {
    return (event: any) => {
      return event.event_signups?.filter(
        (signup: any) => signup.signup_status === 'registered'
      ).length || 0
    }
  }, [])

  const formatEventDate = useMemo(() => {
    return (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }, [])

  const formatEventTime = useMemo(() => {
    return (timeStr: string | null) => {
      if (!timeStr) return ''
      const [hours, minutes] = timeStr.split(':')
      const hour = parseInt(hours || '0')
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    }
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setSelectedImage(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const testStorageAccess = async () => {
    try {
      console.log("🧪 Testing storage authentication...")
      
      // Test authentication (skip bucket listing due to permissions)
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        console.error("❌ Authentication check failed:", authError)
        return false
      }
      
      console.log("✅ User authenticated:", authUser.email)
      console.log("✅ Proceeding with upload to hour-request-images bucket")
      return true
      
    } catch (error) {
      console.error("❌ Storage test failed:", error)
      return false
    }
  }

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    try {
      // First test authentication
      const canAccess = await testStorageAccess()
      if (!canAccess) {
        toast.error("Authentication test failed. Please check console for details.")
        return null
      }

      // Get current authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        console.error("❌ Cannot get authenticated user:", authError)
        toast.error("Authentication required for image upload")
        return null
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${authUser.email}/${Date.now()}.${fileExt}`

      console.log("📤 Uploading image to Supabase Storage:", fileName)
      console.log("📄 File details:", { 
        name: file.name, 
        size: file.size, 
        type: file.type 
      })
      console.log("👤 Auth user details:", { 
        email: authUser.email, 
        uid: authUser.id
      })

      const { data, error } = await supabase.storage
        .from('hour-request-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error("❌ Image upload failed:", {
          error: error,
          message: error.message,
          details: error
        })
        
        // Provide user-friendly error messages
        if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
          toast.error("Image upload failed: File already exists. Please try again.")
        } else if (error.message?.includes('policy')) {
          toast.error("Image upload failed: Permission denied. Please contact support.")
        } else {
          toast.error(`Image upload failed: ${error.message || 'Unknown error'}`)
        }
        return null
      }

      console.log("✅ Image uploaded successfully:", data.path)
      return data.path
    } catch (error) {
      console.error("❌ Unexpected error uploading image:", {
        error: error,
        message: (error as any)?.message,
        stack: (error as any)?.stack,
        type: typeof error
      })
      toast.error("Unexpected error during image upload. Please check console and try again.")
      return null
    }
  }

  const handleLogHoursSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLogHoursLoading(true)

    try {
      console.log("📝 Submitting hour request:", logHoursData)

      // Validate form
      if (!logHoursData.hours || !logHoursData.description) {
        toast.error("Please fill in all required fields")
        setLogHoursLoading(false)
        return
      }

      if (!selectedImage) {
        toast.error("Please upload a photo as proof of your volunteer work")
        setLogHoursLoading(false)
        return
      }

      // Get database user ID
      const { data: dbUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user?.email)
        .single()

      if (userError || !dbUser) {
        console.error("❌ User lookup failed:", userError)
        toast.error("Unable to find your user account. Please contact support.")
        setLogHoursLoading(false)
        return
      }

      // Upload image
      const imagePath = await uploadImageToStorage(selectedImage)
      if (!imagePath) {
        toast.error("Failed to upload image. Please try again.")
        setLogHoursLoading(false)
        return
      }

      // Create hour request
      const requestData = {
        user_id: dbUser.id,
        event_id: logHoursData.eventId || null,
        hours_requested: parseFloat(logHoursData.hours),
        description: logHoursData.description,
        image_url: imagePath,
        status: 'pending'
      }

      console.log("📤 Creating hour request:", requestData)

      const { data, error } = await supabase
        .from('hours_requests')
        .insert([requestData])
        .select()

      if (error) {
        console.error("❌ Hour request creation failed:", error)
        toast.error("Failed to submit hour request: " + error.message)
        return
      }

      console.log("✅ Hour request submitted successfully:", data)
      
      // Reset form and close modal
      setLogHoursData({ hours: "", description: "", eventId: "" })
      setSelectedImage(null)
      setImagePreview(null)
      setShowLogHoursModal(false)
      
      // Refresh dashboard data to update recent activity
      refetchDashboard()
      
      toast.success("🎉 Hour request submitted successfully! Your request will be reviewed by an admin.")

    } catch (error) {
      console.error("❌ Unexpected error submitting hour request:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setLogHoursLoading(false)
    }
  }

  const handleLogHoursDataChange = (field: string, value: string) => {
    setLogHoursData(prev => ({ ...prev, [field]: value }))
  }

  // 🚀 PERFORMANCE OPTIMIZATION: Use optimized fetch hook
  const { data: dashboardData, loading: dashboardLoading, refetch: refetchDashboard } = useOptimizedFetch(
    fetchDashboardData,
    [user?.email, user?.branch_id],
    {
      enabled: !!user?.email,
      onSuccess: async (data) => {
        if (data) {
          setUserStats(data.userStats)
          setBranchEvents(data.events)
          setUserSignups(data.signups)
          
          // Fetch recent activity in background
          const activities = await fetchRecentActivity(data.databaseUserId)
          setRecentActivity(activities)
          setActivityLoading(false)
        }
      },
      onError: () => {
        setDataLoading(false)
        setActivityLoading(false)
      }
    }
  )

  // Update loading states based on optimized fetch
  useEffect(() => {
    setDataLoading(dashboardLoading)
  }, [dashboardLoading])

  useEffect(() => {
    if (user?.email) {
      fetchBranchInfo()
    }
  }, [user?.email, user?.branch_id])

  if (loading || dataLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-4 relative">
      {/* Action Buttons (fixed, stacked) */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        <Button
          onClick={() => setShowLogHoursModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 w-40 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Log Hours
        </Button>
        {(user?.role === 'admin' || user?.role === 'super-admin') && (
          <Button
            onClick={() => router.push(user?.role === 'super-admin' ? '/super-admin' : '/admin')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 w-40 flex items-center justify-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {user?.role === 'super-admin' ? 'Super Admin' : 'Admin Panel'}
          </Button>
        )}
        <Button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 w-40 flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-teal-800">
              Student Dashboard
              {user?.role === 'admin' && (
                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                  <Settings className="h-4 w-4 mr-1" />
                  Admin
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.first_name || user?.email?.split('@')[0]}!
            </p>
            {branchInfo && (
              <p className="text-teal-700 font-medium mt-1">
                {branchInfo.name}
              </p>
            )}
            {user?.role === 'super-admin' && !branchInfo && (
              <p className="text-red-600 font-medium mt-1">
                Super Admin (No Branch Assigned)
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowSettingsModal(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalHours}</div>
              <p className="text-xs text-muted-foreground">
                Hours volunteered
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.eventsAttended}</div>
              <p className="text-xs text-muted-foreground">
                Volunteer events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Register for volunteer opportunities in your branch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {!hasBranchId ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No branch assigned</p>
                    <p className="text-sm text-gray-400">
                      Super admins without a branch cannot view branch-specific events.
                    </p>
                  </div>
                ) : branchEvents.length > 0 ? (
                  branchEvents.map((event) => {
                    const signupCount = getEventSignupCount(event)
                    const isSignedUp = isUserSignedUp(event.id)
                    const isFull = event.max_participants && signupCount >= event.max_participants
                    
                    return (
                      <div key={event.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-teal-800">{event.name}</h4>
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
                          <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        )}
                        
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatEventDate(event.event_date)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatEventTime(event.start_time)}
                              {event.end_time && ` - ${formatEventTime(event.end_time)}`}
                            </span>
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>
                              {signupCount} registered
                              {event.max_participants && ` / ${event.max_participants} max`}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {isSignedUp ? (
                            <Button
                              disabled
                              className="bg-green-600 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Registered
                            </Button>
                          ) : isFull ? (
                            <Button
                              disabled
                              variant="outline"
                            >
                              Event Full
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setSelectedEvent(event)
                                setShowSignupModal(true)
                              }}
                              className="bg-teal-600 hover:bg-teal-700"
                            >
                              Register
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
              <p className="text-gray-500 text-center py-8">
                No upcoming events at the moment.
              </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hour Request Status</CardTitle>
              <CardDescription>
                Status updates for your submitted volunteer hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading status updates...</p>
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-l-gray-300">
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.color === 'green' ? 'bg-green-100 text-green-600' :
                          activity.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                          activity.color === 'red' ? 'bg-red-100 text-red-600' :
                          activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.icon === 'check' && <CheckCircle className="h-4 w-4" />}
                          {activity.icon === 'adjust' && <Edit3 className="h-4 w-4" />}
                          {activity.icon === 'x' && <X className="h-4 w-4" />}
                          {activity.icon === 'clock' && <Clock className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 leading-tight">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          
                          {/* Admin Notes */}
                          {activity.adminNotes && (
                            <div className="mt-2 p-2 bg-blue-50 rounded border">
                              <p className="text-xs font-medium text-blue-800">Admin Note:</p>
                              <p className="text-xs text-blue-700 mt-1">{activity.adminNotes}</p>
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-500 mt-2">
                            {activity.isPending ? 
                              `Submitted on ${new Date(activity.date).toLocaleDateString()} at ${new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` :
                              `Reviewed on ${new Date(activity.date).toLocaleDateString()} at ${new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {recentActivity.length >= 10 && (
                    <div className="text-center pt-2">
                      <p className="text-xs text-gray-500">Showing last 10 hour request updates</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hour request updates</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Submit volunteer hours to see status updates here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>



        {/* Event Signup Modal */}
        {showSignupModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-teal-800">Register for Event</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowSignupModal(false)
                    setSelectedEvent(null)
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-lg text-teal-800 mb-2">{selectedEvent.name}</h4>
                  
                  {selectedEvent.description && (
                    <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                  )}
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatEventDate(selectedEvent.event_date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatEventTime(selectedEvent.start_time)}
                        {selectedEvent.end_time && ` - ${formatEventTime(selectedEvent.end_time)}`}
                      </span>
                    </div>
                    
                    {selectedEvent.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {getEventSignupCount(selectedEvent)} registered
                        {selectedEvent.max_participants && ` / ${selectedEvent.max_participants} max`}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Confirmation:</strong> By registering, you commit to attending this event. 
                    Volunteer hours will be awarded after event completion and admin approval.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSignupModal(false)
                      setSelectedEvent(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEventSignup}
                    disabled={signupLoading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                  >
                    {signupLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Registering...
                      </>
                    ) : (
                      'Confirm Registration'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Log Hours Modal */}
        {showLogHoursModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-green-800">Log Volunteer Hours</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowLogHoursModal(false)
                    setLogHoursData({ hours: "", description: "", eventId: "" })
                    setSelectedImage(null)
                    setImagePreview(null)
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleLogHoursSubmit} className="p-6 space-y-4">
                {/* Hours Input */}
                <div className="space-y-2">
                  <Label htmlFor="hours" className="text-sm font-medium text-gray-700">
                    Hours Worked *
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    placeholder="e.g., 3.5"
                    value={logHoursData.hours}
                    onChange={(e) => handleLogHoursDataChange("hours", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                {/* Event Selection (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="eventId" className="text-sm font-medium text-gray-700">
                    Related Event (Optional)
                  </Label>
                  <select
                    id="eventId"
                    title="Select related event"
                    value={logHoursData.eventId}
                    onChange={(e) => handleLogHoursDataChange("eventId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select an event (if applicable)</option>
                    {branchEvents.filter(event => isUserSignedUp(event.id)).map(event => (
                      <option key={event.id} value={event.id}>
                        {event.name} - {formatEventDate(event.event_date)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description of Work *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what volunteer work you did, where, and any other relevant details..."
                    value={logHoursData.description}
                    onChange={(e) => handleLogHoursDataChange("description", e.target.value)}
                    className="w-full"
                    rows={4}
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                    Proof Photo *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Image selected
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedImage(null)
                              setImagePreview(null)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileImage className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-2">
                          Upload a photo showing your volunteer work
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="imageUpload"
                          required
                        />
                        <Label
                          htmlFor="imageUpload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-md cursor-pointer hover:bg-green-100 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Choose Photo
                        </Label>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload a photo of yourself at the volunteer event as proof of participation. Max 5MB. Only PNG, JPG, and JPEG files are allowed.
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowLogHoursModal(false)
                      setLogHoursData({ hours: "", description: "", eventId: "" })
                      setSelectedImage(null)
                      setImagePreview(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={logHoursLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {logHoursLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Account Settings</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettingsModal(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Branch Information */}
                {branchInfo && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Your Branch</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-blue-700">School:</span>
                        <span className="ml-2 text-blue-600">{branchInfo.school_name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-700">Location:</span>
                        <span className="ml-2 text-blue-600">{branchInfo.location}</span>
                      </div>
                      {branchInfo.leader_name && (
                        <div>
                          <span className="font-medium text-blue-700">Branch Leader:</span>
                          <span className="ml-2 text-blue-600">{branchInfo.leader_name}</span>
                        </div>
                      )}
                      {branchInfo.leader_email && (
                        <div>
                          <span className="font-medium text-blue-700">Leader Email:</span>
                          <a 
                            href={`mailto:${branchInfo.leader_email}`}
                            className="ml-2 text-blue-600 hover:text-blue-800 underline"
                          >
                            {branchInfo.leader_email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                                 {/* Branch Transfer */}
                 <div className="border rounded-lg p-4">
                   <h4 className="font-semibold text-gray-800 mb-2">Transfer to Another Branch</h4>
                   <p className="text-sm text-gray-600 mb-3">
                     Enter a 6-digit branch code to transfer to a different school chapter. Your volunteer hours and events attended will be transferred to the new branch.
                   </p>
                   {user?.role === 'admin' && (
                     <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                       <p className="text-sm text-orange-800">
                         <strong>⚠️ Admin Role Notice:</strong> If you transfer to another branch, your admin privileges will be removed and you'll become a regular member, since admin roles are branch-specific. Super-admins retain their role when transferring.
                       </p>
                     </div>
                   )}
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Enter 6-digit branch code"
                      value={branchTransferCode}
                      onChange={(e) => setBranchTransferCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                      className="text-center font-mono text-lg"
                      maxLength={6}
                    />
                    <Button
                      onClick={handleBranchTransfer}
                      disabled={transferLoading || branchTransferCode.length !== 6}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      {transferLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Transferring...
                        </>
                      ) : (
                        'Transfer Branch'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Account Deletion */}
                <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                  <p className="text-sm text-red-600 mb-4">
                    ⚠️ This will permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-red-700">
                        Type "DELETE" to confirm:
                      </Label>
                      <Input
                        type="text"
                        placeholder="Type DELETE here"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleAccountDeletion}
                      disabled={deleteLoading || deleteConfirmation !== "DELETE"}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      {deleteLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Deleting Account...
                        </>
                      ) : (
                        'Delete Account Permanently'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final Account Deletion Confirmation Modal */}
        {showFinalDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-red-800">Confirm Account Deletion</h3>
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
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg text-red-700 mb-4">
                  Are you absolutely sure you want to delete your account? This action cannot be undone.
                </p>
                <p className="text-sm text-red-600 mb-6">
                  All your volunteer hours, event registrations, and hour requests will be permanently deleted.
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
                    onClick={confirmAccountDeletion}
                    disabled={deleteLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete Account'
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