'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import LoadingSpinner from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowGuest?: boolean
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  allowGuest = false 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isGuest } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      // If authentication is required but user is not authenticated
      if (requireAuth && !isAuthenticated && !isGuest) {
        router.push('/auth?redirect=' + encodeURIComponent(window.location.pathname))
        return
      }

      // If guest access is not allowed but user is in guest mode
      if (!allowGuest && isGuest) {
        router.push('/auth?message=Please sign in to access this feature')
        return
      }

      // If user is authenticated and trying to access auth pages
      if (isAuthenticated && window.location.pathname.startsWith('/auth')) {
        router.push('/dashboard')
        return
      }
    }
  }, [isAuthenticated, isLoading, isGuest, requireAuth, allowGuest, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If authentication is required but user is not authenticated, show loading
  if (requireAuth && !isAuthenticated && !isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If guest access is not allowed but user is in guest mode, show loading
  if (!allowGuest && isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
} 