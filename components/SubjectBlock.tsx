"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import QuizCard from "./QuizCard"
import type { QuizApiData } from "@/lib/api-service"
import { transformQuizApiData } from "@/lib/api-service"
import { getPaginatedQuizApiData } from "@/lib/data-service"

interface SubjectBlockProps {
  subjectName: string
  grade: string
  system: string
  level: string
}

// Type guard for QuizApiData
function isQuizApiData(q: any): q is QuizApiData {
  return q && typeof q === 'object' &&
    typeof q.quiz_id === 'string' &&
    typeof q.number_of_question === 'string' &&
    typeof q.quiz_link === 'string' &&
    typeof q.quiz_type === 'string';
}

export default function SubjectBlock({ subjectName, grade, system, level }: SubjectBlockProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [quizzes, setQuizzes] = useState<QuizApiData[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const quizzesPerPage = 10;

  // Fetch quizzes for this subject/grade/level/system, paginated
  useEffect(() => {
    setQuizzes([])
    setPage(1)
    setHasMore(true)
  }, [subjectName, grade, system, level])

  useEffect(() => {
    let ignore = false
    const fetchQuizzes = async () => {
      setLoading(true)
      const { quizzes: newQuizzes, pagination } = await getPaginatedQuizApiData(page, quizzesPerPage, {
        subject: subjectName,
        grade,
        level,
      })
      if (!ignore) {
        // Only append items that pass isQuizApiData and are not already in quizzes (by quiz_id)
        setQuizzes(prev => {
          const existingIds = new Set(prev.map(q => q.quiz_id))
          return [
            ...prev,
            ...newQuizzes.filter(isQuizApiData).filter(q => !existingIds.has(q.quiz_id))
          ]
        })
        setHasMore(page < (pagination?.total_pages || 1))
        setLoading(false)
      }
    }
    fetchQuizzes()
    return () => { ignore = true }
  }, [page, subjectName, grade, level])

  // Transform and deduplicate quizzes for display
  const transformedQuizzes = quizzes.map(transformQuizApiData)
  const uniqueQuizzes = Array.from(
    new Map(transformedQuizzes.map(q => [q.id, q])).values()
  )
  // Pagination logic
  const totalQuizzes = uniqueQuizzes.length;
  const totalPages = Math.ceil(totalQuizzes / quizzesPerPage);
  const currentPageQuizzes = uniqueQuizzes.slice((page - 1) * quizzesPerPage, page * quizzesPerPage);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-200">
              <span className="text-xs font-medium text-gray-600">{subjectName.charAt(0)}</span>
            </div>
            <h5 className="text-base font-medium text-gray-900">{subjectName}</h5>
            <span className="text-sm text-gray-500">({totalQuizzes} quizzes)</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-3">
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentPageQuizzes.map((quiz, idx) => (
            <a
              key={quiz.id}
              href={quiz.quizLink ? quiz.quizLink : `/quiz/${quiz.id}`}
              target={quiz.quizLink ? '_blank' : undefined}
              rel={quiz.quizLink ? 'noopener noreferrer' : undefined}
              className="text-blue-800 underline font-medium hover:text-blue-600 transition-colors block"
            >
              {`Quiz ${(page - 1) * quizzesPerPage + idx + 1}`}
            </a>
          ))}
        </div>
        {loading && <div className="text-center py-2"><span className="animate-spin rounded-full h-6 w-6 border-b-2 border-nmg-primary inline-block"></span></div>}
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
} 