"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, School, MapPin, User } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"

const crew = [
  {
    name: "Pranav Sreepada",
    position: "CTO",
    image: "/images/pranav.jpg",
    bio: "Pranav leads our technological initiatives, ensuring we leverage the latest innovations to maximize our impact in serving the community."
  },
  {
    name: "Abhinav Lavu",
    position: "CFO",
    image: "/images/abi.jpg",
    bio: "Abhinav manages our financial operations, ensuring sustainable growth and responsible resource allocation for our programs."
  },
  {
    name: "Michael",
    position: "COO",
    image: "/images/mnew.jpg",
    bio: "Michael oversees our day-to-day operations, ensuring smooth execution of our programs and initiatives across all branches."
  },
  {
    name: "Arthur",
    position: "CMO",
    image: "/images/anew.png",
    bio: "Arthur drives our marketing and outreach efforts, helping us connect with more communities and expand our impact."
  },
]

interface BranchLeader {
  id: number
  leader_name: string
  leader_description: string
  leader_image_url: string | null
  leader_order: number
  branch: {
    school_name: string
    name: string
  }
}

export default function CrewPage() {
  const [branchLeaders, setBranchLeaders] = useState<BranchLeader[]>([])
  const [leadersLoading, setLeadersLoading] = useState(true)
  const [leadersError, setLeadersError] = useState<string | null>(null)
  
  // Search and filter states for branch presidents
  const [presidentsSearchQuery, setPresidentsSearchQuery] = useState("")
  const [schoolFilter, setSchoolFilter] = useState("")
  const [sortPresidentsBy, setSortPresidentsBy] = useState<"name" | "school" | "description">("name")

  useEffect(() => {
    fetchBranchLeaders()
  }, [])

  const fetchBranchLeaders = async () => {
    try {
      setLeadersLoading(true)
      setLeadersError(null)
      
      const { data, error } = await supabase
        .from('branch_leaders')
        .select(`
          id,
          leader_name,
          leader_description,
          leader_image_url,
          leader_order,
          branch:branches (
            school_name,
            name
          )
        `)
        .order('branch(school_name)', { ascending: true })
        .order('leader_order', { ascending: true })

      if (error) {
        console.error('Error fetching branch leaders:', error)
        setLeadersError('Failed to load branch leaders.')
        return
      }

      setBranchLeaders(data || [])
    } catch (err) {
      console.error('Unexpected error:', err)
      setLeadersError('An unexpected error occurred.')
    } finally {
      setLeadersLoading(false)
    }
  }

  // Get unique schools for filter dropdown
  const uniqueSchools = useMemo(() => {
    const schools = branchLeaders.map(leader => leader.branch?.school_name || "Unknown")
    return [...new Set(schools)].sort()
  }, [branchLeaders])

  // Filter and sort branch presidents
  const filteredAndSortedPresidents = useMemo(() => {
    let filtered = branchLeaders.filter(leader => {
      const matchesSearch = presidentsSearchQuery === "" || 
        leader.leader_name.toLowerCase().includes(presidentsSearchQuery.toLowerCase()) ||
        leader.leader_description.toLowerCase().includes(presidentsSearchQuery.toLowerCase()) ||
        (leader.branch?.school_name && leader.branch.school_name.toLowerCase().includes(presidentsSearchQuery.toLowerCase())) ||
        (leader.branch?.name && leader.branch.name.toLowerCase().includes(presidentsSearchQuery.toLowerCase()))
      
      const matchesSchool = schoolFilter === "" || leader.branch?.school_name === schoolFilter
      
      return matchesSearch && matchesSchool
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortPresidentsBy) {
        case "name":
          return a.leader_name.localeCompare(b.leader_name)
        case "school":
          const schoolA = a.branch?.school_name || ""
          const schoolB = b.branch?.school_name || ""
          return schoolA.localeCompare(schoolB)
        case "description":
          return a.leader_description.localeCompare(b.leader_description)
        default:
          return 0
      }
    })

    return filtered
  }, [branchLeaders, presidentsSearchQuery, schoolFilter, sortPresidentsBy])

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/80 z-10" />
        <div className="relative h-[300px] w-full">
          <Image src="/images/awork.jpg" alt="Our Crew" fill className="object-cover" />
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
          <div className="grid md:grid-cols-2 gap-12 max-w-2xl mx-auto">
            <Card className="overflow-hidden border-2 border-teal-100 hover:border-teal-200 transition-colors max-w-xs mx-auto w-full shadow-sm hover:shadow-md">
              <div className="relative overflow-hidden max-w-[320px] mx-auto" style={{ aspectRatio: '3/4' }}>
                <Image src="/images/daksh_prof.jpeg" alt="Daksh Shah" fill className="object-cover" style={{ objectPosition: '60% bottom', transform: 'scale(1.1)' }} />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-teal-800 mb-2">Daksh Shah</h3>
                <p className="text-lg font-bold text-yellow-500 mb-3">Co-Founder</p>
                <p className="text-gray-600 text-sm">
                  Daksh brings visionary ideas and fosters community connections. His passion for social impact drives
                  Hands of Hope's innovative approach to serving the homeless community.
                </p>
              </div>
            </Card>
            <Card className="overflow-hidden border-2 border-teal-100 hover:border-teal-200 transition-colors max-w-xs mx-auto w-full shadow-sm hover:shadow-md">
              <div className="relative max-w-[320px] mx-auto" style={{ aspectRatio: '3/4' }}>
                <Image src="/images/snew.jpeg" alt="Shubham Trivedi" fill className="object-cover"/>
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-teal-800 mb-2">Shubham Trivedi</h3>
                <p className="text-lg font-bold text-yellow-500 mb-3">Co-Founder</p>
                <p className="text-gray-600 text-sm">
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

      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Meet Our Executives</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {crew.map((member) => (
              <Card key={member.name} className="bg-teal-50/40 border-2 border-teal-100 hover:border-teal-300 shadow-sm hover:shadow-lg transition-all duration-200 flex items-center md:flex-row flex-col p-6 md:p-8">
                <div className="w-44 h-44 relative overflow-hidden flex-shrink-0 rounded-full md:mr-8 mb-4 md:mb-0 mx-auto md:mx-0 border-4 border-white shadow-md">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} fill className="object-cover" style={{objectPosition: 'center'}} />
                  ) : (
                    <div className="w-full h-full bg-teal-100 flex items-center justify-center rounded-full">
                      <span className="text-4xl text-teal-300">👤</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                  <h3 className="text-2xl font-bold text-teal-900 mb-1">{member.name}</h3>
                  <p className="text-lg font-semibold text-yellow-600 mb-2">{member.position}</p>
                  <p className="text-base text-gray-700 leading-relaxed max-w-lg mx-auto md:mx-0">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Meet Our Region Leaders</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Jeetu",
                role: "U.S. Region Leader",
                image: "/images/jeetu.jpeg",
                bio: "Jeetu leads our U.S. operations, coordinating efforts across multiple branches and ensuring consistent impact across the country."
              },
              {
                name: "Adithya Prasana Kumar",
                role: "Canada Region Leader",
                image: "/images/aditya.jpeg",
                bio: "Adithya oversees our Canadian initiatives, expanding our reach and impact across Canadian communities, making us a global organization."
              }
            ].map((leader) => (
              <Card key={leader.name} className="bg-white border-2 border-teal-100 hover:border-teal-300 shadow-sm hover:shadow-lg transition-all duration-200 flex items-center md:flex-row flex-col p-6 md:p-8">
                <div className="w-32 h-32 relative overflow-hidden flex-shrink-0 rounded-full md:mr-8 mb-4 md:mb-0 mx-auto md:mx-0 border-4 border-white shadow-md">
                  {leader.image ? (
                    <Image src={leader.image} alt={leader.name} fill className="object-cover" style={{objectPosition: 'center'}} />
                  ) : (
                    <div className="w-full h-full bg-teal-100 flex items-center justify-center rounded-full">
                      <span className="text-4xl text-teal-300">👤</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                  <h3 className="text-2xl font-bold text-teal-900 mb-1">{leader.name}</h3>
                  <p className="text-lg font-bold text-yellow-600 mb-2">{leader.role}</p>
                  <p className="text-base text-gray-700 leading-relaxed max-w-md mx-auto md:mx-0">{leader.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Meet Our Branch Presidents</h2>
            <p className="text-teal-900 text-base font-semibold max-w-2xl mx-auto mt-2 bg-teal-50 border-l-4 border-teal-400 rounded-md py-3 px-4">
              Branch Presidents lead our school chapters and coordinate local projects. Only highly qualified and dedicated individuals are chosen for this important role.
            </p>
          </div>

          {/* Search and Filter Section for Branch Presidents */}
          {!leadersLoading && !leadersError && branchLeaders.length > 0 && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search presidents by name, school, or role description..."
                        value={presidentsSearchQuery}
                        onChange={(e) => setPresidentsSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* School Filter */}
                  <div className="md:w-48">
                    <div className="relative">
                      <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={schoolFilter}
                        onChange={(e) => setSchoolFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-md focus:border-teal-500 focus:ring-teal-500 bg-white appearance-none"
                      >
                        <option value="">All Schools</option>
                        {uniqueSchools.map(school => (
                          <option key={school} value={school}>{school}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="md:w-48">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={sortPresidentsBy}
                        onChange={(e) => setSortPresidentsBy(e.target.value as "name" | "school" | "description")}
                        className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-md focus:border-teal-500 focus:ring-teal-500 bg-white appearance-none"
                      >
                        <option value="name">Sort by Name</option>
                        <option value="school">Sort by School</option>
                        <option value="description">Sort by Role</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
                  <span>
                    Showing {filteredAndSortedPresidents.length} of {branchLeaders.length} branch presidents
                    {presidentsSearchQuery && ` matching "${presidentsSearchQuery}"`}
                    {schoolFilter && ` from ${schoolFilter}`}
                  </span>
                  {(presidentsSearchQuery || schoolFilter) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPresidentsSearchQuery("")
                        setSchoolFilter("")
                      }}
                      className="text-teal-600 hover:text-teal-700"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          {leadersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden border-2 border-teal-100 transition-all duration-200 flex flex-col items-center justify-center py-8 animate-pulse">
                  <div className="flex flex-col items-center">
                    <div className="w-36 h-36 rounded-full bg-gray-200 mb-4 border-2 border-gray-300"></div>
                    <div className="p-6 text-center space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                      <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : leadersError ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <h3 className="text-lg font-medium">Error Loading Branch Leaders</h3>
                <p className="text-sm">{leadersError}</p>
              </div>
              <button
                onClick={fetchBranchLeaders}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredAndSortedPresidents.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {branchLeaders.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Branch Leaders Yet</h3>
                  <p className="text-gray-600">
                    Branch leaders will appear here when they are added through the super-admin interface.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Presidents</h3>
                  <p className="text-gray-600 mb-4">
                    No branch presidents match your current search criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPresidentsSearchQuery("")
                      setSchoolFilter("")
                    }}
                    className="text-teal-600 border-teal-600 hover:bg-teal-50"
                  >
                    Clear All Filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {filteredAndSortedPresidents.map((leader) => (
                <Card key={`${leader.id}-${leader.leader_name}`} className="overflow-hidden border-2 border-teal-100 transition-all duration-200 flex flex-col items-center justify-center py-8 hover:shadow-2xl hover:scale-105 hover:border-teal-500">
                  <div className="flex flex-col items-center">
                    <div className="w-36 h-36 rounded-full bg-teal-100 mb-4 border-2 border-teal-200 overflow-hidden relative">
                      {leader.leader_image_url ? (
                        <Image 
                          src={leader.leader_image_url} 
                          alt={leader.leader_name || 'Branch Leader'} 
                          fill 
                          className="object-cover rounded-full" 
                          style={{objectPosition: 'center'}} 
                        />
                      ) : (
                        <div className="w-full h-full bg-teal-100 flex items-center justify-center">
                          <span className="text-4xl text-teal-300">👤</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-teal-800 mb-2">{leader.leader_name}</h3>
                      <p className="text-sm text-teal-600 font-medium mb-1">{leader.leader_description}</p>
                      <p className="text-xs text-gray-500">{leader.branch?.school_name}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}