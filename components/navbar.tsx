"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Hands of Hope Logo" width={50} height={50} className="rounded-full" />
              <span className="hidden md:inline-block text-xl font-bold text-teal-800">
                Hands of <span className="text-yellow-500">Hope</span>
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-teal-800 font-medium hover:text-teal-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-teal-800 font-medium hover:text-teal-600 transition-colors">
              About
            </Link>
            <a
              href="https://hcb.hackclub.com/donations/start/hands-of-hope"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 font-bold hover:text-yellow-600 transition-colors"
              style={{ marginRight: '0.5rem' }}
            >
              Donate
            </a>
            <Link href="/branches" className="text-teal-800 font-medium hover:text-teal-600 transition-colors">
              Our Chapters
            </Link>
            <Link href="/crew" className="text-teal-800 font-medium hover:text-teal-600 transition-colors">
              Our Crew
            </Link>
            <Link href="/contact" className="text-teal-800 font-medium hover:text-teal-600 transition-colors">
              Contact
            </Link>
          </nav>
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6 text-teal-800" /> : <Menu className="h-6 w-6 text-teal-800" />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-teal-800 font-medium py-2 hover:text-teal-600 transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-teal-800 font-medium py-2 hover:text-teal-600 transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
            <a
              href="https://hcb.hackclub.com/donations/start/hands-of-hope"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 font-bold hover:text-yellow-600 transition-colors block"
              style={{ marginRight: '0.5rem' }}
              onClick={toggleMenu}
            >
              Donate
            </a>
            <Link
              href="/branches"
              className="text-teal-800 font-medium py-2 hover:text-teal-600 transition-colors"
              onClick={toggleMenu}
            >
              Our Branches
            </Link>
            <Link
              href="/crew"
              className="text-teal-800 font-medium py-2 hover:text-teal-600 transition-colors"
              onClick={toggleMenu}
            >
              Our Crew
            </Link>
            <Link
              href="/contact"
              className="text-teal-800 font-medium py-2 hover:text-teal-600 transition-colors"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
