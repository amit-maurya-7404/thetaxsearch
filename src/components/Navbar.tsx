"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ThemeToggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-white/30 backdrop-blur-md border-white/20">
      <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
        <Link href="/" className="flex items-center space-x-3">
          {/* Logo image - place your final logo at `public/logo.png` (or update the src below) */}
          <div className="flex items-center">
            <img src="/logo.png" alt="theTaxSearch logo" width={200} height={36} className="object-contain" />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/services" className="text-sm font-medium text-black hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/calculators" className="text-sm font-medium text-black hover:text-primary transition-colors">
            Calculators
          </Link>
          <Link href="/blog" className="text-sm font-medium text-black hover:text-primary transition-colors">
            Blog
          </Link>
          {/* <Link href="/#faq" className="text-sm font-medium hover:text-primary transition-colors">
            FAQ
          </Link> */}
          <Link href="/contact" className="text-sm font-medium text-black hover:text-primary transition-colors">
            About Us
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <a href="https://wa.me/919211918886" target="_blank" rel="noopener noreferrer">
            <Button variant="default" size="sm" className="hidden text-white sm:inline-flex">
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

        {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white/40 backdrop-blur-md border-white/20 shadow-lg">
          <div className="container max-w-7xl mx-auto px-4 py-3">
            <div className="space-y-1">
              <Link href="/services" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-medium text-black hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200">
                Services
              </Link>
              <Link href="/calculators/income-tax" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-medium text-black hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200">
                Calculators
              </Link>
              <Link href="/blog" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-medium text-black hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200">
                Blog
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-medium text-black hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200">
                About Us
              </Link>
              <div className="pt-2 border-t border-white/20">
                <a href="https://wa.me/919211918886" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                  <Button variant="default" className="w-full mt-2">
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
