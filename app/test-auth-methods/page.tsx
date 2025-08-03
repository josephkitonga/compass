'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuthMethodsPage() {
  const [token, setToken] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      setToken(storedToken)
    }
  }, [])

  const testAuthMethods = async () => {
    const baseUrl = 'https://roodito.com/do-quiz/687b5c8e61c37'
    const results = []

    // Test 1: URL Token Parameters
    const urlTests = [
      `${baseUrl}?api_token=${token}`,
      `${baseUrl}?token=${token}`,
      `${baseUrl}?auth_token=${token}`,
      `${baseUrl}?access_token=${token}`,
      `${baseUrl}?user_token=${token}`,
      `${baseUrl}?bearer_token=${token}`
    ]

    for (const url of urlTests) {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors'
        })
        results.push({
          method: 'URL Parameter',
          url,
          status: 'Tested (no-cors)'
        })
      } catch (error) {
        results.push({
          method: 'URL Parameter',
          url,
          status: 'Error'
        })
      }
    }

    // Test 2: Authorization Header
    try {
      const response = await fetch(baseUrl, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        mode: 'no-cors'
      })
      results.push({
        method: 'Authorization Header',
        header: `Bearer ${token}`,
        status: 'Tested (no-cors)'
      })
    } catch (error) {
      results.push({
        method: 'Authorization Header',
        header: `Bearer ${token}`,
        status: 'Error'
      })
    }

    // Test 3: Custom Headers
    const headerTests = [
      { name: 'X-API-Token', value: token },
      { name: 'X-Auth-Token', value: token },
      { name: 'X-User-Token', value: token },
      { name: 'X-Access-Token', value: token }
    ]

    for (const header of headerTests) {
      try {
        const response = await fetch(baseUrl, {
          method: 'HEAD',
          headers: {
            [header.name]: header.value || '',
            'Accept': 'application/json'
          },
          mode: 'no-cors'
        })
        results.push({
          method: 'Custom Header',
          header: `${header.name}: ${header.value}`,
          status: 'Tested (no-cors)'
        })
      } catch (error) {
        results.push({
          method: 'Custom Header',
          header: `${header.name}: ${header.value}`,
          status: 'Error'
        })
      }
    }

    setResults(results)
  }

  const openUrlTest = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Method Test</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Token</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</p>
              <p><strong>Length:</strong> {token?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Authentication Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testAuthMethods} className="mb-4">
              Test All Methods
            </Button>
            
            {results.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Test Results:</h3>
                {results.map((result, index) => (
                  <div key={index} className="border p-4 rounded">
                    <p className="font-medium mb-2">{result.method}:</p>
                    <p className="text-sm text-gray-600 mb-2 break-all">
                      {result.url || result.header}
                    </p>
                    <p className="text-sm text-gray-500">Status: {result.status}</p>
                    {result.url && (
                      <Button 
                        size="sm" 
                        onClick={() => openUrlTest(result.url)}
                        className="mt-2"
                      >
                        Test URL
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 