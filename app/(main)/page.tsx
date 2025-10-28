"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Users, Calendar, Award, DollarSign, MapPin, School } from "lucide-react"
import ImpactCounter from "@/components/impact-counter"
import TestimonialSlider from "@/components/testimonial-slider"
import { useDonationModal } from "@/components/DonationModalProvider"
import SponsorCarousel from "@/components/sponsor-carousel"
import Link from "next/link"
import AnimatedCounter from "@/components/animated-counter"
import { useHomepageStats } from "@/hooks/useHomepageStats"

export default function Home() {
  const { open } = useDonationModal()
  const { data: stats, isLoading: statsLoading } = useHomepageStats()

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/80 z-10" />
        <div className="relative h-[600px] w-full">
          <Image
            src="/images/2.jpg"
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
                Uplifting both the homeless and high school students through compassion-driven service and united community action.
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

      <section className="py-16 bg-white relative overflow-hidden">
        {/* Remove decorative geometric elements */}
        
        <div className="container px-4 md:px-6 relative z-10">
          {/* Animated scroll-triggered heading */}
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-50/0 via-teal-50/80 to-teal-50/0 blur-xl transform scale-110" />
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 relative inline-block">
              <span className="relative inline-block">
                Our Mission
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 to-yellow-500 transform scale-x-100 origin-left transition-transform duration-1000"></span>
              </span>
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed relative">
              At Hands of Hope, we transform the compassion of high school students into meaningful action by connecting them directly with communities in need. Through hands-on volunteer work, creative fundraisers, and impactful kit-packing events, we empower youth to become leaders of change. To honor their dedication, we celebrate their contributions in an awards ceremony that shines a light on the meaningful work they have done.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="container px-4 md:px-6"> 
          <h2 className="text-3xl font-bold tracking-tight text-center text-teal-800 mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {statsLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <p className="mt-2 text-gray-600">Loading impact data...</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl border-2 border-teal-100 p-6 text-center shadow-md hover:shadow-lg transition-all">
              <div className="rounded-full bg-teal-50 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-teal-800 mb-1">Served</h3>
              <p className="text-3xl font-bold text-yellow-500 mb-2">
                <AnimatedCounter end={19000} />
              </p>
              <p className="text-lg text-gray-600">meals to those in need</p>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-teal-100 p-6 text-center shadow-md hover:shadow-lg transition-all">
              <div className="rounded-full bg-teal-50 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-teal-800 mb-1">Contributed</h3>
              <p className="text-3xl font-bold text-yellow-500 mb-2">
                <AnimatedCounter end={(1270)} />
              </p>
              <p className="text-lg text-gray-600">combined volunteer hours</p>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-teal-100 p-6 text-center shadow-md hover:shadow-lg transition-all">
              <div className="rounded-full bg-teal-50 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-teal-800 mb-1">Raised</h3>
              <p className="text-3xl font-bold text-yellow-500 mb-2">
                <AnimatedCounter end={9300} prefix="$" />
              </p>
              <p className="text-lg text-gray-600">for community support</p>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-teal-100 p-6 text-center shadow-md hover:shadow-lg transition-all">
              <div className="rounded-full bg-teal-50 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-teal-800 mb-1">Established</h3>
              <p className="text-3xl font-bold text-yellow-500 mb-2">
                <AnimatedCounter end={stats?.branchCount || 7} />
              </p>
              <p className="text-lg text-gray-600">school branches</p>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-teal-100 p-6 text-center shadow-md hover:shadow-lg transition-all">
              <div className="rounded-full bg-teal-50 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-teal-800 mb-1">United</h3>
              <p className="text-3xl font-bold text-yellow-500 mb-2">
                <AnimatedCounter end={856} />
              </p>
              <p className="text-lg text-gray-600">students across all branches</p>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-teal-100 p-6 text-center shadow-md hover:shadow-lg transition-all">
              <div className="rounded-full bg-teal-50 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-teal-800 mb-1">Partnered with</h3>
              <p className="text-3xl font-bold text-yellow-500 mb-2">
                <AnimatedCounter end={13} />
              </p>
              <p className="text-lg text-gray-600">shelter organizations</p>
            </div>
            </>
          )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Why you should join...</h2>
            <p className="text-lg text-gray-600">
              Hands of Hope enables high school students to make a meaningful difference in their communities while
              developing valuable skills and experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Support the Homeless</h3>
              <p className="text-gray-600">
                Provide direct assistance to homeless individuals through organized volunteer activities and donation
                drives.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Earn Volunteer Hours</h3>
              <p className="text-gray-600">
                Accumulate service hours that can be applied toward school requirements and college applications.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Join Fundraisers</h3>
              <p className="text-gray-600">
                Participate in fundraising events that directly benefit homeless shelters and support our initiatives.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <School className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Kit-Packing Initiative</h3>
              <p className="text-gray-600">
                Contribute to our year-end kit-packing event, fostering empathy, engagement, and social responsibility.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {}
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                  Official Recognition
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-teal-800">
                <span className="text-yellow-600">Presidential Volunteer Service Award</span> - Temporarily Paused
              </h2>
              <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg">
                <p className="text-lg text-yellow-800 font-medium">
                  Note: The PVSA program is currently paused as the new U.S. president has not yet reinitiated the program after taking office. We will update this section once the program resumes.
                </p>
              </div>
            </div>

            {}
            <div className="grid md:grid-cols-2 gap-8">
              {}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-xl border border-teal-100 shadow-sm">
                  <h3 className="text-xl font-bold text-teal-800 mb-4">About the PVSA</h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    Hands of Hope is proud to be a certifying organization for the Presidential Volunteer Service Award (PVSA). This prestigious national honor recognizes your commitment to community service and can be a valuable addition to college applications and resumes.
                  </p>
                  <div className="bg-teal-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-teal-800 mb-3">Award Requirements</h4>
                    <p className="text-gray-600 mb-4">
                      The Presidential Volunteer Service Award has different hour requirements based on age groups, ranging from 26 hours for younger volunteers to 500+ hours for adults. Click the following button to learn more about the specific requirements for your age group.
                    </p>
                    <p className="text-sm text-gray-500">
                      * Lifetime Achievement Award requires 4,000+ hours of service for all age groups
                    </p>
                  </div>
                </div>
              </div>

              {}
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

      {/* Jukebox Sponsorship Section */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-purple-100">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                  Proudly Sponsored By
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Side - Image */}
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/images/jukebox.jpg"
                  alt="Jukebox Print Organization"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Right Side - Content */}
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-purple-800">
                  <span className="text-purple-600">Jukebox Print</span> Organization
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Hands of Hope is proudly partnered with Jukebox Print, an organization that helps improve our marketing by being an amazing sticker producer. Their sponsorship helps us continue our mission of making a positive impact in our communities and outreaching across the globe.
                </p>
                <div>
                  <Button asChild className="bg-purple-600 hover:bg-purple-700">
                    <Link href="https://www.jukeboxprint.com/custom-stickers" target="_blank" rel="noopener noreferrer">
                      Custom Stickers
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
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

      {}
      <section className="py-16 bg-teal-800 text-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Voices of Hope</h2>
          <TestimonialSlider />
        </div>
      </section>
    </div>
  )
}
