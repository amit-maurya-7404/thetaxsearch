import Link from "next/link"
import Image from "next/image"
import { Facebook, Linkedin, Twitter, Mail, Phone } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4 w-fit mx-auto md:mx-0">
              <img src="/logo.png" alt="theTaxSearch logo" width={300} height={36} className="object-contain" />
            </Link>
            <p className="text-sm text-gray-700">
              Your trusted partner in tax compliance and financial solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-black">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-gray-700 hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-700 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#contact-form-section" className="text-gray-700 hover:text-primary transition-colors">
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="font-semibold mb-4 text-black">Calculators</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/calculators/income-tax" className="text-gray-700 hover:text-primary transition-colors">
                  Income Tax
                </Link>
              </li>
              <li>
                <Link href="/calculators/gst" className="text-gray-700 hover:text-primary transition-colors">
                  GST Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/hra" className="text-gray-700 hover:text-primary transition-colors">
                  HRA Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/tds" className="text-gray-700 hover:text-primary transition-colors">
                  TDS Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-black">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+919211918886" className="text-gray-700 hover:text-primary transition-colors">
                  +91 92119 18886
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:info@thetaxsearch.com" className="text-gray-700 hover:text-primary transition-colors">
                  info@thetaxsearch.com
                </a>
              </li>
            </ul>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        {/* <div className="relative text-[12vw] leading-[0.8] text-[#11250c] pb-[0.1vw] whitespace-nowrap text-center mt-[6vw] lg:mt-[2vw] tracking-wider" style={{ fontFamily: 'Optima, sans-serif' }}>
          theTaxSearch
        </div> */}

        <div className="border-t mt-10 pt-8 flex flex-col md:flex-row justify-center md:justify-between items-center text-sm text-gray-700">
          <p>&copy; {currentYear} @ <a href="https://wa.me/919137290903" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors">Powered by Amit Maurya</a>.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 justify-center md:justify-start">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
