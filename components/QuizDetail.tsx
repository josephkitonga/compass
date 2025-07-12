"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle,
  XCircle,
  ArrowLeft,
  Calculator,
  Beaker,
  Globe,
  History,
  Music,
  Palette,
  Book,
  Heart,
  Zap,
  Brain,
  PartyPopper,
  RefreshCw,
  Home
} from "lucide-react"
import Link from "next/link"
import type { Quiz } from "@/lib/data-service"
import { saveQuizResult } from "@/lib/data-service"
import Confetti from "react-confetti"

interface QuizDetailProps {
  quiz: Quiz
  subject: string
  grade: string
  system: string
}

export default function QuizDetail({ quiz, subject, grade, system }: QuizDetailProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<any[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  const subjectIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    "Mathematics": Calculator,
    "Physics": Zap,
    "Chemistry": Beaker,
    "Biology": Heart,
    "Geography": Globe,
    "History": History,
    "English": Book,
    "Literature": BookOpen,
    "Kiswahili": Book,
    "French": Book,
    "German": Book,
    "Arabic": Book,
    "Religious Education": Book,
    "Music": Music,
    "Art": Palette,
    "Computer Studies": Brain,
    "Business Studies": Target,
    "Agriculture": Heart,
    "Home Science": Heart,
    "Physical Education": Zap,
    "Life Skills": Heart,
    "Creative Arts": Palette,
    "Environmental Activities": Globe,
    "Hygiene and Nutrition": Heart,
    "Movement Activities": Zap,
    "Language Activities": Book,
    "Mathematical Activities": Calculator,
    "Psychomotor and Creative Activities": Palette,
    "Religious Education Activities": Book,
    "Social Studies": Globe,
    "Science and Technology": Beaker,
    "Languages": Book,
    "Humanities": Globe,
    "Applied Sciences": Beaker,
    "Technical Subjects": Target,
    "Optional Subjects": Book
  }

  const subjectColors: { [key: string]: string } = {
    "English": "bg-blue-500",
    "Kiswahili": "bg-blue-600",
    "Mathematics": "bg-yellow-500",
    "Science & Technology": "bg-green-500",
    "Integrated Science": "bg-green-600",
    "Biology": "bg-green-700",
    "Physics": "bg-purple-500",
    "Chemistry": "bg-indigo-500",
    "Social Studies": "bg-orange-500",
    "History": "bg-red-500",
    "Geography": "bg-teal-500",
    "Creative Arts": "bg-pink-500",
    "Creative Arts & Sports": "bg-pink-600",
    "Religious Education": "bg-purple-600",
    "Computer Science": "bg-gray-600",
    "Agriculture": "bg-green-800",
    "Business Studies": "bg-blue-700",
    "Home Science": "bg-rose-500",
    "Art": "bg-pink-400",
    "Languages": "bg-blue-400"
  }

  const difficultyColors: { [key: string]: string } = {
    "Easy": "bg-green-100 text-green-800",
    "Medium": "bg-yellow-100 text-yellow-800",
    "Hard": "bg-red-100 text-red-800"
  }

  const IconComponent = subjectIcons[subject] || BookOpen
  const subjectColor = subjectColors[subject] || "bg-gray-500"
  const difficultyColor = difficultyColors[quiz.difficulty] || "bg-gray-100 text-gray-800"

  // Helper to get questions array or fallback
  const questionsArr = Array.isArray(quiz.questions) ? quiz.questions : []

  // Handle answer selection
  const handleAnswer = (answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion]: answer }))
  }

  // Handle next question or finish
  const handleNext = async () => {
    if (currentQuestion < questionsArr.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Calculate score
      let correct = 0
      const resultsArr = questionsArr.map((q: any, idx: number) => {
        const userAnswer = selectedAnswers[idx]
        const isCorrect = userAnswer === q.answer
        if (isCorrect) correct++
        return {
          question: q.question,
          correctAnswer: q.answer,
          userAnswer,
          isCorrect,
          explanation: q.explanation
        }
      })
      setScore(correct)
      setResults(resultsArr)
      setShowResults(true)
      // Save result (placeholder for backend)
      await saveQuizResult({
        quizId: quiz.id,
        subject,
        grade,
        system,
        score: correct,
        total: questionsArr.length,
        answers: selectedAnswers
      })
    }
  }

  useEffect(() => {
    if (showResults) {
      const percent = Math.round((score / questionsArr.length) * 100)
      const passed = percent >= 60
      setShowConfetti(passed)
    } else {
      setShowConfetti(false)
    }
  }, [showResults, score, questionsArr.length])

  if (!Array.isArray(quiz.questions)) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Fully Implemented</CardTitle>
                <div className="text-lg text-gray-700 mb-4">This quiz does not have questions yet. Please check back later.</div>
              </CardHeader>
              <CardContent>
                <Link href="/" className="bg-nmg-primary text-white px-6 py-2 rounded-lg hover:bg-nmg-primary/90">Back to Home</Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    const percent = Math.round((score / questionsArr.length) * 100)
    const passed = percent >= 60
    const correct = score
    const incorrect = questionsArr.length - score
    const recommendation = passed
      ? "Great job! You passed. Try another quiz or review your answers."
      : "Don't worry! Review your mistakes and try again."

    // For demo, fake time taken
    const timeTaken = `${questionsArr.length * 0.7} min`

    return (
      <div className="min-h-screen bg-gradient-to-br from-nmg-primary/10 to-nmg-accent/10 py-8 relative">
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} recycle={false} />}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-2xl border-2 border-nmg-primary">
              <CardHeader>
                <CardTitle className="text-3xl font-extrabold text-nmg-primary mb-2 flex items-center gap-2">
                  {passed ? <CheckCircle className="text-green-500 h-7 w-7 animate-bounce" /> : <XCircle className="text-red-500 h-7 w-7 animate-bounce" />}
                  {passed ? "Congratulations!" : "Keep Practicing!"}
                </CardTitle>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-5xl font-black text-gray-900 animate-pulse">{percent}%</div>
                  <Progress value={percent} className="h-4 mt-2 bg-gray-200" />
                  <div className="mt-2">
                    <Badge className={passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {passed ? "Passed" : "Try Again"}
                    </Badge>
                  </div>
                  <div className="text-lg text-gray-700 mt-2 font-medium">{recommendation}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-green-600">{correct}</span>
                    <span className="text-sm text-gray-600">Correct</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-red-600">{incorrect}</span>
                    <span className="text-sm text-gray-600">Incorrect</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-blue-600">{questionsArr.length}</span>
                    <span className="text-sm text-gray-600">Total</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-purple-600">{timeTaken}</span>
                    <span className="text-sm text-gray-600">Time</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button onClick={() => window.location.reload()} className="bg-nmg-accent text-white flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" /> Retake Quiz
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="flex items-center gap-2 border-nmg-primary text-nmg-primary">
                      <Home className="h-4 w-4" /> Back to Home
                    </Button>
                  </Link>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Review Answers</h3>
                  <div className="space-y-4">
                    {results.map((res, idx) => (
                      <div key={idx} className={`p-4 rounded-lg ${res.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}> 
                        <div className="font-semibold text-gray-900">Q{idx + 1}: {res.question}</div>
                        <div className="mt-1 text-sm">Your answer: <span className={res.isCorrect ? 'text-green-700' : 'text-red-700'}>{res.userAnswer || 'No answer'}</span></div>
                        {!res.isCorrect && (
                          <div className="text-sm text-gray-700">Correct answer: <span className="font-semibold">{res.correctAnswer}</span></div>
                        )}
                        {res.explanation && (
                          <div className="text-xs text-gray-500 mt-1">Explanation: {res.explanation}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Quiz-taking UI
  const q = questionsArr[currentQuestion]
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</CardTitle>
              <div className="text-gray-700 mb-2">Question {currentQuestion + 1} of {questionsArr.length}</div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 font-semibold">{q?.question}</div>
              <div className="space-y-2">
                {q?.options?.map((opt: string, idx: number) => (
                  <Button
                    key={idx}
                    variant={selectedAnswers[currentQuestion] === opt ? 'default' : 'outline'}
                    className="w-full text-left"
                    onClick={() => handleAnswer(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] == null}
                  className="bg-nmg-primary text-white"
                >
                  {currentQuestion === questionsArr.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 