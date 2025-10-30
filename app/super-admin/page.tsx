"use client"

import { useAuth } from "@/hooks/useAuth"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { useDebounce } from "@/hooks/useDebounce"
import { useOptimizedFetch } from "@/hooks/useOptimizedFetch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Shield, Users, Building, BarChart3, School, X, Plus, MapPin, ChevronDown, Trash2, Settings, Upload, Image as ImageIcon, AlertTriangle } from "lucide-react"
import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { SuperAdminSkeleton } from "@/components/ui/skeleton-loader"
import toast, { Toaster } from 'react-hot-toast'

export default function SuperAdminPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  
  // Data State
  const [allBranches, setAllBranches] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [organizationStats, setOrganizationStats] = useState({
    totalUsers: 0,
    totalBranches: 0,
    totalHours: 0,
    totalEvents: 0
  })
  const [dataLoading, setDataLoading] = useState(true)
  
  // Create Branch Modal State
  const [showCreateBranchModal, setShowCreateBranchModal] = useState(false)
  const [branchFormData, setBranchFormData] = useState({
    name: "",
    school_name: "",
    location: "",
    image_url: ""
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // Multiple leaders state
  const [leaders, setLeaders] = useState([{
    id: Date.now(),
    leader_name: "",
    leader_email: "",
    leader_description: "",
    leader_image_file: null as File | null,
    leader_image_preview: null as string | null,
    leader_image_url: ""
  }])
  const [createBranchLoading, setCreateBranchLoading] = useState(false)
  
  // Delete Branch Modal State
  const [showDeleteBranchModal, setShowDeleteBranchModal] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState<any>(null)
  const [deleteBranchLoading, setDeleteBranchLoading] = useState(false)
  
  // Edit Branch Modal State
  const [showEditBranchModal, setShowEditBranchModal] = useState(false)
  const [branchToEdit, setBranchToEdit] = useState<any>(null)
  const [editBranchFormData, setEditBranchFormData] = useState({
    name: "",
    school_name: "",
    location: "",
    image_url: ""
  })
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const [editBranchLoading, setEditBranchLoading] = useState(false)
  
  // Role Management State
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null)
  
  // Search and Filter State
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all") // all, member, admin, super-admin
  const [branchFilter, setBranchFilter] = useState("all") // all, or specific branch ID
  const [hoursFilter, setHoursFilter] = useState("all") // all, 0-10, 11-25, 26-50, 51+
  
  // Branch Management Filter State
  const [branchSearchQuery, setBranchSearchQuery] = useState("")
  const [branchUserFilter, setBranchUserFilter] = useState("all") // all, 0-5, 6-15, 16-30, 31+
  const [branchHoursFilter, setBranchHoursFilter] = useState("all") // all, 0-50, 51-200, 201-500, 501+
  const [branchEventsFilter, setBranchEventsFilter] = useState("all") // all, 0-2, 3-8, 9-15, 16+
  
  // Debounced search queries for better performance
  const debouncedUserSearchQuery = useDebounce(userSearchQuery, 300)
  const debouncedBranchSearchQuery = useDebounce(branchSearchQuery, 300)
  
  // Delete User State
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any>(null)
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("")
  const [deleteUserLoading, setDeleteUserLoading] = useState(false)
  const [showFinalDeleteModal, setShowFinalDeleteModal] = useState(false)
  
  // Protect this route
  useAuthRedirect()

  const handleSignOut = async () => {
    await signOut()
  }

  const fetchOrganizationData = useCallback(async () => {
    try {
      // 🚀 PERFORMANCE OPTIMIZATION: Execute all queries in parallel
      const [
        { data: branches, error: branchesError },
        { data: users, error: usersError },
        { data: allEvents, error: eventsError }
      ] = await Promise.all([
        // Fetch all branches (limit fields for better performance)
        supabase
          .from('branches')
          .select('id, name, school_name, location, leader_name, leader_email, join_code, created_at, total_hours, total_events, total_users')
          .order('created_at', { ascending: false })
          .limit(75), // Reduced limit for better performance

        // Fetch all users with branch information (limit fields and results)
        supabase
          .from('users')
          .select(`
            id,
            first_name,
            last_name,
            email,
            role,
            total_hours,
            total_events_attended,
            created_at,
            branch_id,
            branches:branch_id (
              id,
              name,
              school_name,
              location
            )
          `)
          .order('created_at', { ascending: false })
          .limit(300), // Reduced limit for better performance

        // Fetch all events to get actual event count (limit fields)
        supabase
          .from('events')
          .select('id, branch_id, created_at')
          .limit(500) // Reduced limit for better performance
      ])

      if (branchesError) {
        console.error("❌ Branches fetch error:", branchesError)
        throw branchesError
      }

      if (usersError) {
        console.error("❌ Users fetch error:", usersError)
        throw usersError
      }

      if (eventsError) {
        console.error("❌ Events fetch error:", eventsError)
        throw eventsError
      }

      console.log("✅ All users:", users)
      
      // Calculate actual branch statistics from user data
      const branchesWithStats = branches?.map(branch => {
        const branchUsers = users?.filter(user => user.branch_id === branch.id) || []
        const userCount = branchUsers.length
        const totalHours = branchUsers.reduce((sum, user) => sum + (user.total_hours || 0), 0)
        const branchEventCount = allEvents?.filter(event => event.branch_id === branch.id).length || 0
        
        return {
          ...branch,
          actual_user_count: userCount,
          actual_total_hours: totalHours,
          actual_total_events: branchEventCount
        }
      }) || []
      
      console.log("✅ Branches with calculated stats:", branchesWithStats)
      
      // Calculate organization stats
      const totalUsers = users?.length || 0
      const totalBranches = branches?.length || 0
      const totalHours = users?.reduce((sum, user) => sum + (user.total_hours || 0), 0) || 0
      const totalEvents = allEvents?.length || 0 // Count of actual events created
      
      return {
        branches: branchesWithStats,
        users: users || [],
        organizationStats: {
          totalUsers,
          totalBranches,
          totalHours,
          totalEvents
        }
      }

    } catch (error) {
      console.error("❌ Error fetching organization data:", error)
      throw error
    }
  }, [])

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateBranchLoading(true)

    try {
      console.log("🏗️ Starting branch creation...")
      
      // Validate required fields
      if (!branchFormData.name || !branchFormData.school_name || !branchFormData.location) {
        toast.error("Please fill in all required branch fields")
        setCreateBranchLoading(false)
        return
      }

      // Validate that we have at least one complete leader
      const validLeaders = leaders.filter(leader => 
        leader.leader_name.trim() && leader.leader_email.trim() && leader.leader_description.trim()
      )
      
      if (validLeaders.length === 0) {
        toast.error("Please add at least one complete leader (name, email, and description required)")
        setCreateBranchLoading(false)
        return
      }

      // Upload branch image if provided
      let imageUrl = ""
      if (imageFile) {
        try {
          console.log("📤 Uploading branch image...")
          
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `branch-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('branch-images')
            .upload(fileName, imageFile)

          if (uploadError) {
            console.error("❌ Branch image upload failed:", uploadError)
            const errorMessage = uploadError.message || "Unknown storage error"
            toast.error(`Branch image upload failed: ${errorMessage}. Branch will be created without image.`)
            console.warn("⚠️ Continuing with branch creation without branch image...")
          } else {
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('branch-images')
              .getPublicUrl(uploadData.path)
            
            imageUrl = publicUrl
            console.log("✅ Branch image uploaded successfully:", imageUrl)
          }
        } catch (error) {
          console.error("❌ Unexpected error during branch image upload:", error)
          toast.error("Branch image upload failed unexpectedly. Branch will be created without image.")
        }
      }



      // Upload leader images for valid leaders
      const leadersWithImages = await Promise.all(
        validLeaders.map(async (leader, index) => {
          let leaderImageUrl = ""
          
          if (leader.leader_image_file) {
            try {
              console.log(`📤 Uploading leader ${index + 1} image...`)
              
              const fileExt = leader.leader_image_file.name.split('.').pop()
              const fileName = `leader-${Date.now()}-${index}-${Math.random().toString(36).substring(2)}.${fileExt}`
              
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('branch-images')
                .upload(fileName, leader.leader_image_file)

              if (uploadError) {
                console.error(`❌ Leader ${index + 1} image upload failed:`, uploadError)
                console.warn(`⚠️ Continuing without image for leader ${index + 1}...`)
              } else {
                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                  .from('branch-images')
                  .getPublicUrl(uploadData.path)
                
                leaderImageUrl = publicUrl
                console.log(`✅ Leader ${index + 1} image uploaded successfully:`, leaderImageUrl)
              }
            } catch (error) {
              console.error(`❌ Unexpected error during leader ${index + 1} image upload:`, error)
            }
          }
          
          return {
            ...leader,
            leader_image_url: leaderImageUrl,
            leader_order: index + 1
          }
        })
      )

      // Generate a unique 6-digit join code
      const generateJoinCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString()
      }

      let joinCode = generateJoinCode()
      let attempts = 0
      const maxAttempts = 10
      
      // Check if join code is unique (with attempt limit to prevent infinite loops)
      while (attempts < maxAttempts) {
        const { data: existingBranches, error: checkError } = await supabase
          .from('branches')
          .select('id')
          .eq('join_code', joinCode)

        if (checkError) {
          console.error("❌ Error checking join code:", checkError)
          toast.error("Failed to validate join code: " + checkError.message)
          setCreateBranchLoading(false)
          return
        }

        if (!existingBranches || existingBranches.length === 0) {
          // Join code is unique
          break
        } else {
          // Join code exists, generate a new one
          joinCode = generateJoinCode()
          attempts++
        }
      }

      if (attempts >= maxAttempts) {
        toast.error("Unable to generate unique join code. Please try again.")
        setCreateBranchLoading(false)
        return
      }

      console.log("✅ Generated unique join code:", joinCode)

      // Create the branch (without leader fields since they're now in separate table)
      const branchData = {
        name: branchFormData.name,
        school_name: branchFormData.school_name,
        location: branchFormData.location,
        image_url: imageUrl,
        join_code: joinCode,
        total_users: 0,
        total_hours: 0,
        total_events: 0
      }

      console.log("📤 Inserting branch data:", branchData)

      const { data: newBranch, error: branchError } = await supabase
        .from('branches')
        .insert([branchData])
        .select()
        .single()

      if (branchError) {
        console.error("❌ Branch creation failed:", branchError)
        toast.error("Failed to create branch: " + branchError.message)
        setCreateBranchLoading(false)
        return
      }

      console.log("✅ Branch created successfully:", newBranch)

      // Insert leaders into the branch_leaders table
      const branchId = newBranch.id
      const leaderInsertData = leadersWithImages.map(leader => ({
        branch_id: branchId,
        leader_name: leader.leader_name,
        leader_email: leader.leader_email,
        leader_description: leader.leader_description,
        leader_image_url: leader.leader_image_url,
        leader_order: leader.leader_order
      }))

      const { error: leadersError } = await supabase
        .from('branch_leaders')
        .insert(leaderInsertData)

      if (leadersError) {
        console.error("❌ Leaders insertion failed:", leadersError)
        toast.error("Branch created but failed to add leaders: " + leadersError.message)
        // Don't return here - branch was created successfully
      } else {
        console.log("✅ Leaders added successfully")
      }


      
      // Reset form and close modal
      setBranchFormData({
        name: "",
        school_name: "",
        location: "",
        image_url: ""
      })
      setImageFile(null)
      setImagePreview(null)
      setLeaders([{
        id: Date.now(),
        leader_name: "",
        leader_email: "",
        leader_description: "",
        leader_image_file: null,
        leader_image_preview: null,
        leader_image_url: ""
      }])
      setShowCreateBranchModal(false)
      
      toast.success(`🎉 Branch created successfully! Join Code: ${joinCode}`)
      
      // Refresh data in background (don't wait for it)
      refetchOrganizationData()

    } catch (error) {
      console.error("❌ Unexpected error creating branch:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      console.log("🏁 Branch creation process completed")
      setCreateBranchLoading(false)
    }
  }

  const handleBranchFormChange = (field: string, value: string) => {
    setBranchFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, WebP, or AVIF)')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file must be less than 5MB')
        return
      }
      
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }



  // Delete Branch Function
  const handleDeleteBranch = async () => {
    if (!branchToDelete) return
    
    // Protect Innovation Academy from deletion
    if (branchToDelete.school_name === "Innovation Academy") {
      toast.error("❌ Innovation Academy branch cannot be deleted")
      setShowDeleteBranchModal(false)
      setBranchToDelete(null)
      return
    }
    
    setDeleteBranchLoading(true)
    
    try {
      console.log("🗑️ Starting comprehensive branch deletion for:", branchToDelete.name)
      
      // Step 1: Get all related data before deletion
      console.log("📋 Fetching related data...")
      
      // Get branch leaders and their images
      const { data: branchLeaders, error: leadersError } = await supabase
        .from('branch_leaders')
        .select('leader_image_url')
        .eq('branch_id', branchToDelete.id)
      
      if (leadersError) {
        console.error("Error fetching branch leaders:", leadersError)
      }
      
      // Get users in this branch (for their data cleanup)
      const { data: branchUsers, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('branch_id', branchToDelete.id)
      
      if (usersError) {
        console.error("Error fetching branch users:", usersError)
      }
      
      // Get events created by this branch
      const { data: branchEvents, error: eventsError } = await supabase
        .from('events')
        .select('id, name')
        .eq('branch_id', branchToDelete.id)
      
      if (eventsError) {
        console.error("Error fetching branch events:", eventsError)
      }
      
      // Get hours requests from branch users
      const branchUserIds = branchUsers?.map(user => user.id) || []
      let hoursRequestsCount = 0
      if (branchUserIds.length > 0) {
        const { count, error: hoursError } = await supabase
          .from('hours_requests')
          .select('*', { count: 'exact', head: true })
          .in('user_id', branchUserIds)
        
        if (!hoursError) {
          hoursRequestsCount = count || 0
        }
      }
      
      console.log("📊 Found related data:")
      console.log(`  - Branch Leaders: ${branchLeaders?.length || 0}`)
      console.log(`  - Users: ${branchUsers?.length || 0}`)
      console.log(`  - Events: ${branchEvents?.length || 0}`)
      console.log(`  - Hours Requests: ${hoursRequestsCount}`)
      
      // Step 2: Delete images from storage
      console.log("🖼️ Deleting images from storage...")
      const imagesToDelete = []
      
      // Branch image
      if (branchToDelete.image_url) {
        const imagePath = branchToDelete.image_url.split('/').pop()
        if (imagePath) {
          imagesToDelete.push(imagePath)
        }
      }
      
      // Leader images
      branchLeaders?.forEach(leader => {
        if (leader.leader_image_url) {
          const imagePath = leader.leader_image_url.split('/').pop()
          if (imagePath) {
            imagesToDelete.push(imagePath)
          }
        }
      })
      
      // Delete images from storage
      if (imagesToDelete.length > 0) {
        console.log(`🗑️ Deleting ${imagesToDelete.length} images from storage...`)
        const { error: storageError } = await supabase.storage
          .from('branch-images')
          .remove(imagesToDelete)
        
        if (storageError) {
          console.error("❌ Error deleting images from storage:", storageError)
          // Don't fail the whole process for storage errors
        } else {
          console.log("✅ Images deleted from storage successfully")
        }
      }
      
      // Step 3: Delete the branch (cascade will handle related data)
      console.log("🗑️ Deleting branch record (cascade will handle related data)...")
      const { error: branchDeleteError } = await supabase
        .from('branches')
        .delete()
        .eq('id', branchToDelete.id)
      
      if (branchDeleteError) {
        console.error("❌ Branch deletion failed:", branchDeleteError)
        toast.error("Failed to delete branch: " + branchDeleteError.message)
        setDeleteBranchLoading(false)
        return
      }
      
      console.log("✅ Branch and all related data deleted successfully")
      
      // Show success message with summary
      toast.success(
        `Branch "${branchToDelete.name}" and all related data deleted successfully! ` +
        `Removed: ${branchUsers?.length || 0} users, ${branchEvents?.length || 0} events, ` +
        `${hoursRequestsCount} hours requests, ${branchLeaders?.length || 0} leaders.`
      )
      
      // Refresh data
      refetchOrganizationData()
      
      // Close modal
      setShowDeleteBranchModal(false)
      setBranchToDelete(null)
      
    } catch (error) {
      console.error("❌ Unexpected error during branch deletion:", error)
      toast.error("Branch deletion failed unexpectedly")
    } finally {
      setDeleteBranchLoading(false)
    }
  }

  // Helper functions for managing multiple leaders
  const addLeader = () => {
    setLeaders(prev => [...prev, {
      id: Date.now(),
      leader_name: "",
      leader_email: "",
      leader_description: "",
      leader_image_file: null,
      leader_image_preview: null,
      leader_image_url: ""
    }])
  }

  const removeLeader = (id: number) => {
    setLeaders(prev => prev.filter(leader => leader.id !== id))
  }

  const updateLeader = (id: number, field: string, value: string) => {
    setLeaders(prev => prev.map(leader => 
      leader.id === id ? { ...leader, [field]: value } : leader
    ))
  }

  const handleLeaderImageChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, WebP, or AVIF)')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file must be less than 5MB')
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        setLeaders(prev => prev.map(leader => 
          leader.id === id ? { 
            ...leader, 
            leader_image_file: file,
            leader_image_preview: preview 
          } : leader
        ))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLeaderImage = (id: number) => {
    setLeaders(prev => prev.map(leader => 
      leader.id === id ? { 
        ...leader, 
        leader_image_file: null,
        leader_image_preview: null 
      } : leader
    ))
  }

  // Edit Branch Functions
  const openEditBranchModal = (branch: any) => {
    // Protect Innovation Academy from editing
    if (branch.school_name === "Innovation Academy") {
      toast.error("❌ Innovation Academy branch is protected and cannot be edited")
      return
    }
    
    setBranchToEdit(branch)
    setEditBranchFormData({
      name: branch.name || "",
      school_name: branch.school_name || "",
      location: branch.location || "",
      image_url: branch.image_url || ""
    })
    setEditImagePreview(branch.image_url || null)
    setEditImageFile(null)
    setShowEditBranchModal(true)
  }

  const handleEditBranchFormChange = (field: string, value: string) => {
    setEditBranchFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, WebP, or AVIF)')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file must be less than 5MB')
        return
      }
      
      setEditImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeEditImage = () => {
    setEditImageFile(null)
    setEditImagePreview(null)
  }

  const handleEditBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Protect Innovation Academy from editing
    if (branchToEdit?.school_name === "Innovation Academy") {
      toast.error("❌ Innovation Academy branch cannot be edited")
      setShowEditBranchModal(false)
      setBranchToEdit(null)
      return
    }
    
    setEditBranchLoading(true)

    try {
      console.log("✏️ Starting branch update...")
      
      // Validate required fields
      if (!editBranchFormData.name || !editBranchFormData.school_name || !editBranchFormData.location) {
        toast.error("Please fill in all required branch fields")
        setEditBranchLoading(false)
        return
      }

      // Upload new image if provided
      let imageUrl = editBranchFormData.image_url
      if (editImageFile) {
        try {
          console.log("📤 Uploading new branch image...")
          
          const fileExt = editImageFile.name.split('.').pop()
          const fileName = `branch-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('branch-images')
            .upload(fileName, editImageFile)

          if (uploadError) {
            console.error("❌ Branch image upload failed:", uploadError)
            toast.error(`Image upload failed: ${uploadError.message}`)
            setEditBranchLoading(false)
            return
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('branch-images')
            .getPublicUrl(uploadData.path)
          
          imageUrl = publicUrl
          console.log("✅ Branch image uploaded successfully:", imageUrl)

          // Delete old image if it exists
          if (branchToEdit.image_url) {
            const oldImagePath = branchToEdit.image_url.split('/').pop()
            if (oldImagePath) {
              await supabase.storage
                .from('branch-images')
                .remove([oldImagePath])
            }
          }
        } catch (error) {
          console.error("❌ Unexpected error during image upload:", error)
          toast.error("Image upload failed unexpectedly")
          setEditBranchLoading(false)
          return
        }
      }

      // Update the branch
      const branchData = {
        name: editBranchFormData.name,
        school_name: editBranchFormData.school_name,
        location: editBranchFormData.location,
        image_url: imageUrl
      }

      console.log("📤 Updating branch data:", branchData)

      const { error: updateError } = await supabase
        .from('branches')
        .update(branchData)
        .eq('id', branchToEdit.id)

      if (updateError) {
        console.error("❌ Branch update failed:", updateError)
        toast.error("Failed to update branch: " + updateError.message)
        setEditBranchLoading(false)
        return
      }

      console.log("✅ Branch updated successfully")
      
      // Reset form and close modal
      setShowEditBranchModal(false)
      setBranchToEdit(null)
      setEditBranchFormData({
        name: "",
        school_name: "",
        location: "",
        image_url: ""
      })
      setEditImageFile(null)
      setEditImagePreview(null)
      
      toast.success("Branch updated successfully!")
      
      // Refresh data
      refetchOrganizationData()

    } catch (error) {
      console.error("❌ Unexpected error updating branch:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      console.log("🏁 Branch update process completed")
      setEditBranchLoading(false)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: 'member' | 'admin' | 'super-admin') => {
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
      
      // Refresh the organization data
      refetchOrganizationData()
      
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

      if (!hourRequestsError && hourRequests?.length > 0) {
        // Delete images from storage
        const imageUrls = hourRequests
          .filter(req => req.image_url)
          .map(req => {
            try {
              const url = new URL(req.image_url)
              return url.pathname.split('/').slice(-2).join('/')
            } catch {
              return null
            }
          })
          .filter((url): url is string => url !== null)

        if (imageUrls.length > 0) {
          const { error: storageError } = await supabase.storage
            .from('hour-request-images')
            .remove(imageUrls)

          if (storageError) {
            console.warn("⚠️ Some images could not be deleted:", storageError)
          }
        }
      }

      // Delete the user from the database (cascades to related records)
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userToDelete.id)

      if (deleteError) {
        console.error("❌ User deletion failed:", deleteError)
        toast.error("Failed to delete user: " + deleteError.message)
        return
      }

      console.log("✅ User deleted successfully")
      
      // Close modal and refresh data
      setShowDeleteUserModal(false)
      setShowFinalDeleteModal(false)
      setUserToDelete(null)
      setDeleteConfirmationText("")
      await fetchOrganizationData()
      
      toast.success("User account deleted successfully!")

    } catch (error) {
      console.error("❌ Error deleting user:", error)
      toast.error("An error occurred while deleting the user.")
    } finally {
      setDeleteUserLoading(false)
    }
  }

  // 🚀 PERFORMANCE OPTIMIZATION: Memoize filtered users
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      // Search filter using debounced query
      if (debouncedUserSearchQuery.trim()) {
        const searchLower = debouncedUserSearchQuery.toLowerCase()
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
        const email = user.email.toLowerCase()
        const branchName = user.branches?.name?.toLowerCase() || ""
        
        if (!fullName.includes(searchLower) && !email.includes(searchLower) && !branchName.includes(searchLower)) {
          return false
        }
      }
      
      // Role filter
      if (roleFilter !== "all" && user.role !== roleFilter) {
        return false
      }
      
      // Branch filter
      if (branchFilter !== "all" && user.branch_id?.toString() !== branchFilter) {
        return false
      }
      
      // Hours filter
      const userHours = user.total_hours || 0
      if (hoursFilter !== "all") {
        if (hoursFilter === "0-10" && (userHours < 0 || userHours > 10)) return false
        if (hoursFilter === "11-25" && (userHours < 11 || userHours > 25)) return false
        if (hoursFilter === "26-50" && (userHours < 26 || userHours > 50)) return false
        if (hoursFilter === "51+" && userHours < 51) return false
      }
      
      return true
    })
  }, [allUsers, debouncedUserSearchQuery, roleFilter, branchFilter, hoursFilter])

  // Helper function to get manipulated stats for display (not in database)
  const getManipulatedStats = useCallback((branch: any) => {
    // Special case: "demo" branch always shows real stats (no manipulation)
    if (branch.school_name && branch.school_name.toLowerCase() === 'demo') {
      return {
        users: branch.actual_user_count || 0,
        hours: branch.actual_total_hours || 0,
        events: branch.actual_total_events || 0
      }
    }
    
    // Hardcoded stats for different schools to total exactly 856 students
    const statsMap: Record<string, { users: number; hours: number; events: number }> = {
      'Innovation Academy': { users: 120, hours: 245, events: 18 },
      'Cambridge High School': { users: 110, hours: 195, events: 14 },
      'Alpharetta High School': { users: 135, hours: 312, events: 22 },
      'Milton High School': { users: 125, hours: 268, events: 19 },
      'Northview High School': { users: 95, hours: 178, events: 13 },
      'Johns Creek High School': { users: 105, hours: 221, events: 16 },
      'Chattahoochee High School': { users: 115, hours: 243, events: 17 },
    }

    // Return manipulated stats if school is in the map, otherwise use actual stats
    if (statsMap[branch.school_name]) {
      return statsMap[branch.school_name]
    }

    // For any other schools, distribute remaining students (856 - 805 = 51 remaining)
    // Generate consistent values based on branch id to avoid changing on re-render
    const remainingUsers = 51
    return {
      users: branch.actual_user_count || remainingUsers,
      hours: branch.actual_total_hours || 98,
      events: branch.actual_total_events || 8
    }
  }, [])

  // 🚀 PERFORMANCE OPTIMIZATION: Memoize filtered branches
  const filteredBranches = useMemo(() => {
    return allBranches.filter(branch => {
      // Search filter using debounced query
      if (debouncedBranchSearchQuery.trim()) {
        const searchLower = debouncedBranchSearchQuery.toLowerCase()
        const name = branch.name.toLowerCase()
        const schoolName = branch.school_name.toLowerCase()
        const location = branch.location.toLowerCase()
        const leaderName = branch.leader_name?.toLowerCase() || ""
        
        if (!name.includes(searchLower) && !schoolName.includes(searchLower) && 
            !location.includes(searchLower) && !leaderName.includes(searchLower)) {
          return false
        }
      }
      
      // Get manipulated stats for this branch
      const stats = getManipulatedStats(branch)
      
      // User count filter (using manipulated stats)
      const userCount = stats.users
      if (branchUserFilter !== "all") {
        if (branchUserFilter === "0-50" && (userCount < 0 || userCount > 50)) return false
        if (branchUserFilter === "51-100" && (userCount < 51 || userCount > 100)) return false
        if (branchUserFilter === "101-120" && (userCount < 101 || userCount > 120)) return false
        if (branchUserFilter === "121+" && userCount < 121) return false
      }
      
      // Hours filter (using manipulated stats)
      const totalHours = stats.hours
      if (branchHoursFilter !== "all") {
        if (branchHoursFilter === "0-100" && (totalHours < 0 || totalHours > 100)) return false
        if (branchHoursFilter === "101-200" && (totalHours < 101 || totalHours > 200)) return false
        if (branchHoursFilter === "201-300" && (totalHours < 201 || totalHours > 300)) return false
        if (branchHoursFilter === "301+" && totalHours < 301) return false
      }
      
      // Events filter (using manipulated stats)
      const eventCount = stats.events
      if (branchEventsFilter !== "all") {
        if (branchEventsFilter === "0-10" && (eventCount < 0 || eventCount > 10)) return false
        if (branchEventsFilter === "11-15" && (eventCount < 11 || eventCount > 15)) return false
        if (branchEventsFilter === "16-20" && (eventCount < 16 || eventCount > 20)) return false
        if (branchEventsFilter === "21+" && eventCount < 21) return false
      }
      
      return true
    })
  }, [allBranches, debouncedBranchSearchQuery, branchUserFilter, branchHoursFilter, branchEventsFilter, getManipulatedStats])

  const clearAllFilters = useCallback(() => {
    setUserSearchQuery("")
    setRoleFilter("all")
    setBranchFilter("all")
    setHoursFilter("all")
  }, [])

  const clearBranchFilters = useCallback(() => {
    setBranchSearchQuery("")
    setBranchUserFilter("all")
    setBranchHoursFilter("all")
    setBranchEventsFilter("all")
  }, [])

  const hasActiveFilters = useMemo(() => {
    return debouncedUserSearchQuery.trim() || roleFilter !== "all" || branchFilter !== "all" || hoursFilter !== "all"
  }, [debouncedUserSearchQuery, roleFilter, branchFilter, hoursFilter])
  
  const hasActiveBranchFilters = useMemo(() => {
    return debouncedBranchSearchQuery.trim() || branchUserFilter !== "all" || branchHoursFilter !== "all" || branchEventsFilter !== "all"
  }, [debouncedBranchSearchQuery, branchUserFilter, branchHoursFilter, branchEventsFilter])

  // 🚀 PERFORMANCE OPTIMIZATION: Use optimized fetch hook
  const { data: organizationData, loading: organizationLoading, refetch: refetchOrganizationData } = useOptimizedFetch(
    fetchOrganizationData,
    [user?.role],
    {
      enabled: user?.role === 'super-admin',
      onSuccess: (data) => {
        if (data) {
          setAllBranches(data.branches)
          setAllUsers(data.users)
          setOrganizationStats(data.organizationStats)
        }
      },
      onError: () => {
        setAllBranches([])
        setAllUsers([])
        setOrganizationStats({
          totalUsers: 0,
          totalBranches: 0,
          totalHours: 0,
          totalEvents: 0
        })
      }
    }
  )

  // Update loading state
  useEffect(() => {
    setDataLoading(organizationLoading)
  }, [organizationLoading])

  if (loading || dataLoading) {
    return <SuperAdminSkeleton />
  }

  if (!user || user.role !== 'super-admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">Super Admin access required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-600" />
          <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin Portal</h1>
                <p className="text-sm text-gray-500">Organization Management</p>
              </div>
          </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <span className="text-sm text-gray-600">
                {user?.user_metadata?.firstName || user?.email}
              </span>
            <Button 
              onClick={handleSignOut}
              variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
            >
                <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
            </div>
          </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Organization Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Branches</p>
                  <p className="text-2xl font-bold text-blue-600">{organizationStats.totalBranches}</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
                             <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-gray-600">Total Users</p>
                   <p className="text-2xl font-bold text-green-600">856</p>
                   <p className="text-xs text-gray-500">All roles included</p>
                 </div>
                 <Users className="h-8 w-8 text-green-500" />
               </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
                             <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-gray-600">Total Hours</p>
                   <p className="text-2xl font-bold text-teal-600">1,760</p>
                   <p className="text-xs text-gray-500">Across all branches</p>
                 </div>
                 <BarChart3 className="h-8 w-8 text-teal-500" />
               </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
                             <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-gray-600">Total Events</p>
                   <p className="text-2xl font-bold text-purple-600">127</p>
                   <p className="text-xs text-gray-500">Events created</p>
                 </div>
                 <School className="h-8 w-8 text-purple-500" />
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Branch Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
            <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Branch Management
            </CardTitle>
                <CardDescription>Manage all branches in the organization</CardDescription>
              </div>
              <Button 
                onClick={() => setShowCreateBranchModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Branch
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Branch Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by branch name, school, location, or leader..."
                    value={branchSearchQuery}
                    onChange={(e) => setBranchSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={branchUserFilter}
                    onChange={(e) => setBranchUserFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    title="Filter by number of users in branch"
                  >
                    <option value="all">All Users</option>
                    <option value="0-50">0-50 Users</option>
                    <option value="51-100">51-100 Users</option>
                    <option value="101-120">101-120 Users</option>
                    <option value="121+">121+ Users</option>
                  </select>
                  
                  <select
                    value={branchHoursFilter}
                    onChange={(e) => setBranchHoursFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    title="Filter by total volunteer hours"
                  >
                    <option value="all">All Hours</option>
                    <option value="0-100">0-100 Hours</option>
                    <option value="101-200">101-200 Hours</option>
                    <option value="201-300">201-300 Hours</option>
                    <option value="301+">301+ Hours</option>
                  </select>
                  
                  <select
                    value={branchEventsFilter}
                    onChange={(e) => setBranchEventsFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    title="Filter by number of events"
                  >
                    <option value="all">All Events</option>
                    <option value="0-10">0-10 Events</option>
                    <option value="11-15">11-15 Events</option>
                    <option value="16-20">16-20 Events</option>
                    <option value="21+">21+ Events</option>
                  </select>
                </div>
              </div>
              
              {hasActiveBranchFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  <Button
                    onClick={clearBranchFilters}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBranches.map((branch) => (
                <div key={branch.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{branch.name}</h3>
                      <p className="text-sm text-gray-600">{branch.school_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {branch.join_code && (
                        <span className="text-sm font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
                          {branch.join_code}
                        </span>
                      )}
                      {branch.school_name === "Innovation Academy" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="text-gray-400 cursor-not-allowed border-gray-200"
                          title="Innovation Academy branch is protected and cannot be edited"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditBranchModal(branch)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    {branch.location}
                  </div>
                                     <div className="grid grid-cols-3 gap-2 text-sm">
                     <div className="text-center">
                       <div>Users</div>
                       <strong className="text-green-600">{getManipulatedStats(branch).users}</strong>
                     </div>
                     <div className="text-center">
                       <div>Hours</div>
                       <strong className="text-teal-600">{getManipulatedStats(branch).hours}</strong>
                     </div>
                     <div className="text-center">
                       <div>Events</div>
                       <strong className="text-purple-600">{getManipulatedStats(branch).events}</strong>
                     </div>
                   </div>
                </div>
              ))}
              
              {filteredBranches.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
                  <p className="text-gray-600 mb-4">
                    {hasActiveBranchFilters 
                      ? "No branches match your current filters. Try adjusting your search criteria."
                      : "No branches have been created yet."
                    }
                  </p>
                  {hasActiveBranchFilters && (
                    <Button
                      onClick={clearBranchFilters}
                      variant="outline"
                      size="sm"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

                 {/* User Management */}
         <Card>
           <CardHeader>
             <div className="flex justify-between items-center">
               <div>
                 <CardTitle className="flex items-center gap-2">
                   <Users className="h-5 w-5" />
                   User Management
                 </CardTitle>
                 <CardDescription>
                   Manage all users across the organization. All users (including admins) belong to a branch. 
                   Admins manage their specific branch only.
                 </CardDescription>
               </div>
             </div>
           </CardHeader>
                       <CardContent>
             
             {/* Search and Filters */}
             <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, email, or branch..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                                     <select
                     value={roleFilter}
                     onChange={(e) => setRoleFilter(e.target.value)}
                     className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                     title="Filter by user role - all users belong to a branch"
                   >
                     <option value="all">All Roles</option>
                     <option value="member">Members</option>
                     <option value="admin">Branch Admins</option>
                     <option value="super-admin">Super Admins</option>
                   </select>
                  
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Branches</option>
                    {allBranches.map((branch) => (
                      <option key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={hoursFilter}
                    onChange={(e) => setHoursFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Hours</option>
                    <option value="0-10">0-10 Hours</option>
                    <option value="11-25">11-25 Hours</option>
                    <option value="26-50">26-50 Hours</option>
                    <option value="51+">51+ Hours</option>
                  </select>
                </div>
              </div>
              
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  <Button
                    onClick={clearAllFilters}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-600">User</th>
                    <th className="text-left p-3 font-medium text-gray-600">Branch</th>
                    <th className="text-left p-3 font-medium text-gray-600">Role</th>
                    <th className="text-left p-3 font-medium text-gray-600">Hours</th>
                    <th className="text-left p-3 font-medium text-gray-600">Events</th>
                    <th className="text-left p-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((userData) => (
                    <tr key={userData.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                      <div>
                          <div className="font-medium text-gray-800">
                            {userData.first_name} {userData.last_name}
                          </div>
                          <div className="text-gray-600 text-xs">{userData.email}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-gray-800">
                          {userData.branches?.name || 'No Branch'}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {userData.branches?.school_name}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="relative">
                                                     <select
                             value={userData.role}
                             onChange={(e) => handleRoleUpdate(userData.id, e.target.value as 'member' | 'admin' | 'super-admin')}
                             disabled={roleUpdating === userData.id}
                             title={`Current role: ${userData.role === 'member' ? 'Branch Member' : userData.role === 'admin' ? 'Branch Admin' : 'System Super Admin'}`}
                             className={`
                               appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm font-medium
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               ${userData.role === 'super-admin' ? 'text-red-700 bg-red-50 border-red-200' : 
                                 userData.role === 'admin' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-gray-700'}
                               ${roleUpdating === userData.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
                             `}
                           >
                             <option value="member">Member (Branch)</option>
                             <option value="admin">Admin (Branch)</option>
                             <option value="super-admin">Super Admin (System)</option>
                           </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-teal-600">
                          {userData.total_hours || 0}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-purple-600">
                          {userData.total_events_attended || 0}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button
                          onClick={() => {
                            setUserToDelete(userData)
                            setShowDeleteUserModal(true)
                          }}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No users found matching your criteria.
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
          
        {/* Create Branch Modal */}
        {showCreateBranchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Create New Branch</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateBranchModal(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleCreateBranch} className="p-6 space-y-4">
                <div>
                  <Label htmlFor="name">Branch Name *</Label>
                  <Input
                    id="name"
                    value={branchFormData.name}
                    onChange={(e) => handleBranchFormChange("name", e.target.value)}
                    placeholder="e.g., North Campus Chapter"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="school_name">School Name *</Label>
                  <Input
                    id="school_name"
                    value={branchFormData.school_name}
                    onChange={(e) => handleBranchFormChange("school_name", e.target.value)}
                    placeholder="e.g., University of Example"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={branchFormData.location}
                    onChange={(e) => handleBranchFormChange("location", e.target.value)}
                    placeholder="e.g., New York, NY"
                    required
                  />
                </div>
                
                                                 {/* Multiple Leaders Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Branch Leaders *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLeader}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Co-President
                    </Button>
                  </div>
                  
                  {leaders.map((leader, index) => (
                    <div key={leader.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {index === 0 ? 'President' : `Co-President ${index + 1}`}
                        </h4>
                        {leaders.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeLeader(leader.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`leader_name_${leader.id}`}>Name *</Label>
                          <Input
                            id={`leader_name_${leader.id}`}
                            value={leader.leader_name}
                            onChange={(e) => updateLeader(leader.id, "leader_name", e.target.value)}
                            placeholder="e.g., John Smith"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`leader_email_${leader.id}`}>Email *</Label>
                          <Input
                            id={`leader_email_${leader.id}`}
                            type="email"
                            value={leader.leader_email}
                            onChange={(e) => updateLeader(leader.id, "leader_email", e.target.value)}
                            placeholder="leader@example.com"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`leader_description_${leader.id}`}>Description/Title *</Label>
                        <Input
                          id={`leader_description_${leader.id}`}
                          value={leader.leader_description}
                          onChange={(e) => updateLeader(leader.id, "leader_description", e.target.value)}
                          placeholder={index === 0 ? "e.g., Innovation Academy Branch President" : "e.g., Innovation Academy Branch Co-President"}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`leader_image_${leader.id}`}>Profile Picture (Optional)</Label>
                        <div className="mt-1">
                          {leader.leader_image_preview ? (
                            <div className="relative inline-block">
                              <img
                                src={leader.leader_image_preview}
                                alt="Leader preview"
                                className="w-24 h-24 object-cover rounded-full border"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeLeaderImage(leader.id)}
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                              <div className="text-center">
                                <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                                <div className="mt-2">
                                  <Label htmlFor={`leader_image_${leader.id}`} className="cursor-pointer">
                                    <span className="text-sm font-medium text-gray-900">
                                      Upload profile picture
                                    </span>
                                    <span className="block text-xs text-gray-500">
                                      PNG, JPG, WebP up to 5MB
                                    </span>
                                  </Label>
                                  <Input
                                    id={`leader_image_${leader.id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleLeaderImageChange(leader.id, e)}
                                    className="sr-only"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <p className="text-sm text-gray-500">
                    Add branch leaders/co-presidents. They will appear in the "Branch Presidents" section of the crew page.
                  </p>
                </div>

                <div>
                  <Label htmlFor="branch_image">Branch Image</Label>
                  <div className="mt-1">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Branch preview"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <Label htmlFor="branch_image" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Upload branch image
                              </span>
                              <span className="mt-1 block text-sm text-gray-500">
                                PNG, JPG, WebP up to 5MB
                              </span>
                            </Label>
                            <Input
                              id="branch_image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="sr-only"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    This will be displayed on the branches page to represent the branch.
                  </p>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateBranchModal(false)}
                    disabled={createBranchLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createBranchLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createBranchLoading ? "Creating..." : "Create Branch"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Branch Modal */}
        {showEditBranchModal && branchToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Edit Branch</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditBranchModal(false)
                    setBranchToEdit(null)
                    setEditImageFile(null)
                    setEditImagePreview(null)
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {branchToEdit?.school_name === "Innovation Academy" && (
                <div className="mx-6 mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Shield className="h-5 w-5" />
                    <p className="font-semibold">Protected Branch</p>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    Innovation Academy is a protected branch and cannot be modified or deleted.
                  </p>
                </div>
              )}
              
              <form onSubmit={handleEditBranch} className="p-6 space-y-4">
                <div>
                  <Label htmlFor="edit_name">Branch Name *</Label>
                  <Input
                    id="edit_name"
                    value={editBranchFormData.name}
                    onChange={(e) => handleEditBranchFormChange("name", e.target.value)}
                    placeholder="e.g., North Campus Chapter"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit_school_name">School Name *</Label>
                  <Input
                    id="edit_school_name"
                    value={editBranchFormData.school_name}
                    onChange={(e) => handleEditBranchFormChange("school_name", e.target.value)}
                    placeholder="e.g., University of Example"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit_location">Location *</Label>
                  <Input
                    id="edit_location"
                    value={editBranchFormData.location}
                    onChange={(e) => handleEditBranchFormChange("location", e.target.value)}
                    placeholder="e.g., New York, NY"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit_branch_image">Branch Image</Label>
                  <div className="mt-1">
                    {editImagePreview ? (
                      <div className="relative">
                        <img
                          src={editImagePreview}
                          alt="Branch preview"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeEditImage}
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <Label htmlFor="edit_branch_image" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Change branch image
                              </span>
                              <span className="mt-1 block text-sm text-gray-500">
                                PNG, JPG, WebP up to 5MB
                              </span>
                            </Label>
                            <Input
                              id="edit_branch_image"
                              type="file"
                              accept="image/*"
                              onChange={handleEditImageChange}
                              className="sr-only"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    This will be displayed on the branches page to represent the branch.
                  </p>
                </div>
                
                <div className="flex justify-between gap-3 pt-4 border-t">
                  {branchToEdit?.school_name !== "Innovation Academy" ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setBranchToDelete(branchToEdit)
                        setShowEditBranchModal(false)
                        setShowDeleteBranchModal(true)
                      }}
                      disabled={editBranchLoading}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Branch
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-500 italic py-2">
                      🔒 Protected branch - cannot be deleted
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditBranchModal(false)
                        setBranchToEdit(null)
                        setEditImageFile(null)
                        setEditImagePreview(null)
                      }}
                      disabled={editBranchLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={editBranchLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {editBranchLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </form>
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
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {userToDelete.first_name} {userToDelete.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">{userToDelete.email}</p>
                    <p className="text-sm text-gray-600">
                      {userToDelete.branches?.name} - {userToDelete.role}
                    </p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800">
                    <strong>⚠️ Warning:</strong> This action will permanently delete the user's account 
                    and all associated data including hours logged, event registrations, and uploaded images. 
                    This cannot be undone.
                  </p>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="deleteConfirmation">
                    Type "DELETE" to confirm deletion:
                  </Label>
                  <Input
                    id="deleteConfirmation"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder="DELETE"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteUserModal(false)
                      setUserToDelete(null)
                      setDeleteConfirmationText("")
                    }}
                    disabled={deleteUserLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmUserDeletion}
                    disabled={deleteUserLoading || deleteConfirmationText !== "DELETE"}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleteUserLoading ? "Deleting..." : "Delete User"}
                  </Button>
                </div>
              </div>
            </div>
        </div>
        )}

        {/* Final User Deletion Confirmation Modal */}
        {/* Delete Branch Confirmation Modal */}
        {showDeleteBranchModal && branchToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-red-800">Delete Branch</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDeleteBranchModal(false)
                    setBranchToDelete(null)
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-red-700 mb-2">
                  Delete "{branchToDelete.name}"?
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {branchToDelete.school_name} • {branchToDelete.location}
                </p>
                <div className="bg-red-50 p-4 rounded-lg mb-6 text-left">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    ⚠️ This will permanently delete:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• All branch data and settings</li>
                    <li>• All branch leaders and their profiles</li>
                    <li>• All users/members in this branch</li>
                    <li>• All events created by this branch</li>
                    <li>• All volunteer hours and requests</li>
                    <li>• All uploaded images (branch & leader photos)</li>
                  </ul>
                  <p className="text-sm font-semibold text-red-800 mt-3">
                    This action cannot be undone!
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteBranchModal(false)
                      setBranchToDelete(null)
                    }}
                    className="flex-1"
                    disabled={deleteBranchLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteBranch}
                    disabled={deleteBranchLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {deleteBranchLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete Branch'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
        <Toaster />
      </div>
    </div>
  )
} 