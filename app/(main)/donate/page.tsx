"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Users, School, Award } from "lucide-react"

export default function DonatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/80 z-10" />
        <div className="relative h-[400px] w-full">
          <Image
            src="/images/donate.jpeg"
            alt="Hands of Hope volunteers making an impact"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                Make a <span className="text-yellow-400">Difference</span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Your donation directly supports our mission to empower youth and serve the homeless community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Your Impact</h2>
            <p className="text-lg text-gray-600">
              Every contribution helps us expand our reach and create more opportunities for students to make a difference.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Student Engagement</h3>
              <p className="text-gray-600">
                Support our efforts to engage more students in community service and leadership development.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Direct Support</h3>
              <p className="text-gray-600">
                Help us provide essential supplies and support to homeless shelters and those in need.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <School className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Educational Impact</h3>
              <p className="text-gray-600">
                Contribute to our school supply kit initiative for low-income students.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-teal-800">Why Donate?</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Your donation helps us maintain and expand our programs, reaching more students and making a greater impact in our community.
                </p>
                <p className="text-gray-600">
                  As a 501(c)(3) nonprofit fiscally sponsored by Hack Club, your contribution is tax-deductible and goes directly to supporting our initiatives.
                </p>
                <div className="pt-4">
                  <Card className="p-6 border-2 border-teal-200 bg-white">
                    <h3 className="text-xl font-bold text-teal-800 mb-3">What Your Donation Supports:</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-teal-600" />
                        <span>Student leadership development programs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-teal-600" />
                        <span>Essential supplies for homeless shelters</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <School className="h-5 w-5 text-teal-600" />
                        <span>School supply kits for students in need</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-teal-800 mb-6 text-center">Make Your Donation</h3>
              <div className="aspect-[4/3] w-full">
                <iframe
                  src="https://hcb.hackclub.com/donations/start/hands-of-hope"
                  className="w-full h-full border-0"
                  title="Donation Form"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 