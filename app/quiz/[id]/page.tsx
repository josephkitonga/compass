"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import QuizDetail from "@/components/QuizDetail"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ScrollToTop from "@/components/ScrollToTop"
import { findQuizById } from "@/lib/data-service"
import type { ApiQuiz } from "@/lib/data-service"

export default function QuizDetailPage() {
  const params = useParams()
  const quizId = params.id as string
  const [quiz, setQuiz] = useState<ApiQuiz | null>(null)
  const [subject, setSubject] = useState("")
  const [grade, setGrade] = useState("")
  const [system, setSystem] = useState("")
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true)
        const result = await findQuizById(quizId)
        if (result && result.quiz) {
          setQuiz(result.quiz)
          setSubject(result.subject)
          setGrade(result.grade)
          setSystem(result.system)
          setNotFound(false)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Failed to load quiz:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [quizId])

  // Handle external quiz redirection
  useEffect(() => {
    if (quiz?.quizLink) {
      // If quiz has an external link, redirect to it
      window.open(quiz.quizLink, '_blank')
      // Navigate back to home after a short delay
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    }
  }, [quiz])

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
            <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist.</p>
            <Link href="/" className="bg-nmg-primary text-white px-6 py-2 rounded-lg hover:bg-nmg-primary/90">
                Back to Home
              </Link>
            </div>
          </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002F6C] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quiz details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
            <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist.</p>
            <Link href="/" className="bg-nmg-primary text-white px-6 py-2 rounded-lg hover:bg-nmg-primary/90">
                Back to Home
              </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <QuizDetail 
        quiz={quiz}
        subject={subject}
        grade={grade}
        system={system}
      />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
