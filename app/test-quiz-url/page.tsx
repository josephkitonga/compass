'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

export default function TestQuizUrlPage() {
  const { isAuthenticated, user } = useAuth()
  const [token, setToken] = useState<string | null>(null)
  const [generatedUrls, setGeneratedUrls] = useState<any[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      setToken(storedToken)
    }
  }, [])

  const testQuizUrl = () => {
    const baseUrl = 'https://roodito.com/do-quiz/687b5c8e61c37'
    const formats = [
      { name: 'api_token', url: `${baseUrl}?api_token=${token}` },
      { name: 'token', url: `${baseUrl}?token=${token}` },
      { name: 'auth_token', url: `${baseUrl}?auth_token=${token}` },
      { name: 'access_token', url: `${baseUrl}?access_token=${token}` },
      { name: 'user_token', url: `${baseUrl}?user_token=${token}` },
      { name: 'bearer_token', url: `${baseUrl}?bearer_token=${token}` }
    ]
    
    setGeneratedUrls(formats)
    console.log('Testing URLs:', formats)
  }

  const openUrl = (url: string, format: string) => {
    console.log(`Opening ${format}:`, url)
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Quiz URL Test</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user?.name || 'None'}</p>
              <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</p>
              <p><strong>Token Length:</strong> {token?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Quiz URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testQuizUrl} className="mb-4">
              Generate Test URLs
            </Button>
            
            {generatedUrls.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Generated URLs:</h3>
                {generatedUrls.map((format, index) => (
                  <div key={index} className="border p-4 rounded">
                    <p className="font-medium mb-2">{format.name}:</p>
                    <p className="text-sm text-gray-600 mb-2 break-all">{format.url}</p>
                    <Button 
                      size="sm" 
                      onClick={() => openUrl(format.url, format.name)}
                    >
                      Test {format.name}
                    </Button>
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