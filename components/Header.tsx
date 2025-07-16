"use client"

import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import SearchModal from "./SearchModal"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    
    if (!element) {
      return
    }
    
    const headerHeight = 64
    const elementPosition = element.offsetTop - headerHeight - 20
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }

  // Mobile scroll function
  const scrollToSectionMobile = (sectionId: string) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      
      if (!element) {
        return
      }
      
      const rect = element.getBoundingClientRect()
      const headerHeight = 64
      const currentScroll = window.pageYOffset
      const elementTop = rect.top + currentScroll
      const targetPosition = elementTop - headerHeight - 20
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }, 50)
  }

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <img 
              src="/Nation logo.svg" 
              alt="Nation Media Group" 
              className="h-8 w-auto"
            />
          </div>
          <Link href="/" className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-900">Revision Portal</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
          <button 
            onClick={scrollToHome}
            className="text-gray-600 hover:text-nmg-primary transition-colors font-medium"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('cbc')}
            className="text-gray-600 hover:text-nmg-primary transition-colors font-medium"
          >
            CBC
          </button>
          <button 
            onClick={() => scrollToSection('844')}
            className="text-gray-600 hover:text-nmg-primary transition-colors font-medium"
          >
            8-4-4
          </button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          
          
          <a
            href="https://roodito.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-nmg-primary hover:bg-nmg-primary/90 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow ml-2"
            style={{ textDecoration: 'none' }}
          >
            Start Revising
          </a>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search quizzes..."
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="px-4 py-3 space-y-3">
            <button
              onClick={() => {
                scrollToHome()
                setIsMenuOpen(false)
              }}
              className="block w-full text-left text-gray-600 hover:text-nmg-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                scrollToSectionMobile('cbc')
                setIsMenuOpen(false)
              }}
              className="block w-full text-left text-gray-600 hover:text-nmg-primary transition-colors"
            >
              CBC
            </button>
            <button
              onClick={() => {
                scrollToSectionMobile('844')
                setIsMenuOpen(false)
              }}
              className="block w-full text-left text-gray-600 hover:text-nmg-primary transition-colors"
            >
              8-4-4
            </button>
            <a
              href="https://roodito.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-nmg-primary hover:bg-nmg-primary/90 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow mt-2"
              style={{ textDecoration: 'none' }}
            >
              Start Revising
            </a>
          </nav>
        </div>
      )}
    </header>

    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
  </>
  )
} 