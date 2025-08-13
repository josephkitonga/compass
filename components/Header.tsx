"use client"

import Link from "next/link"
import { Search, Menu, X, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import SearchModal from "./SearchModal"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
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
              src="/compass-press-logo.svg" 
              alt="Compass Press" 
              className="h-8 w-auto"
            />
          </div>
          <Link href="/" className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-900">Revision Portal</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
          <Link 
            href="/"
            className="text-gray-600 hover:text-compass-primary transition-colors font-medium"
          >
            Home
          </Link>
          <Link 
            href="/dashboard#cbc"
            className="text-gray-600 hover:text-compass-primary transition-colors font-medium"
          >
            CBC
          </Link>
          <Link 
            href="/dashboard#844"
            className="text-gray-600 hover:text-compass-primary transition-colors font-medium"
          >
            8-4-4
          </Link>
          <Link 
            href="/dashboard#pricing"
            className="text-gray-600 hover:text-compass-primary transition-colors font-medium"
          >
            Pricing
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.name || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/dashboard"
            className="bg-compass-primary hover:bg-compass-primary/90 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow ml-2"
            style={{ textDecoration: 'none' }}
          >
            Start Revising
          </Link>
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
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left text-gray-600 hover:text-compass-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard#cbc"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left text-gray-600 hover:text-compass-primary transition-colors"
            >
              CBC
            </Link>
            <Link
              href="/dashboard#844"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left text-gray-600 hover:text-compass-primary transition-colors"
            >
              8-4-4
            </Link>
            <Link
              href="/dashboard#pricing"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left text-gray-600 hover:text-compass-primary transition-colors"
            >
              Pricing
            </Link>
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="block w-full text-left text-gray-600 hover:text-compass-primary transition-colors"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/dashboard"
              className="block w-full text-center bg-compass-primary hover:bg-compass-primary/90 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow mt-2"
              style={{ textDecoration: 'none' }}
            >
              Start Revising
            </Link>
          </nav>
        </div>
      )}
    </header>

    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
  </>
  )
} 