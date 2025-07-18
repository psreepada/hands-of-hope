"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Linkedin } from "lucide-react"
import { useDonationModal } from "@/components/DonationModalProvider"

export default function Footer() {
  const { open } = useDonationModal()

  return (
    <footer className="bg-teal-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Hands of Hope Logo" width={60} height={60} className="rounded-full" />
              <span className="text-xl font-bold">
                Hands of <span className="text-yellow-400">Hope</span>
              </span>
            </div>
            <p className="text-teal-100 max-w-xs">
              A student-led nonprofit organization dedicated to uplifting and empowering the homeless through community
              action.
            </p>
            <div className="flex gap-4">
              <Link href="https://www.instagram.com/handsofhope_outreach?igsh=M2dwam8wYWJ6YjVk&utm_source=qr" className="text-white hover:text-yellow-400 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://www.linkedin.com/company/hands-of-hope-outreach/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-teal-100 hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-teal-100 hover:text-yellow-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/branches" className="text-teal-100 hover:text-yellow-400 transition-colors">
                  Our Branches
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-teal-100 hover:text-yellow-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Get Involved</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSf7Kl3uHIIFvfP00m5X4P_2ia6K2FWAWH3GLV4mMe46ksxoKw/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-100 hover:text-yellow-400 transition-colors"
                >
                  Start a Branch
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-teal-100 hover:text-yellow-400 transition-colors">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-teal-100 hover:text-yellow-400 transition-colors">
                  Contact Us Form
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-yellow-400" /> 
                <span className="text-teal-100">(404)-992-4320</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-yellow-400" />
                <span className="text-teal-100">info@handsofhopeoutreach.org</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Full-width border line */}
      <div className="border-t border-teal-800"></div>
      
      {/* Full-width darker bottom section */}
      <div className="bg-teal-950/90">
        <div className="container mx-auto px-4 md:px-6 py-8 text-center text-teal-100">
          <p>© {new Date().getFullYear()} Hands of Hope Outreach. All rights reserved. Fiscally sponsored by <a href="https://hackclub.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 transition-colors">Hack Club</a>.</p>
          <p className="mt-2 italic">Website Made Possible by Phoenix Tech Solutions</p>
        </div>
      </div>
    </footer>
  )
}
