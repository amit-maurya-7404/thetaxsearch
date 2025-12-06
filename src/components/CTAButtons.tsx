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
    <section className="py-16 bg-gradient-to-r from-primary to-primary-light text-white relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Ready to Simplify Your Tax Journey?
        </h2>
        <p className="text-lg mb-8 text-white opacity-90 max-w-2xl mx-auto">
          Book a free consultation with our tax experts or explore our tools today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            className="text-black hover:text-white font-semibold bg-white hover:bg-black shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out"
          >
            Book Free Consultation
          </Button>
          <a
            href="https://wa.me/919211918886"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="w-full text-black border-white hover:bg-black hover:text-white font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out">
              Chat on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
