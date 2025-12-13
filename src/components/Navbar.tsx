"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ThemeToggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  const toggleMenu = () => setIsOpen(!isOpen)

  const openDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setDropdownOpen(true)
  }

  const scheduleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => {
      setDropdownOpen(false)
      closeTimerRef.current = null
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
    }
  }, [])

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
          <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={scheduleClose}
          >
            <Link href="/services" className="text-sm font-medium text-black hover:text-primary transition-colors">
              Services
            </Link>
            {/* Dropdown - controlled open state with delayed close */}
            <div
              onMouseEnter={openDropdown}
              onMouseLeave={scheduleClose}
              className={`absolute left-0 mt-3 w-56 bg-white rounded-md shadow-lg border border-white/20 transition-opacity ${dropdownOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
              <div className="py-2">
                <Link href="/services/income-tax-return-filing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10">Income Tax Return Filing</Link>
                <Link href="/services/gst-registration-and-filing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10">GST Registration & Filing</Link>
                <Link href="/services/tds-return-filing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10">TDS Return Filing</Link>
                <Link href="/services/business-company-registration" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10">Business/Company Registration</Link>
                <Link href="/services/12a-80g-registrations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10">12A & 80G Registrations</Link>
                <Link href="/services/accounting-and-compliance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10">Accounting & Compliance Support</Link>
                <Link href="/services/tds-on-sale-of-property" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10">TDS on Sale of Property</Link>
              </div>
            </div>
          </div>
          <Link href="/calculators" className="text-sm font-medium text-black hover:text-primary transition-colors">
            Calculators
          </Link>
          <Link href="/blog" className="text-sm font-medium text-black hover:text-primary transition-colors">
            Blog
          </Link>
          {/* <Link href="/#faq" className="text-sm font-medium hover:text-primary transition-colors">
            FAQ
          </Link> */}
          <Link href="/aboutus" className="text-sm font-medium text-black hover:text-primary transition-colors">
            About Us
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <a href="https://wa.me/919211918886" target="_blank" rel="noopener noreferrer">
            <Button variant="default" size="sm" className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white">
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
              <div className="block px-4 py-3">
                <Link href="/services" onClick={() => setIsOpen(false)} className="text-sm font-medium text-black hover:text-primary transition-colors">
                  Services
                </Link>
                <div className="mt-2 space-y-1">
                  <Link href="/services/income-tax-return-filing" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded">Income Tax Return Filing</Link>
                  <Link href="/services/gst-registration-and-filing" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded">GST Registration & Filing</Link>
                  <Link href="/services/tds-return-filing" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded">TDS Return Filing</Link>
                  <Link href="/services/business-company-registration" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded">Business/Company Registration</Link>
                  <Link href="/services/12a-80g-registrations" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded">12A & 80G Registrations</Link>
                  <Link href="/services/accounting-and-compliance" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded">Accounting & Compliance Support</Link>
                  <Link href="/services/tds-on-sale-of-property" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded">TDS on Sale of Property</Link>
                </div>
              </div>
              <Link href="/calculators/income-tax" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-medium text-black hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200">
                Calculators
              </Link>
              <Link href="/blog" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-medium text-black hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200">
                Blog
              </Link>
              <Link href="/aboutus" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-medium text-black hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200">
                About Us
              </Link>
              <div className="pt-2 border-t border-white/20">
                <a href="https://wa.me/919211918886" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                  <Button variant="default" className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white">
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
