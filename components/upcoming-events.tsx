import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Community Food Drive",
    date: "May 15, 2023",
    time: "10:00 AM - 2:00 PM",
    location: "Central Park Community Center",
    description: "Join us for our monthly food drive to collect non-perishable items for local shelters.",
  },
  {
    id: 2,
    title: "Volunteer Training Workshop",
    date: "May 22, 2023",
    time: "6:00 PM - 8:00 PM",
    location: "Hands of Hope Headquarters",
    description: "New volunteers can learn about our programs and how to effectively serve our community.",
  },
  {
    id: 3,
    title: "Homeless Outreach Day",
    date: "June 5, 2023",
    time: "9:00 AM - 3:00 PM",
    location: "Downtown Area",
    description: "We'll be distributing care packages, meals, and resources to those experiencing homelessness.",
  },
]

export default function UpcomingEvents() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <h3 className="text-xl font-bold text-teal-800 mb-3">{event.title}</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-teal-600" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-teal-600" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-teal-600" />
                <span>{event.location}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <Button variant="outline" className="w-full border-teal-600 text-teal-600 hover:bg-teal-50">
              Register
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
