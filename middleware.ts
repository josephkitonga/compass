import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings'
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth',
  '/login',
  '/register'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  // Get auth token from cookies or headers
  const authToken = request.cookies.get('auth_token')?.value || 
                   request.headers.get('authorization')?.replace('Bearer ', '')
  
  // Get guest session from cookies
  const guestSession = request.cookies.get('guest_session')?.value
  
  // If it's a protected route and no auth token, redirect to auth
  if (isProtectedRoute && !authToken && !guestSession) {
    const authUrl = new URL('/auth', request.url)
    authUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(authUrl)
  }
  
  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (isPublicRoute && pathname.startsWith('/auth') && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Add auth headers to API requests
  if (pathname.startsWith('/api/') && authToken) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('authorization', `Bearer ${authToken}`)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 