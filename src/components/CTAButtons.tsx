import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

interface CTAButtonProps {
  text: string
  href: string
  variant?: "primary" | "secondary"
}

export function CTAButton({ text, href, variant = "primary" }: CTAButtonProps) {
  return (
    <Link href={href}>
      <Button
        variant={variant === "primary" ? "default" : "outline"}
        className="group"
      >
        {text}
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </Link>
  )
}

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary-light text-white">
      <div className="container max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Ready to Simplify Your Tax Journey?
        </h2>
        <p className="text-lg mb-8 text-white opacity-90 max-w-2xl mx-auto">
          Book a free consultation with our tax experts or explore our tools today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            className="text-primary hover:text-primary font-semibold"
          >
            Book Free Consultation
          </Button>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="w-full text-white border-white hover:bg-white hover:text-primary font-semibold">
              Chat on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
