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
  },
  {
    quote:
      "Receiving the Presidential Volunteer Service Award through Hands of Hope was an honor. It recognized our collective efforts and motivated me to continue serving with passion.",
    author: "Michael v.",
    role: "American Region Leader",
  },
  {
    quote:
      "Hands of Hope's collaboration with local schools and organizations brings hope to our streets. Their consistent efforts show that change is possible when the community comes together.",
    author: "Chad Osgood",
    role: "Financial Sponsor",
  },
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
    }, 8000)

    return () => clearInterval(interval)
  }, [current])

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="bg-teal-700 border-none p-8 md:p-12">
        <Quote className="h-12 w-12 text-yellow-400 mb-6 mx-auto" />
        <div className="text-center">
          <p className="text-xl md:text-2xl italic mb-6">{testimonials[current].quote}</p>
          <div className="font-bold text-yellow-400">{testimonials[current].author}</div>
          <div className="text-teal-100">{testimonials[current].role}</div>
        </div>
      </Card>

      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={prev}
          className="p-2 rounded-full bg-teal-700 text-white hover:bg-teal-600 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2 items-center">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full ${
                index === current ? "bg-yellow-400" : "bg-teal-600 hover:bg-teal-500"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="p-2 rounded-full bg-teal-700 text-white hover:bg-teal-600 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
