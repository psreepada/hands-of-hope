"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "As long as there are people in need, Hands of Hope will be there to lift them up.",
    author: "Daksh Shah",
    role: "Co-Founder",
    initials: "DS"
  },
  {
    quote:
      "Receiving the Presidential Volunteer Service Award through Hands of Hope was an honor. It recognized our collective efforts and motivated me to continue serving with passion.",
    author: "Michael V.",
    role: "American Region Leader",
    initials: "MV"
  },
  {
    quote:
      "Hands of Hope's collaboration with local schools and organizations brings hope to our streets. Their consistent efforts show that change is possible when the community comes together.",
    author: "Chad Osgood",
    role: "Sponsor",
    initials: "CO"
  }
]

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 10000) // Increased to 10 seconds for better readability
    return () => clearInterval(interval)
  }, [current])

  const currentTestimonial = testimonials[current]

  return (
    <div className="relative max-w-6xl mx-auto">
      <Card className="bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 border-none p-8 md:p-12 shadow-2xl">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Profile Initials and Info */}
          <div className="text-center md:text-left">
            <div className="w-24 h-24 mx-auto md:mx-0 mb-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center border-4 border-yellow-400">
              <span className="text-2xl font-bold text-teal-800">
                {currentTestimonial?.initials}
              </span>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-yellow-400 text-lg">{currentTestimonial?.author}</h4>
              <p className="text-teal-100 text-sm">{currentTestimonial?.role}</p>
            </div>
          </div>

          {/* Quote Section */}
          <div className="md:col-span-2 text-center md:text-left">
            <Quote className="h-8 w-8 text-yellow-400 mb-4 mx-auto md:mx-0" />
            <blockquote className="text-lg md:text-xl italic text-white leading-relaxed mb-4">
              {currentTestimonial?.quote}
            </blockquote>
          </div>
        </div>
      </Card>

      {/* Enhanced Navigation */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={prev}
          className="p-3 rounded-full bg-gradient-to-r from-teal-700 to-teal-600 text-white hover:from-teal-600 hover:to-teal-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="flex gap-3 items-center">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`group relative transition-all duration-300 ${
                index === current 
                  ? "w-12 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" 
                  : "w-3 h-3 bg-teal-600 hover:bg-teal-500 rounded-full hover:scale-125"
              }`}
              aria-label={`Go to testimonial by ${testimonial.author}`}
              title={testimonial.author}
            >
              {index === current && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {testimonial.author}
                </div>
              )}
            </button>
          ))}
        </div>
        
        <button
          onClick={next}
          className="p-3 rounded-full bg-gradient-to-r from-teal-700 to-teal-600 text-white hover:from-teal-600 hover:to-teal-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">
          {current + 1} of {testimonials.length} stories
        </span>
      </div>
    </div>
  )
}
