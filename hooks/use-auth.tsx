'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { AuthService } from '@/lib/api-service'

interface User {
  id: string
  email: string
  name: string
  lastName?: string
  phone?: string
  dob?: string
  provider?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isGuest: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  loginWithSSO: (provider: string) => Promise<void>
  logout: () => void
  setGuestMode: () => void
  clearGuestMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isGuest: false
  })

  // Check authentication status on mount
  useEffect(() => {
    // Delay the auth check to ensure we're fully hydrated
    const timer = setTimeout(() => {
      const checkAuth = () => {
        try {
          // Check if we're in the browser
          if (typeof window === 'undefined') return
          
          const token = localStorage.getItem('auth_token')
          const user = localStorage.getItem('user')
          const guestSession = localStorage.getItem('guest_session')
          
          if (guestSession) {
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isGuest: true
            })
            return
          }
          
          if (token && user) {
            // TODO: Validate token with backend
            // const response = await fetch('/api/auth/validate', {
            //   headers: { Authorization: `Bearer ${token}` }
            // })
            // if (response.ok) {
            //   setAuthState({
            //     user: JSON.parse(user),
            //     isAuthenticated: true,
            //     isLoading: false,
            //     isGuest: false
            //   })
            //   return
            // }
            
            // For now, simulate valid session
            setAuthState({
              user: JSON.parse(user),
              isAuthenticated: true,
              isLoading: false,
              isGuest: false
            })
          } else {
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isGuest: false
            })
          }
        } catch (error) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            localStorage.removeItem('guest_session')
          }
          
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isGuest: false
          })
        }
      }

      checkAuth()
    }, 100) // Small delay to ensure hydration is complete

    return () => clearTimeout(timer)
  }, [])

  const login = async (identifier: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const loginResponse = await fetch('/api/auth/roodito-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password })
      })
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json()
        
        // Store token in localStorage for quiz access
        if (loginData.token && typeof window !== 'undefined') {
          localStorage.setItem('roodito_token', loginData.token)
        }
        
        // Create user object
        const user: User = {
          id: '1',
          email: identifier,
          name: identifier,
          lastName: '',
          phone: identifier,
          dob: '1990-01-01'
        }
        
        // Generate a token for our app
        const token = `web_session_${Date.now()}`
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token)
          localStorage.setItem('user', JSON.stringify(user))
          localStorage.removeItem('guest_session')
        }
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          isGuest: false
        })
        
        window.location.href = '/dashboard'
      } else {
        const errorText = await loginResponse.text()
        
        // Parse error response
        let errorMessage = 'Login failed'
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        throw new Error(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      throw new Error(errorMessage)
    }
  }

  const register = async (userData: any) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // Format phone number for Kenyan format
      const cleanPhone = userData.identifier.replace(/\D/g, '')
      const formattedPhone = cleanPhone.startsWith('254') ? cleanPhone : 
                           cleanPhone.startsWith('0') ? '254' + cleanPhone.substring(1) : 
                           cleanPhone
      
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          identifier: formattedPhone
        })
      })
      
      if (registerResponse.ok) {
        const registerData = await registerResponse.json()
        
        // After successful registration, login to get token
        // Use the formatted phone number for login
        const loginResponse = await fetch('/api/auth/roodito-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            identifier: formattedPhone, // Use the formatted phone number
            password: userData.password 
          })
        })
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json()
          
          // Store token in localStorage for quiz access
          if (loginData.token && typeof window !== 'undefined') {
            localStorage.setItem('roodito_token', loginData.token)
          }
          
          // Create user object
          const user: User = {
            id: registerData.data?.id?.toString() || '1',
            email: userData.email,
            name: userData.name,
            lastName: userData.lastName || '',
            phone: userData.identifier,
            dob: userData.dob || '1990-01-01'
          }
          
          // Generate a token for our app
          const token = `web_session_${Date.now()}`
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token)
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.removeItem('guest_session')
          }
          
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            isGuest: false
          })
          
          window.location.href = '/dashboard'
        } else {
          const errorText = await loginResponse.text()
          throw new Error('Registration successful but login failed')
        }
      } else {
        const errorText = await registerResponse.text()
        
        // Parse error response
        let errorMessage = 'Registration failed'
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        throw new Error(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      throw new Error(errorMessage)
    }
  }

    const loginWithSSO = async (provider: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // For now, simulate SSO with secure token
      // In production, this would integrate with real OAuth providers
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2)
      const token = `roodito_sso_${timestamp}_${random}`
      
      const mockUser: User = {
        id: '1',
        email: `${provider}@example.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        lastName: '',
        phone: `${provider}@example.com`,
        dob: '1990-01-01',
        provider
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.removeItem('guest_session')
      }
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        isGuest: false
      })
      
      // Redirect to dashboard after successful SSO
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('SSO error:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('guest_session')
      localStorage.removeItem('guest_timestamp')
      localStorage.removeItem('roodito_token') // Clear Roodito token on logout
    }
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isGuest: false
    })
    
    // Redirect to home after logout
    window.location.href = '/'
  }

  const setGuestMode = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest_session', 'true')
      localStorage.setItem('guest_timestamp', Date.now().toString())
    }
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isGuest: true
    })
    
    window.location.href = '/dashboard'
  }

  const clearGuestMode = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guest_session')
      localStorage.removeItem('guest_timestamp')
    }
    
    setAuthState(prev => ({
      ...prev,
      isGuest: false
    }))
  }

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    loginWithSSO,
    logout,
    setGuestMode,
    clearGuestMode
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 