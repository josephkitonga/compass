"use client"

import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, ChevronDown } from "lucide-react"
import GradeSection from "./GradeSection"
import type { QuizApiData } from "@/lib/api-service"

interface AccordionSectionProps {
  title: string
  description?: string
  system: string
  data: { [level: string]: { [grade: string]: QuizApiData[] } }
  loading?: boolean
}

export default function AccordionSection({ title, description, system, data, loading }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Count total quizzes in this section
  const totalQuizzes = Object.values(data || {}).reduce((levelTotal, grades) => {
    return levelTotal + Object.values(grades).reduce((gradeTotal, quizzes) => {
      return gradeTotal + quizzes.length
    }, 0)
  }, 0)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-nmg-primary text-white">
              <span className="font-bold text-lg">{system === "CBC" ? "C" : "8"}</span>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
              {loading ? (
                <p className="text-xs text-blue-600 mt-1">Loading quizzes...</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  {totalQuizzes} {totalQuizzes === 1 ? 'quiz' : 'quizzes'} available
                </p>
              )}
            </div>
          </div>
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-4">
        {Object.entries(data || {}).length === 0 ? (
          <div className="text-center text-gray-400 py-4 text-sm">
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-nmg-primary"></div>
                <span>Loading quizzes...</span>
              </div>
            ) : (
              "No quizzes available for this level yet."
            )}
          </div>
        ) : (
          Object.entries(data || {}).map(([levelKey, levelData]) => (
            <GradeSection
              key={levelKey}
              title={levelKey}
              data={levelData}
              system={system}
              level={levelKey}
            />
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  )
} 