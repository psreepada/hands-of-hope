import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Users, Calendar } from "lucide-react"
import BranchCard from "@/components/branch-card"

const branches = [
  {
    id: 1,
    name: "Innovation Academy",
    image: "/images/ia.jpg",
    phone: "(404)-877-8360",
    address: "125 Milton Ave, Alpharetta, GA 30009",
    email: "info@innovationacademy.edu",
    volunteers: 0,
    events: 0,
    meetingDay: "Monday",
    meetingTime: "3:00 PM",
    leadTitle: "Chapter President",
  },
  {
    id: 2,
    name: "Cambridge High School",
    image: "/images/cam.webp",
    phone: "(470)-753-1914",
    address: "2845 Bethany Bend, Milton, GA 30004",
    description:
      "The Los Angeles branch focuses on food distribution and resource connection for homeless individuals throughout the greater LA area.",
    leadName: "Sofia Rodriguez",
    email: "info@cambridgehs.edu",
    volunteers: 0,
    events: 0,
    meetingDay: "Tuesday",
    meetingTime: "4:00 PM",
    leadTitle: "Chapter President",
  },
  {
    id: 3,
    name: "Alpharetta High School",
    image: "/images/alpha.avif",
    phone: "(470)-546-0995",
    address: "3595 Webb Bridge Rd, Alpharetta, GA 30005",
    email: "info@alpharettahs.edu",
    volunteers: 0,
    events: 0,
    meetingDay: "Wednesday",
    meetingTime: "2:30 PM",
    leadTitle: "Chapter President",
  },
  {
    id: 4,
    name: "Chattahoochee High School",
    image: "/images/hooch.webp",
    phone: "(404)-877-8360",
    address: "5230 Taylor Rd, Johns Creek, GA 30022",
    email: "info@chattahoocheehs.edu",
    volunteers: 0,
    events: 0,
    meetingDay: "Thursday",
    meetingTime: "3:30 PM",
    leadTitle: "Chapter President",
  },
  {
    id: 5,
    name: "Milton High School",
    image: "/images/milton.jpg",
    phone: "TBA",
    address: "13025 Birmingham Hwy, Milton, GA 30004",
    email: "info@chattahoocheehs.edu",
    volunteers: 0,
    events: 0,
    meetingDay: "Thursday",
    meetingTime: "3:30 PM",
    leadTitle: "Chapter President",
  },
]

export default function BranchesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/80 z-10" />
        <div className="relative h-[300px] w-full">
          <Image
            src="/images/group_pic.jpg"
            alt="Hands of Hope branches across the country"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                Our <span className="text-yellow-400">Chapters</span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join one of our local chapters to make a difference in your community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Benefits */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Chapter Benefits</h2>
            <p className="text-lg text-gray-600">
              Being part of a Hands of Hope chapter offers numerous benefits for students and communities alike.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Community Impact</h3>
              <p className="text-gray-600">
                Make a tangible difference in your local community by directly supporting those experiencing
                homelessness.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Service Hours</h3>
              <p className="text-gray-600">
                Earn verified volunteer hours that can be applied toward school requirements and college applications.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
              <div className="rounded-full bg-teal-100 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-2">Leadership Skills</h3>
              <p className="text-gray-600">
                Develop valuable leadership, organizational, and communication skills through branch activities.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Start a Chapter */}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Start a Chapter</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Don't see a chapter in your area? We're always looking to expand our reach and impact. Starting a Hands
                  of Hope chapter at your school or in your community is easier than you think.
                </p>
                <p className="text-gray-600">
                  We provide all the resources, training, and support you need to get started. You'll join a network of
                  passionate student leaders making a real difference in their communities.
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
                      Start a Chapter
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/alt_food.jpeg"
                alt="Students starting a new branch"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Branches Overview */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Find Your Local Chapter</h2>
            <p className="text-lg text-gray-600">
              Hands of Hope has branches across the country, each working to address homelessness in their local
              communities. Find the branch nearest you to get involved.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
