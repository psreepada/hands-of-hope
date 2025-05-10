"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Users, Calendar, Award, DollarSign, MapPin } from "lucide-react"
import ImpactCounter from "@/components/impact-counter"
import TestimonialSlider from "@/components/testimonial-slider"
import { useDonationModal } from "@/components/DonationModalProvider"
import SponsorCarousel from "@/components/sponsor-carousel"
import Link from "next/link"

export default function Home() {
  const { open } = useDonationModal()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/80 z-10" />
        <div className="relative h-[600px] w-full">
          <Image
            src="/images/pic4.jpg"
            alt="Volunteers helping in the community"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/logo.png"
                  alt="Hands of Hope Logo"
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                <span className="text-yellow-400">Hands</span> of <span className="text-yellow-400">Hope</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                Empowering the homeless through compassion and community action
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                >
                  <Link href="/donate">
                  Donate Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800">Our Mission</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
            At Hands of Hope, we strive to provide high school students with the opportunity to empower the homeless and the people in need through dedicated in-person volunteer efforts, fundraisers, and kit-packing events sponsered by our organization, as well as rewarding them with an awards ceremony to recognize their efforts.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="container px-4 md:px-6"> 
          <h2 className="text-3xl font-bold tracking-tight text-center text-teal-800 mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ImpactCounter number={5000} label="Meals Served" icon={<Heart className="h-8 w-8 text-teal-600" />} />
            <ImpactCounter number={1200} label="Volunteer Hours" icon={<Users className="h-8 w-8 text-teal-600" />} />
            <ImpactCounter number={4000} label="Money Raised" icon={<DollarSign className="h-8 w-8 text-teal-600" />} />
          </div>
        </div>
      </section>

      {/* Ways to Help */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center text-teal-800 mb-12">Join Us For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Volunteer Hours</h3>
              <p className="text-gray-600">
                Join our team of dedicated volunteers making a difference in the community.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">PVSA Awards</h3>
              <p className="text-gray-600">Earn recognition for your commitment to community service.</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Helping the Community</h3>
              <p className="text-gray-600">Participate in outreach programs that directly impact those in need.</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Convenient Volunteering</h3>
              <p className="text-gray-600">Find flexible opportunities that fit your schedule and location.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="max-w-3xl mx-auto text-center mb-12 px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Our Partners</h2>
          <p className="text-lg text-gray-600">
            We are proud to work with these amazing organizations and schools to make a difference in our community.
          </p>
        </div>
        <div className="w-full">
          <SponsorCarousel />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-teal-800 text-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Voices of Hope</h2>
          <TestimonialSlider />
        </div>
      </section>
    </div>
  )
}
