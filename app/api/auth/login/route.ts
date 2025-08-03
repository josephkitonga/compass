import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Get CSRF token first
    const csrfResponse = await fetch('https://api.roodito.com/api/login', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    
    const cookies = csrfResponse.headers.get('set-cookie')
    const csrfToken = cookies?.match(/XSRF-TOKEN=([^;]+)/)?.[1]
    
    // Forward the request to Roodito API with correct fields
    const response = await fetch('https://api.roodito.com/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `XSRF-TOKEN=${csrfToken}`,
      },
      body: formData,
    })
    
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const errorText = await response.text()
      return NextResponse.json(
        { error: 'Login failed', details: errorText },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Login proxy error:', error)
    return NextResponse.json(
      { error: 'Network error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 