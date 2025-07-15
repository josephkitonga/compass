"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import QuizCard from "./QuizCard"
import type { QuizApiData } from "@/lib/api-service"
import { transformQuizApiData } from "@/lib/api-service"

interface SubjectBlockProps {
  subjectName: string
  quizzes: QuizApiData[]
  grade: string
  system: string
  level: string
}

export default function SubjectBlock({ subjectName, quizzes, grade, system, level }: SubjectBlockProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Ensure quizzes is an array and transform to the format expected by QuizCard
  const quizzesArray = Array.isArray(quizzes) ? quizzes : []
  const transformedQuizzes = quizzesArray.map(transformQuizApiData)

  // Filter out duplicate quiz IDs
  const uniqueQuizzes = Array.from(
    new Map(transformedQuizzes.map(q => [q.id, q])).values()
  )

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-200">
              <span className="text-xs font-medium text-gray-600">{subjectName.charAt(0)}</span>
            </div>
            <h5 className="text-base font-medium text-gray-900">{subjectName}</h5>
            <span className="text-sm text-gray-500">({quizzesArray.length} quizzes)</span>
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
          {uniqueQuizzes.map((quiz, idx) => (
            <a
              key={quiz.id}
              href={quiz.quizLink ? quiz.quizLink : `/quiz/${quiz.id}`}
              target={quiz.quizLink ? '_blank' : undefined}
              rel={quiz.quizLink ? 'noopener noreferrer' : undefined}
              className="text-blue-800 underline font-medium hover:text-blue-600 transition-colors block"
            >
              {`Quiz ${idx + 1}`}
            </a>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
} 