'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

export default function DebugTokensPage() {
  const { isAuthenticated, user } = useAuth()
  const [tokens, setTokens] = useState<{[key: string]: string | null}>({})
  const [testUrl, setTestUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTokens({
        'auth_token': localStorage.getItem('auth_token'),
        'roodito_token': localStorage.getItem('roodito_token'),
        'user': localStorage.getItem('user'),
        'guest_session': localStorage.getItem('guest_session'),
      })
    }
  }, [])

  const refreshTokens = () => {
    if (typeof window !== 'undefined') {
      setTokens({
        'auth_token': localStorage.getItem('auth_token'),
        'roodito_token': localStorage.getItem('roodito_token'),
        'user': localStorage.getItem('user'),
        'guest_session': localStorage.getItem('guest_session'),
      })
    }
  }

  const clearAllTokens = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      refreshTokens()
    }
  }

  const setMockRooditoToken = () => {
    if (typeof window !== 'undefined') {
      const mockToken = 'C2DXcltGo0Kjj0Clo60pjOESqVl0rfHab8CpsmracUeD2IaM1XgGWOdeCqJT'
      localStorage.setItem('roodito_token', mockToken)
      refreshTokens()
    }
  }

  const testQuizUrl = () => {
    const baseUrl = 'https://roodito.com/do-quiz/687b5c8e61c37'
    const rooditoToken = localStorage.getItem('roodito_token')
    
    if (rooditoToken) {
      // Extract quiz ID from the URL
      const quizIdMatch = baseUrl.match(/\/do-quiz\/([^/?]+)/)
      const quizId = quizIdMatch ? quizIdMatch[1] : null
      
      if (quizId) {
        const finalUrl = `https://roodito.com/do-quiz/${quizId}/${rooditoToken}`
        setTestUrl(finalUrl)
        window.open(finalUrl, '_blank')
      }
    } else {
      alert('No roodito_token found in localStorage!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Tokens</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user?.name || 'None'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>LocalStorage Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(tokens).map(([key, value]) => (
                <div key={key} className="border p-4 rounded">
                  <p className="font-medium">{key}:</p>
                  <p className="text-sm text-gray-600 break-all">
                    {value ? (value.length > 50 ? `${value.substring(0, 50)}...` : value) : 'null'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Length: {value?.length || 0}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={refreshTokens} variant="outline">
                Refresh Tokens
              </Button>
              <Button onClick={clearAllTokens} variant="destructive">
                Clear All Tokens
              </Button>
              <Button onClick={setMockRooditoToken} variant="secondary">
                Set Mock Roodito Token
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Quiz URL Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testQuizUrl} className="mb-4">
              Generate & Test Quiz URL
            </Button>
            
            {testUrl && (
              <div className="border p-4 rounded">
                <p className="font-medium mb-2">Generated URL:</p>
                <p className="text-sm text-gray-600 break-all mb-2">{testUrl}</p>
                <Button 
                  size="sm" 
                  onClick={() => window.open(testUrl, '_blank')}
                >
                  Open URL
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
