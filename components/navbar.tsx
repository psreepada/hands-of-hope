"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
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
            <Link 
              href="/" 
              className={`transition-colors ${isActive('/') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`transition-colors ${isActive('/about') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
            >
              About
            </Link>
            <Link
              href="/donate"
              className={`transition-colors ${isActive('/donate') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
            >
              Donate
            </Link>
            <Link 
              href="/branches" 
              className={`transition-colors ${isActive('/branches') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
            >
              Our Branches
            </Link>
            <Link 
              href="/crew" 
              className={`transition-colors ${isActive('/crew') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
            >
              Our Crew
            </Link>
            <Link 
              href="/contact" 
              className={`transition-colors ${isActive('/contact') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
            >
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
              className={`py-2 transition-colors ${isActive('/') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`py-2 transition-colors ${isActive('/about') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="/donate"
              className={`py-2 transition-colors ${isActive('/donate') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
              onClick={toggleMenu}
            >
              Donate
            </Link>
            <Link
              href="/branches"
              className={`py-2 transition-colors ${isActive('/branches') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
              onClick={toggleMenu}
            >
              Our Branches
            </Link>
            <Link
              href="/crew"
              className={`py-2 transition-colors ${isActive('/crew') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
              onClick={toggleMenu}
            >
              Our Crew
            </Link>
            <Link
              href="/contact"
              className={`py-2 transition-colors ${isActive('/contact') ? 'text-yellow-500 font-medium' : 'text-teal-800 font-medium hover:text-teal-600'}`}
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
