import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const { provider } = params
  const { searchParams } = new URL(request.url)
  
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  
  // Check for OAuth errors
  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth?error=${encodeURIComponent(error)}`
    )
  }
  
  // Verify state parameter
  const storedState = request.cookies.get('oauth_state')?.value
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth?error=invalid_state`
    )
  }
  
  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth?error=no_code`
    )
  }
  
  try {
    // For now, simulate successful OAuth
    // In production, you would exchange the code for tokens here
    
    // Generate a secure token
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2)
    const token = `roodito_${timestamp}_${random}`
    
    // Create user data
    const userData = {
      id: '1',
      email: `${provider}@example.com`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      grade: 'Grade 10',
      educationSystem: 'CBC',
      provider
    }
    
    // Redirect to dashboard with token
    const redirectUrl = new URL('/dashboard', request.url)
    redirectUrl.searchParams.set('token', token)
    redirectUrl.searchParams.set('user', JSON.stringify(userData))
    
    const response = NextResponse.redirect(redirectUrl)
    
    // Clear the OAuth state cookie
    response.cookies.delete('oauth_state')
    
    return response
    
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth?error=oauth_failed`
    )
  }
} 