"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import QuizCard from "./QuizCard"
import type { QuizApiData } from "@/lib/api-service"
import { transformQuizApiData } from "@/lib/api-service"

interface SubjectBlockProps {
  subjectName: string
  grade: string
  system: string
  level: string
  quizzes: QuizApiData[]
  loading?: boolean
}

export default function SubjectBlock({ subjectName, grade, system, level, quizzes, loading }: SubjectBlockProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState(1)
  const quizzesPerPage = 10;

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
        {loading ? (
          <div className="text-center py-4">
            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-nmg-primary inline-block"></span>
            <div className="text-gray-500 mt-2">Loading quizzes...</div>
          </div>
        ) : (
          <>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentPageQuizzes.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-4 text-sm">
              No quizzes available for this grade yet.
            </div>
          ) : (
            currentPageQuizzes.map((quiz, idx) => (
              <a
                key={quiz.id}
                href={quiz.quizLink ? quiz.quizLink : `/quiz/${quiz.id}`}
                target={quiz.quizLink ? '_blank' : undefined}
                rel={quiz.quizLink ? 'noopener noreferrer' : undefined}
                className="text-blue-800 underline font-medium hover:text-blue-600 transition-colors block"
              >
                {quiz.title}
              </a>
            ))
          )}
        </div>
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
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
} 