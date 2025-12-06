"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  title?: string
  quote: string
  rating?: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ravi Sharma",
    title: "Small Business Owner",
    quote:
      "theTaxSearch made filing GST so much easier — fast, reliable and the team guided us at every step.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sneha Gupta",
    title: "Independent Consultant",
    quote:
      "Clear advice and tools that actually save time. Their calculators are spot-on for quick estimates.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amit Verma",
    title: "Freelancer",
    quote:
      "Great support and prompt responses. Highly recommended for freelancers looking for simple tax help.",
    rating: 4,
  },
]

export function Testimonials() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(t)
  }, [])

  const current = testimonials[index]

  return (
    <section className="py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-black">What Our Customers Say</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Honest feedback from users who rely on our calculators and services.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="bg-white border rounded-lg p-8 shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  {current.name.split(" ")[0].charAt(0)}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-semibold text-black">{current.name}</div>
                  {current.title && (
                    <div className="text-sm text-gray-500">• {current.title}</div>
                  )}
                </div>

                <p className="text-gray-700 mb-4">"{current.quote}"</p>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < (current.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              aria-label="previous testimonial"
              onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
              className="text-sm text-primary hover:underline"
            >
              Previous
            </button>

            <div className="text-sm text-gray-500">{index + 1} / {testimonials.length}</div>

            <button
              aria-label="next testimonial"
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
              className="text-sm text-primary hover:underline"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
