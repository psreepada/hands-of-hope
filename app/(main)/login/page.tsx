"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, LogIn, Loader2, X, Mail } from "lucide-react"
import { useState } from "react"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import toast, { Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Forgot Password State
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isResetLoading, setIsResetLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Use auth redirect hook
  useAuthRedirect()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsResetLoading(true)

    try {
      // Validate email format
      if (!resetEmail || !resetEmail.includes('@')) {
        toast.error("Please enter a valid email address")
        setIsResetLoading(false)
        return
      }

      // Check if user exists in our database first
      const { data: userExists, error: userCheckError } = await supabase
        .from('users')
        .select('email')
        .eq('email', resetEmail)
        .single()

      if (userCheckError && userCheckError.code !== 'PGRST116') {
        console.error("Error checking user:", userCheckError)
        toast.error("Error checking email. Please try again.")
        setIsResetLoading(false)
        return
      }

      if (!userExists) {
        toast.error("No account found with this email address")
        setIsResetLoading(false)
        return
      }

      // Send password reset email using Supabase Auth
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error("Password reset error:", error)
        toast.error("Failed to send reset email: " + error.message)
        setIsResetLoading(false)
        return
      }

      // Success
      toast.success("Password reset email sent! Please check your inbox and spam folder.")
      setShowForgotPasswordModal(false)
      setResetEmail("")

    } catch (error) {
      console.error("Unexpected error during password reset:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsResetLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Sign in with Supabase Auth (matching Vite project pattern)
      const { data: signInData, error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (loginError || !signInData.user) {
        toast.error(loginError?.message || "Login failed")
        setIsLoading(false)
        return
      }

      // Check if user exists in your users table and get role
      const { data: userRow, error: fetchError } = await supabase
        .from("users")
        .select("role, id")
        .eq("email", email)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // Not found is ok
        toast.error("Error fetching user profile")
        setIsLoading(false)
        return
      }

      if (!userRow) {
        toast.error("User profile not found. Please contact support.")
        setIsLoading(false)
        return
      }

      // Always redirect to dashboard first, then user can choose admin portal if needed
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
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
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to your <span className="text-yellow-600 font-semibold">Hands of Hope</span> account
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-2 border-teal-100 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-teal-800 flex items-center justify-center gap-2">
              <LogIn className="h-6 w-6" />
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-teal-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-teal-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-sm text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link 
              href="/signup"
              className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-teal-800 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Reset Password
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowForgotPasswordModal(false)
                    setResetEmail("")
                  }}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail" className="text-teal-700 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                      required
                      disabled={isResetLoading}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForgotPasswordModal(false)
                        setResetEmail("")
                      }}
                      className="flex-1"
                      disabled={isResetLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isResetLoading || !resetEmail}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
                    >
                      {isResetLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Reset Email
                        </>
                      )}
                    </Button>
                  </div>
                </form>
                
                <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-sm text-teal-700">
                    <strong>Note:</strong> The reset link will be valid for 1 hour. If you don't receive the email, please check your spam folder.
                  </p>
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