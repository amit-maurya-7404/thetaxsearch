"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ThemeToggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline">theTaxSearch</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/calculators/income-tax" className="text-sm font-medium hover:text-primary transition-colors">
            Calculators
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
            Blog
          </Link>
          {/* <Link href="/#faq" className="text-sm font-medium hover:text-primary transition-colors">
            FAQ
          </Link> */}
          <Link href="/#contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
            <Button variant="default" size="sm" className="hidden sm:inline-flex">
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
        <div className="md:hidden border-t bg-background">
          <div className="container space-y-4 py-4">
            <Link href="/services" className="block text-sm font-medium hover:text-primary">
              Services
            </Link>
            <Link href="/calculators/income-tax" className="block text-sm font-medium hover:text-primary">
              Calculators
            </Link>
            <Link href="/blog" className="block text-sm font-medium hover:text-primary">
              Blog
            </Link>
            {/* <Link href="/#faq" className="block text-sm font-medium hover:text-primary">
              FAQ
            </Link> */}
            <Link href="/#contact" className="block text-sm font-medium hover:text-primary">
              Contact
            </Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <Button variant="default" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
