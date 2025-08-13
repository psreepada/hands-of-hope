"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Calendar, Search, Filter, MapPin, School } from "lucide-react"
import BranchCard from "@/components/branch-card"
import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"

interface Branch {
  id: number
  name: string
  school_name: string
  location: string
  leader_name: string | null
  leader_email: string | null
  leader_phone: string | null
  image_url: string | null
  total_hours: number
  total_events: number
  total_users: number
  created_at: string
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "location" | "volunteers" | "events">("name")

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('branches')
        .select('*')
        .order('name', { ascending: true })

      if (fetchError) {
        console.error('Error fetching branches:', fetchError)
        setError('Failed to load branches. Please try again later.')
        return
      }

      setBranches(data || [])
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locations = branches.map(branch => branch.location)
    return [...new Set(locations)].sort()
  }, [branches])

  // Filter and sort branches
  const filteredAndSortedBranches = useMemo(() => {
    let filtered = branches.filter(branch => {
      const matchesSearch = searchQuery === "" || 
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (branch.leader_name && branch.leader_name.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesLocation = locationFilter === "" || branch.location === locationFilter
      
      return matchesSearch && matchesLocation
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "location":
          return a.location.localeCompare(b.location)
        case "volunteers":
          return b.total_users - a.total_users
        case "events":
          return b.total_events - a.total_events
        default:
          return 0
      }
    })

    return filtered
  }, [branches, searchQuery, locationFilter, sortBy])

  // Transform filtered branches data to match BranchCard expected format
  const transformedBranches = filteredAndSortedBranches.map(branch => ({
    id: branch.id,
    name: branch.name,
    image: branch.image_url || "/placeholder.svg",
    phone: branch.leader_phone || "TBA",
    email: branch.leader_email || "",
    address: `${branch.school_name}, ${branch.location}`,
    volunteers: branch.total_users,
    events: branch.total_events,
    description: `Branch at ${branch.school_name}`,
    meetingDay: "Contact branch for details",
    meetingTime: "Contact branch for details",
    leadName: branch.leader_name || "TBA",
    leadTitle: "Branch Leader"
  }))
  return (
    <div className="flex min-h-screen flex-col">
      {}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/80 z-10" />
        <div className="relative h-[300px] w-full">
          <Image
            src="/images/6.jpg"
            alt="Hands of Hope branches across the country"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                Our <span className="text-yellow-400">Branches</span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join one of our local branches to make a difference in your community
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Branch Benefits</h2>
            <p className="text-lg text-gray-600">
              Being part of a Hands of Hope branch offers numerous benefits for students and communities alike.
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

      {}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Start a Branch</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Don't see a branch in your area? We're always looking to expand our reach and impact. Starting a Hands
                  of Hope branch at your school or in your community is easier than you think.
                </p>
                <p className="text-gray-600">
                  We provide all the resources, training, and support you need to get started. You'll join a network of
                  passionate student leaders making a real difference in their communities.
                </p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
                  <p className="text-sm font-medium text-yellow-800">
                    <span className="font-bold">Note:</span> Becoming a branch leader is a rigorous process and these positions are highly competitive, interview selection is required.
                  </p>
                </div>
                
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
                      Apply to Start a Branch
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

      {}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-4">Find Your Local Branch</h2>
            <p className="text-lg text-gray-600">
              Hands of Hope has branches across the globe, each working to address homelessness in their local
              communities. Find the branch nearest you to get involved.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search branches by name, school, location, or leader..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="md:w-48">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-md focus:border-teal-500 focus:ring-teal-500 bg-white appearance-none"
                    >
                      <option value="">All Locations</option>
                      {uniqueLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort By */}
                <div className="md:w-48">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "name" | "location" | "volunteers" | "events")}
                      className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-md focus:border-teal-500 focus:ring-teal-500 bg-white appearance-none"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="location">Sort by Location</option>
                      <option value="volunteers">Most Volunteers</option>
                      <option value="events">Most Events</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              {!loading && (
                <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
                  <span>
                    Showing {transformedBranches.length} of {branches.length} branches
                    {searchQuery && ` matching "${searchQuery}"`}
                    {locationFilter && ` in ${locationFilter}`}
                  </span>
                  {(searchQuery || locationFilter) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("")
                        setLocationFilter("")
                      }}
                      className="text-teal-600 hover:text-teal-700"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <Users className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-medium">Error Loading Branches</h3>
                <p className="text-sm">{error}</p>
              </div>
              <Button onClick={fetchBranches} variant="outline">
                Try Again
              </Button>
            </div>
          ) : transformedBranches.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {branches.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Branches Yet</h3>
                  <p className="text-gray-600 mb-4">
                    No branches have been created yet. Check back later or contact us to start a new branch.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Branches</h3>
                  <p className="text-gray-600 mb-4">
                    No branches match your current search criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setLocationFilter("")
                    }}
                    className="text-teal-600 border-teal-600 hover:bg-teal-50"
                  >
                    Clear All Filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {transformedBranches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
