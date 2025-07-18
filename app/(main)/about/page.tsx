"use client";

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Award, Users, School, Calendar } from "lucide-react"
import Link from "next/link"
import { useDonationModal } from "@/components/DonationModalProvider"

export default function AboutPage() {
  const { open } = useDonationModal()

  return (
    <div className="flex min-h-screen flex-col">
      {}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/80 z-10" />
        <div className="relative h-[400px] w-full">
          <Image
            src="/images/ABOUTBANNER.png"
            alt="Hands of Hope volunteers working together"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                About <span className="text-yellow-400">Hands of Hope</span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                A student-led movement dedicated to empowering youth through service and making a lasting impact on our
                homeless community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">What We Do</h2>
            <p className="text-lg text-gray-600">
              Hands of Hope is a 501(c)(3) nonprofit fiscally sponsored by Hack Club. We are a student-led organization
              focused on supporting the homeless community through in-person volunteer efforts, fundraising, and
              expanding our reach through partnerships with high schools.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">In-Person Volunteering</h3>
              <p className="text-gray-600">
                We organize regular volunteer opportunities at local shelters and community centers to provide direct
                support to those in need.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">School Partnerships</h3>
              <p className="text-gray-600">
                We establish branches in high schools to engage more students and create a network of young volunteers
                committed to making a difference.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Fundraising</h3>
              <p className="text-gray-600">
                We host fundraisers to support homeless shelters with essential supplies and fund our year-end
                kit-packing initiative for low-income students.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {}
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

      {}
      <section className="py-16 bg-teal-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center gap-8 max-w-5xl mx-auto">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="relative h-[350px] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="/images/a.jpg"
                  alt="Hands of Hope Vision"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Our Vision</h2>
              <p className="text-xl leading-relaxed">
                Hands of Hope envisions a future where high school students are empowered through community engagement and
                volunteerism to support the homeless, foster compassion, and make a lasting impact on the well-being and
                educational success of those in need.
              </p>
              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                  onClick={open}
                >
                  Contribute to Our Cause
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">For Our Students</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Students can join our non-profit through their school's branch. If your school doesn't have a branch,
                  fill out the form below, and we'll help start one!
                </p>
                <p className="text-gray-600">
                  Members earn volunteer hours, PVSAs, and a digitally signed PDF from our co-founders verifying their
                  contributions and hours.
                </p>
                <div className="pt-4">
                  <Button
                    asChild
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSf7Kl3uHIIFvfP00m5X4P_2ia6K2FWAWH3GLV4mMe46ksxoKw/viewform?usp=header"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Start a Branch
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[550px] rounded-lg overflow-hidden">
              <Image
                src="/images/kit.jpg"
                alt="Students volunteering together"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden order-2 md:order-1">
              <Image
                src="/images/3.jpg"
                alt="Volunteers packing kits for students"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2 text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Kits and Events</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We host two annual fundraisers to support homeless shelters with essentials and fund a year-end
                  kit-packing event, where volunteers assemble school supply kits for low-income students.
                </p>
                <p className="text-gray-600">
                  The event ends with an award ceremony celebrating their dedication and recognizing outstanding
                  volunteers for their service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-yellow-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800">Ready to Make a Difference?</h2>
            <p className="text-lg text-gray-700">
              Join Hands of Hope today and be part of a movement that's changing lives through compassion and service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
                <Link href="/donate">
                  Donate
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
