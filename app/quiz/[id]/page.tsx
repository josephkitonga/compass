'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { AuthService } from '@/lib/api-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useParams, useSearchParams } from 'next/navigation'

export default function QuizPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const token = searchParams.get('token')
  const { isAuthenticated, user, isLoading } = useAuth()
  const [quizData, setQuizData] = useState<any>(null)
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({})

  // Get the effective token (from URL or localStorage)
  const effectiveToken = token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null)

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoadingQuiz(true)
        setError(null)

        // Validate token if provided
        if (effectiveToken) {
          const isValid = await AuthService.validateToken(effectiveToken)
          if (!isValid) {
            setError('Invalid or expired token. Please sign in again.')
            return
          }
        }

        // Load quiz data (mock for now)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setQuizData({
          id,
          title: `Quiz ${id}`,
          description: 'This is a sample quiz for demonstration.',
          questions: [
            {
              id: 1,
              question: 'What is the capital of Kenya?',
              options: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'],
              correct: 0
            },
            {
              id: 2,
              question: 'Which education system is currently implemented in Kenya?',
              options: ['8-4-4', 'CBC', 'Both', 'Neither'],
              correct: 2
            }
          ]
        })
      } catch (error) {
        console.error('Error loading quiz:', error)
        setError('Failed to load quiz. Please try again.')
      } finally {
        setIsLoadingQuiz(false)
      }
    }

    loadQuiz()
  }, [id, effectiveToken])

  if (isLoading || isLoadingQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading quiz..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Error</CardTitle>
            <CardDescription>
              Unable to access this quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="flex space-x-3">
              <Link href="/auth">
                <Button className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img src="/compass.png" alt="Compass Press Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">Revision Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name || 'User'}
                </span>
              )}
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">{quizData?.title}</h1>
            </div>
            <p className="text-lg text-gray-600">{quizData?.description}</p>
          </div>

          {/* Quiz Questions */}
          <div className="space-y-6">
            {quizData?.questions?.map((question: any, index: number) => (
              <Card key={question.id} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {index + 1}
                  </CardTitle>
                  <CardDescription>
                    {question.question}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {question.options.map((option: string, optionIndex: number) => (
                      <Button
                        key={optionIndex}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-4"
                        onClick={() => {
                          // Handle answer selection
                        }}
                      >
                        <span className="font-medium mr-3">{(optionIndex + 1).toString().padStart(2, '0')}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quiz Actions */}
          <div className="mt-8 flex justify-between items-center">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quizzes
              </Button>
            </Link>
            <Button className="bg-[#002F6C] hover:bg-[#002F6C]/90">
              Submit Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
