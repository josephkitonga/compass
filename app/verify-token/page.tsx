'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyTokenPage() {
  const [tokens, setTokens] = useState<{[key: string]: string | null}>({})
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    checkTokens()
  }, [])

  const checkTokens = () => {
    if (typeof window !== 'undefined') {
      const allTokens = {
        'roodito_token': localStorage.getItem('roodito_token'),
        'auth_token': localStorage.getItem('auth_token'),
        'user': localStorage.getItem('user'),
        'guest_session': localStorage.getItem('guest_session'),
      }
      setTokens(allTokens)
      
      // Add to test results
      const results = [`=== Token Check at ${new Date().toLocaleTimeString()} ===`]
      Object.entries(allTokens).forEach(([key, value]) => {
        results.push(`${key}: ${value ? `${value.substring(0, 30)}...` : 'null'}`)
      })
      setTestResults(prev => [...results, ...prev])
    }
  }

  const clearTokens = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      checkTokens()
    }
  }

  const setTestToken = () => {
    if (typeof window !== 'undefined') {
      const testToken = 'C2DXcltGo0Kjj0Clo60pjOESqVl0rfHab8CpsmracUeD2IaM1XgGWOdeCqJT'
      localStorage.setItem('roodito_token', testToken)
      setTestResults(prev => [`Set test token: ${testToken}`, ...prev])
      checkTokens()
    }
  }

  const testQuizUrl = () => {
    if (typeof window !== 'undefined') {
      const baseUrl = 'https://roodito.com/do-quiz/687b5c8e61c37'
      const token = localStorage.getItem('roodito_token')
      
      setTestResults(prev => [`Testing quiz URL generation...`, `Base URL: ${baseUrl}`, `Token: ${token || 'null'}`, ...prev])
      
      if (token) {
        const quizIdMatch = baseUrl.match(/\/do-quiz\/([^/?]+)/)
        const quizId = quizIdMatch ? quizIdMatch[1] : null
        
        setTestResults(prev => [`Extracted quiz ID: ${quizId}`, ...prev])
        
        if (quizId) {
          const finalUrl = `https://roodito.com/do-quiz/${quizId}/${token}`
          setTestResults(prev => [`Generated URL: ${finalUrl}`, ...prev])
          
          // Open the URL
          window.open(finalUrl, '_blank')
          setTestResults(prev => [`Opened URL in new tab`, ...prev])
        }
      } else {
        setTestResults(prev => [`ERROR: No roodito_token found!`, ...prev])
      }
    }
  }

  const simulateLogin = async () => {
    setTestResults(prev => [`Simulating login...`, ...prev])
    
    try {
      const response = await fetch('/api/auth/roodito-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: '254701234567', // Replace with a test number
          password: 'testpassword123'
        })
      })
      
      const data = await response.json()
      setTestResults(prev => [`Login API response: ${JSON.stringify(data)}`, ...prev])
      
      if (data.success && data.token) {
        localStorage.setItem('roodito_token', data.token)
        setTestResults(prev => [`Stored token in localStorage: ${data.token.substring(0, 30)}...`, ...prev])
        checkTokens()
      }
    } catch (error) {
      setTestResults(prev => [`Login error: ${error}`, ...prev])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Verify Token Flow</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(tokens).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <strong>{key}:</strong>
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {value || 'null'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={checkTokens} variant="outline">
                Refresh Tokens
              </Button>
              <Button onClick={clearTokens} variant="destructive">
                Clear All Tokens
              </Button>
              <Button onClick={setTestToken} variant="secondary">
                Set Test Token
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={testQuizUrl} className="bg-blue-500 hover:bg-blue-600">
                Test Quiz URL Generation
              </Button>
              <Button onClick={simulateLogin} className="bg-green-500 hover:bg-green-600">
                Simulate Login (Test)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
              {testResults.length === 0 && (
                <div className="text-gray-500">No test results yet...</div>
              )}
            </div>
            <Button 
              onClick={() => setTestResults([])} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Clear Log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
