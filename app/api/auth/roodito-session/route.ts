import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password } = body
    
    // Use form data format like the working curl command
    const formData = new FormData()
    formData.append('identifier', identifier)
    formData.append('password', password)
    
    const loginResponse = await fetch('https://api.roodito.com/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData
    })
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      
      // Extract token from response - it's in data.api_token
      const token = loginData.data?.api_token || loginData.data?.token || loginData.token
      
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: loginData.data?.user || loginData.user
      })
    } else {
      const errorText = await loginResponse.text()
      return NextResponse.json(
        { success: false, error: 'Login failed', details: errorText },
        { status: loginResponse.status }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Network error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 