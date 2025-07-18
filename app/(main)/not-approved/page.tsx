import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle } from "lucide-react"

export default function NotApprovedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20" />
            </div>
          </div>
        </div>

        {/* Status Card */}
        <Card className="border-2 border-yellow-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-orange-800 flex items-center justify-center gap-2">
              <Clock className="h-6 w-6" />
              Account Under Review
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your registration is being processed
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-yellow-600">
              <CheckCircle className="h-12 w-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Thanks for joining Hands of Hope!
            </h3>
            <p className="text-gray-600">
              Your account has been created successfully. Your branch leader will review and approve your registration soon.
            </p>
            <p className="text-sm text-gray-500">
              You'll receive an email notification once your account is approved and you can start volunteering!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 