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
            <ImpactCounter number={8000} label="Money Raised" icon={<DollarSign className="h-8 w-8 text-teal-600" />} />
          </div>
        </div>
      </section>

      {/* Ways to Help */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center text-teal-800 mb-12">Join Us For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* PVSA Awards Section */}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                  Official Recognition
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-teal-800">
                Earn the Prestigious <span className="text-yellow-600">Presidential Volunteer Service Award</span>
              </h2>
            </div>

            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-xl border border-teal-100 shadow-sm">
                  <h3 className="text-xl font-bold text-teal-800 mb-4">About the PVSA</h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    Hands of Hope is proud to be a certifying organization for the Presidential Volunteer Service Award (PVSA). This prestigious national honor recognizes your commitment to community service and can be a valuable addition to college applications and resumes.
                  </p>
                  <div className="bg-teal-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-teal-800 mb-3">Award Requirements</h4>
                    <p className="text-gray-600 mb-4">
                      The Presidential Volunteer Service Award has different hour requirements based on age groups, ranging from 26 hours for younger volunteers to 500+ hours for adults. Contact us to learn more about the specific requirements for your age group.
                    </p>
                    <p className="text-sm text-gray-500">
                      * Lifetime Achievement Award requires 4,000+ hours of service for all age groups
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/pvsa.jpg"
                    alt="Presidential Volunteer Service Award"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-sm font-medium">Official PVSA Certifying Organization</p>
                    <p className="text-2xl font-bold mt-1">Recognized by the White House</p>
                  </div>
                </div>
                <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                  <Link href="https://presidentialserviceawards.gov/" target="_blank" rel="noopener noreferrer">
                    Learn More About PVSA
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-16 bg-yellow-50">
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
