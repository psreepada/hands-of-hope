import Image from "next/image"
import { Card } from "@/components/ui/card"

const crew = [
  {
    name: "Pranav Sreepada",
    position: "CTO",
    image: "/images/pranav.jpg",
  },
  {
    name: "Abhinav Lavu",
    position: "CFO",
    image: undefined,
  },
  {
    name: "Jeetu",
    position: "COO",
    image: "/images/jeetu.jpg",
  },
  {
    name: "Arthur",
    position: "CMO",
    image: "/images/arth.jpg",
  },
]

export default function CrewPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/80 z-10" />
        <div className="relative h-[300px] w-full">
        <Image src="/images/group_pic2.jpeg" alt="Our Crew" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                Our <span className="text-yellow-400">Crew</span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Meet the dedicated leaders behind Hands of Hope.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Meet the Founders</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2 border-teal-100 hover:border-teal-200 transition-colors">
              <div className="aspect-square relative overflow-hidden">
                <Image src="/images/daksh_prof.jpeg" alt="Daksh Shah" fill className="object-cover" style={{ objectPosition: '60% bottom', transform: 'scale(1.1)' }} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-2">Daksh Shah</h3>
                <p className="text-lg font-bold text-yellow-500 mb-3">Co-Founder</p>
                <p className="text-gray-600">
                  Daksh brings visionary ideas and fosters community connections. His passion for social impact drives
                  Hands of Hope's innovative approach to serving the homeless community.
                </p>
              </div>
            </Card>
            <Card className="overflow-hidden border-2 border-teal-100 hover:border-teal-200 transition-colors">
              <div className="aspect-square relative">
                <Image src="/images/shu.jpg" alt="Shubham Trivedi" fill className="object-cover"/>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-2">Shubham Trivedi</h3>
                <p className="text-lg font-bold text-yellow-500 mb-3">Co-Founder</p>
                <p className="text-gray-600">
                  Shubham unites the team with strong leadership and organization. His dedication to creating a
                  collaborative space enables meaningful service opportunities for students.
                </p>
              </div>
            </Card>
          </div>
          <div className="max-w-3xl mx-auto text-center mt-8">
            <p className="text-gray-600">
              Together, Daksh and Shubham drive Hands of Hope's mission forward, creating a collaborative space for
              meaningful service and empowering students to make a difference in their communities.
            </p>
          </div>
        </div>
      </section>

      {/* Crew Cards Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Meet Our Executives</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {crew.map((member) => (
              <Card key={member.name} className="overflow-hidden border-2 border-teal-100 transition-all duration-200 flex flex-col items-center justify-center py-8 hover:shadow-2xl hover:scale-105 hover:border-teal-500">
                <div className="flex flex-col items-center">
                  <div className="w-36 h-36 rounded-full bg-teal-100 flex items-center justify-center mb-4 border-2 border-teal-200 overflow-hidden relative">
                    {member.image ? (
                      <Image src={member.image} alt={member.name} fill className="object-cover rounded-full" style={{objectPosition: 'center'}} />
                    ) : null}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-teal-800 mb-2">{member.name}</h3>
                    <p className="text-lg font-bold text-yellow-500 mb-1">{member.position}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Branch Presidents Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Meet Our Branch Presidents</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Michael",
                role: "Innovation Academy Branch President",
                image: "/images/micheal.jpg",
              },
              {
                name: "Arjun Mandalik",
                role: "Alpharetta High School Branch President",
                image: "/images/arjun.png",
              },
              {
                name: "Alex Turc",
                role: "Cambridge High School Branch Co-President",
                image: "/images/alex.jpg",
              },
              {
                name: "Avi Saxena",
                role: "Cambridge High School Branch Co-President",
                image: "/images/avi.jpeg",
              },
              {
                name: "Orin Adar",
                role: "Chattahoochee High School Branch President",
                image: undefined,
              },
              {
                name: "Devin Kellis",
                role: "Milton High School Branch President",
                image: "/images/devin.jpeg",
              },
              {
                name: "Adithya Prasana Kumar",
                role: "Centennial Collegiate Branch President",
                image: "/images/aditya.jpeg",
              }
            ].map((president) => (
              <Card key={`${president.name}-${president.role}`} className="overflow-hidden border-2 border-teal-100 transition-all duration-200 flex flex-col items-center justify-center py-8 hover:shadow-2xl hover:scale-105 hover:border-teal-500">
                <div className="flex flex-col items-center">
                  <div className="w-36 h-36 rounded-full bg-teal-100 mb-4 border-2 border-teal-200 overflow-hidden relative">
                    {president.image ? (
                      <Image src={president.image} alt={president.name} fill className="object-cover rounded-full" style={{objectPosition: 'center'}} />
                    ) : null}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-teal-800 mb-2">{president.name}</h3>
                    <p className="text-sm text-teal-600 font-medium mb-1">{president.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 
