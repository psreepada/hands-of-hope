import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Home } from "lucide-react"

export default function NotAllowedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20" />
            </div>
          </div>
        </div>

        {/* Status Card */}
        <Card className="border-2 border-red-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-red-800 flex items-center justify-center gap-2">
              <Lock className="h-6 w-6" />
              Access Restricted
            </CardTitle>
            <CardDescription className="text-gray-600">
              You need to be logged in to access this area
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-red-600">
              <Lock className="h-12 w-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Please Sign In
            </h3>
            <p className="text-gray-600">
              You need to be logged in with an approved account to access the dashboard.
            </p>
            
            <div className="space-y-3 pt-4">
              <Link href="/login">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Sign In
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 