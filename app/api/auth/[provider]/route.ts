import { NextRequest, NextResponse } from 'next/server'

// OAuth configuration
const OAUTH_CONFIG = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`,
    authUrl: 'https://accounts.google.com/oauth/authorize',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
  },
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID || 'your-microsoft-client-id',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || 'your-microsoft-client-secret',
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/microsoft/callback`,
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me'
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || 'your-github-client-id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'your-github-client-secret',
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/github/callback`,
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const { provider } = params
  
  if (!OAUTH_CONFIG[provider as keyof typeof OAUTH_CONFIG]) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  }
  
  const config = OAUTH_CONFIG[provider as keyof typeof OAUTH_CONFIG]
  
  // Generate state parameter for security
  const state = Math.random().toString(36).substring(2)
  
  // Store state in session/cookie for verification
  const response = NextResponse.redirect(
    `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=openid%20email%20profile&state=${state}`
  )
  
  // Set state cookie
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  })
  
  return response
} 