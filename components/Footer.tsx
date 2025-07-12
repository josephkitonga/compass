"use client"

import Link from "next/link"
import { useCallback } from "react"

export default function Footer() {
  // Smooth scroll functions (mirrored from Header)
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (!element) return
    const headerHeight = 64
    const elementPosition = element.offsetTop - headerHeight - 20
    window.scrollTo({ top: elementPosition, behavior: 'smooth' })
  }, [])

  const scrollToSectionMobile = useCallback((sectionId: string) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (!element) return
      const rect = element.getBoundingClientRect()
      const headerHeight = 64
      const currentScroll = window.pageYOffset
      const elementTop = rect.top + currentScroll
      const targetPosition = elementTop - headerHeight - 20
      window.scrollTo({ top: targetPosition, behavior: 'smooth' })
    }, 50)
  }, [])

  const scrollToHome = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Detect mobile (simple check)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <footer className="bg-nmg-primary text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between items-center text-center md:text-left">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0 w-full md:w-auto">
            <div className="flex items-center justify-center space-x-3 mb-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border border-white/20">
              <img 
                src="/Nation logo.svg" 
                alt="Nation Media Group" 
                className="h-10 w-auto"
              />
              <span className="text-nmg-primary text-xl font-bold">•</span>
              <img 
                src="/roodito.png" 
                alt="Roodito" 
                className="h-10 w-auto"
              />
            </div>
            <h3 className="text-xl font-bold text-nmg-secondary mb-2">Revision Portal</h3>
            <p className="text-nmg-secondary/80 text-sm text-center md:text-left">
              Empowering Kenyan students with quality revision materials
            </p>
          </div>
          
          {/* Quick Links Section */}
          <div className="flex flex-col items-center md:items-end w-full md:w-auto">
            <div className="grid grid-cols-2 gap-8 mb-6 w-full max-w-xs md:max-w-none">
              <div>
                <h4 className="text-nmg-secondary font-semibold mb-3">Education Systems</h4>
                <div className="space-y-2">
                  <button type="button" onClick={() => (isMobile ? scrollToSectionMobile('cbc') : scrollToSection('cbc'))} className="block w-full text-nmg-secondary/80 hover:text-nmg-secondary transition-colors text-left">
                    CBC Curriculum
                  </button>
                  <button type="button" onClick={() => (isMobile ? scrollToSectionMobile('844') : scrollToSection('844'))} className="block w-full text-nmg-secondary/80 hover:text-nmg-secondary transition-colors text-left">
                    8-4-4 System
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-nmg-secondary font-semibold mb-3">Support</h4>
                <div className="space-y-2">
                  <Link href="#" className="block text-nmg-secondary/80 hover:text-nmg-secondary transition-colors">
                    Help Center
                  </Link>
                  <Link href="#" className="block text-nmg-secondary/80 hover:text-nmg-secondary transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right w-full">
              <p className="text-nmg-secondary/80 text-sm mb-2">Powered by Nation Media Group • Roodito</p>
              <p className="text-nmg-secondary/60 text-xs">© 2025 All rights reserved.</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-nmg-accent/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0 items-center w-full md:w-auto">
              <button type="button" onClick={() => (isMobile ? scrollToHome() : scrollToHome())} className="text-nmg-secondary/80 hover:text-nmg-secondary transition-colors">
                Home
              </button>
              <button type="button" onClick={() => (isMobile ? scrollToSectionMobile('cbc') : scrollToSection('cbc'))} className="text-nmg-secondary/80 hover:text-nmg-secondary transition-colors">
                CBC
              </button>
              <button type="button" onClick={() => (isMobile ? scrollToSectionMobile('844') : scrollToSection('844'))} className="text-nmg-secondary/80 hover:text-nmg-secondary transition-colors">
                8-4-4
              </button>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center w-full md:w-auto">
              <Link href="#" className="text-nmg-secondary/80 hover:text-nmg-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-nmg-secondary/80 hover:text-nmg-secondary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 