"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import toast, { Toaster } from 'react-hot-toast'

function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we have a valid password reset session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Session check error:", error)
          setIsValidSession(false)
          setIsCheckingSession(false)
          return
        }

        // Check if this is a password recovery session
        if (session && session.user) {
          setIsValidSession(true)
        } else {
          setIsValidSession(false)
        }
      } catch (error) {
        console.error("Unexpected error checking session:", error)
        setIsValidSession(false)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number")
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match")
        setIsLoading(false)
        return
      }

      // Validate password strength
      const passwordErrors = validatePassword(newPassword)
      if (passwordErrors.length > 0) {
        toast.error(passwordErrors[0])
        setIsLoading(false)
        return
      }

      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        console.error("Password update error:", error)
        toast.error("Failed to update password: " + error.message)
        setIsLoading(false)
        return
      }

      // Success
      toast.success("Password updated successfully! Redirecting to login...")
      
      // Sign out to ensure fresh login
      await supabase.auth.signOut()
      
      // Redirect to login page after a delay
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error) {
      console.error("Unexpected error updating password:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <Card className="border-2 border-red-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl text-red-800 flex items-center justify-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Invalid Reset Link
              </CardTitle>
              <CardDescription className="text-gray-600">
                This password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                The password reset link you used is either invalid, expired, or has already been used.
              </p>
              <div className="space-y-2">
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800">
                    Back to Login
                  </Button>
                </Link>
                <p className="text-sm text-gray-500">
                  Need a new reset link?{" "}
                  <Link href="/login" className="text-teal-600 hover:underline">
                    Request another one
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500/20 to-yellow-500/20" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-teal-800">
            Reset Password
          </h1>
          <p className="text-gray-600 mt-2">
            Create a new password for your <span className="text-yellow-600 font-semibold">Hands of Hope</span> account
          </p>
        </div>

        {/* Reset Password Card */}
        <Card className="border-2 border-teal-100 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-teal-800 flex items-center justify-center gap-2">
              <Lock className="h-6 w-6" />
              New Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-teal-700 font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20 pr-10"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-teal-700 font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <p className="text-sm font-medium text-teal-800 mb-2">Password Requirements:</p>
                <ul className="text-xs text-teal-700 space-y-1">
                  <li className="flex items-center gap-2">
                    {newPassword.length >= 6 ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border-2 border-gray-400" />
                    )}
                    At least 6 characters
                  </li>
                  <li className="flex items-center gap-2">
                    {/[A-Z]/.test(newPassword) ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border-2 border-gray-400" />
                    )}
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    {/[a-z]/.test(newPassword) ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border-2 border-gray-400" />
                    )}
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    {/[0-9]/.test(newPassword) ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border-2 border-gray-400" />
                    )}
                    One number
                  </li>
                  <li className="flex items-center gap-2">
                    {newPassword === confirmPassword && newPassword.length > 0 ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border-2 border-gray-400" />
                    )}
                    Passwords match
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link 
              href="/login"
              className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

// Loading fallback component
function ResetPasswordLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500/20 to-yellow-500/20" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-teal-800">
            Loading...
          </h1>
        </div>
        <Card className="border-2 border-teal-100 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
} 