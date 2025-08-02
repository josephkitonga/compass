'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  grade?: string
  educationSystem?: string
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
          console.error('Auth check error:', error)
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

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // TODO: Replace with real API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        grade: 'Grade 10',
        educationSystem: 'CBC'
      }
      const mockToken = 'mock_jwt_token_' + Date.now()
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.removeItem('guest_session')
      }
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        isGuest: false
      })
    } catch (error) {
      console.error('Login error:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const register = async (userData: any) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // TODO: Replace with real API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockUser: User = {
        id: '1',
        email: userData.email,
        name: userData.name,
        grade: userData.grade,
        educationSystem: userData.educationSystem
      }
      const mockToken = 'mock_jwt_token_' + Date.now()
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.removeItem('guest_session')
      }
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        isGuest: false
      })
    } catch (error) {
      console.error('Register error:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const loginWithSSO = async (provider: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // TODO: Replace with real SSO implementation
      // const response = await fetch(`/api/auth/${provider}`, {
      //   method: 'GET'
      // })
      
      // Simulate SSO flow
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        grade: 'Grade 10',
        educationSystem: 'CBC',
        provider
      }
      const mockToken = 'mock_sso_token_' + Date.now()
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.removeItem('guest_session')
      }
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        isGuest: false
      })
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
    }
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isGuest: false
    })
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