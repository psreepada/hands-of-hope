"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Eye, EyeOff, UserPlus, GraduationCap, Loader2 } from "lucide-react"
import { useState } from "react"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import toast, { Toaster } from 'react-hot-toast'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    joinCode: "",
    password: "",
    confirmPassword: ""
  })

  const router = useRouter()
  
  // Use auth redirect hook
  useAuthRedirect()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log("🚀 Starting signup process with data:", {
      firstName: formData.firstName,
      lastName: formData.lastName, 
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      joinCode: formData.joinCode
    })

    // Validation - matching Vite project style
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (formData.joinCode.length !== 6) {
      toast.error("Branch join code must be 6 digits")
      setIsLoading(false)
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.dateOfBirth || !formData.password || !formData.joinCode) {
      toast.error("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    try {
      console.log("🔍 Checking if join code exists:", formData.joinCode)
      
      // First check if the join code exists
      const { data: branch, error: branchError } = await supabase
        .from('branches')
        .select('id, name, school_name')
        .eq('join_code', formData.joinCode)
        .single()

      if (branchError || !branch) {
        console.error("❌ Branch lookup failed:", branchError)
        toast.error("Invalid branch join code. Please check with your branch leader.")
        setIsLoading(false)
        return
      }

      console.log("✅ Found branch:", branch)

      // Sign up the user with Supabase Auth (no email confirmation needed)
      console.log("🔐 Creating Supabase Auth user...")
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (signUpError) {
        console.error("❌ Supabase Auth signup failed:", signUpError)
        toast.error(signUpError?.message || "Signup failed")
        setIsLoading(false)
        return
      }

      console.log("✅ Supabase Auth user created:", data.user?.id)

      // Insert user into your existing users table with your exact schema
      const insertPayload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password_hash: '', // Will be empty since we're using Supabase Auth
        date_of_birth: formData.dateOfBirth,
        role: 'member', // Default role as requested
        branch_id: branch.id
      }

      console.log("💾 Inserting user into database:", insertPayload)

      // Upsert to avoid duplicate rows (matching Vite project pattern)
      const { data: insertedUser, error: dbError } = await supabase
        .from("users")
        .upsert([insertPayload], { onConflict: "email" })
        .select()

      if (dbError) {
        console.error("❌ Database insertion failed:", dbError)
        toast.error("Database error: " + dbError.message)
        setIsLoading(false)
        return
      }

      toast.success(
        `Registration successful! 🎉\n\nWelcome to ${branch.school_name} - ${branch.name}!\n\nNow please confirm your email by clicking the link in the email we just sent you.`
      )
      router.push('/login')
    } catch (error) {
      console.error('❌ Unexpected signup error:', error)
      toast.error("An unexpected error occurred. Please check the console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gdaksh.JPEG"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/90 via-white/85 to-teal-50/90 z-10" />
      
      {/* Content */}
      <div className="w-full max-w-lg space-y-8 relative z-20">
        {/* Logo Section */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="Hands of Hope Logo"
                width={80}
                height={80}
                className="rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/20 to-teal-500/20" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-teal-800">
            Join Our Mission
          </h1>
          <p className="text-gray-600 mt-2">
            Create your <span className="text-yellow-600 font-semibold">Hands of Hope</span> account and start making a difference
          </p>
        </div>

        {/* Signup Card */}
        <Card className="border-2 border-yellow-100 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-teal-800 flex items-center justify-center gap-2">
              <UserPlus className="h-6 w-6" />
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Fill out the form below to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-teal-700 font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-teal-700 font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500/20"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-teal-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500/20"
                  required
                />
              </div>

              {/* Date of Birth and Join Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-teal-700 font-medium">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinCode" className="text-teal-700 font-medium">
                    Branch Join Code
                  </Label>
                  <Input
                    id="joinCode"
                    type="text"
                    placeholder="e.g., 123456"
                    value={formData.joinCode}
                    onChange={(e) => handleInputChange("joinCode", e.target.value.replace(/[^0-9]/g, ''))}
                    className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500/20 text-center text-lg font-mono tracking-wider"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    6-digit code from your branch leader to join your school chapter
                  </p>
                </div>
              </div>

              {/* Password Fields */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-teal-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500/20 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
            {/* Social Signup Buttons */}
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </p>

        </div>
      </div>
      <Toaster />
    </div>
  )
} 