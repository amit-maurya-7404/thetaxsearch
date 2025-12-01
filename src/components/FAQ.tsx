"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="border rounded-lg overflow-hidden hover:border-primary transition-colors"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <span className="font-semibold text-left">{item.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-primary transition-transform ${
                openIndex === index ? "transform rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="px-6 py-4 bg-muted/30 border-t text-muted-foreground">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
