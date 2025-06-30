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
import AnimatedCounter from "@/components/animated-counter"

export default function Home() {
  const { open } = useDonationModal()

  return (
    <div className="flex min-h-screen flex-col">
      {}
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
                Empowering the homeless and high school students at the same timethrough compassion and community action
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

      {}
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
              At Hands of Hope, we strive to provide high school students with the opportunity to empower the homeless and the people in need through dedicated in-person volunteer efforts, fundraisers, and kit-packing events sponsered by our organization, as well as rewarding them with an awards ceremony to recognize their efforts.
            </p>
          </div>
          
          {/* Journey timeline with integrated image */}
          <div className="relative">
            {/* Connecting timeline line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-teal-500 to-yellow-500 transform -translate-x-1/2 md:block hidden" />
            
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Image side with perspective tilt effect */}
              <div className="w-full md:w-1/2 md:pr-12 mb-8 md:mb-0 perspective-1000">
                <div className="relative h-[450px] w-full rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-teal-200/30 border-2 border-teal-100">
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/20 to-transparent z-10" />
                  <Image
                    src="/images/pic4.jpg"
                    alt="Hands of Hope First Meeting"
                    fill
                    className="object-cover"
                  />
                  {/* Image caption overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transform translate-y-full hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white/90 text-sm">Our founding members at the very first official meeting</p>
                  </div>
                </div>
              </div>
              
              {/* Content side with animated reveal */}
              <div className="w-full md:w-1/2 md:pl-12 relative">
                {/* Timeline node */}
                <div className="absolute left-0 top-0 w-4 h-4 bg-yellow-500 rounded-full transform -translate-x-1/2 md:block hidden" />
                
                <div className="bg-gradient-to-br from-teal-50 to-white p-6 md:p-8 rounded-xl border-2 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center relative overflow-hidden">
                  {/* Remove subtle animated background effect */}
                  
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-6">
                      <span className="relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-yellow-500">
                        Our First Meeting:
                      </span>
                    </h2>
                    <p className="text-xl text-gray-700 leading-relaxed mb-6">
                      Hands of Hope began humbly with a group of high school students aiming to make a difference in their communities. The picture to the left depicts our first official meeting as a group of passionate high school students working under Hands of Hope. Since our first meeting, Hands of Hope has enabled high school students around the globe to serve their communities by supporting and uplifting the homeless through impactful volunteering.
                    </p>
                    
                    {/* Visual stats indicator */}
                    <div className="mt-auto flex items-center text-sm text-teal-700 font-medium">
                      <span className="inline-block w-2 h-2 bg-teal-600 rounded-full mr-2"></span>
                      <span>Est. 2023</span>
                      <span className="mx-3">•</span>
                      <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      <span>18 founding members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="container px-4 md:px-6"> 
          <h2 className="text-3xl font-bold tracking-tight text-center text-teal-800 mb-12">Since Our First Meeting Hands of Hope Has...</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                <AnimatedCounter end={1270} />
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
                <AnimatedCounter end={7} />
              </p>
              <p className="text-lg text-gray-600">school branches</p>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-teal-100 p-6 text-center shadow-md hover:shadow-lg transition-all">
              <div className="rounded-full bg-teal-50 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-teal-800 mb-1">United</h3>
              <p className="text-3xl font-bold text-yellow-500 mb-2">
                <AnimatedCounter end={159} />
              </p>
              <p className="text-lg text-gray-600">members across all branches</p>
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
          </div>
        </div>
      </section>

      {}
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

      {}
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
                Earn the Prestigious <span className="text-yellow-600">Presidential Volunteer Service Award</span>
              </h2>
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
