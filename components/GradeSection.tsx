"use client"

import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, ChevronDown } from "lucide-react"
import SubjectBlock from "./SubjectBlock"
import type { QuizApiData } from "@/lib/api-service"

interface GradeSectionProps {
  title: string
  data: { [grade: string]: QuizApiData[] }
  system: string
  level: string
  loading?: boolean
}

export default function GradeSection({ title, data, system, level, loading }: GradeSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-nmg-accent text-white">
              <span className="font-bold text-sm">
                {(() => {
                  // If the title is a number (grade), show the number
                  if (!isNaN(Number(title))) return title;
                  // If the title is a known level, show abbreviation
                  if (title === 'Upper Primary') return 'UP';
                  if (title === 'Junior Secondary') return 'JS';
                  if (title === 'Senior Secondary') return 'SS';
                  // Fallback: first character
                  return title.charAt(0);
                })()}
              </span>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
              <p className="text-sm text-gray-600">
                {system === 'CBC' ? (
                  title === 'Upper Primary' ? 'Grades 4, 5, 6' :
                  title === 'Junior Secondary' ? 'Grades 7, 8, 9' :
                  title === 'Senior Secondary' ? 'Grades 10, 11, 12' :
                  `${Object.keys(data || {}).length} ${Object.keys(data || {}).length === 1 ? 'grade' : 'grades'}`
                ) : (
                  title === 'Secondary' ? 'Forms 2, 3, 4' :
                  `${Object.keys(data || {}).length} ${Object.keys(data || {}).length === 1 ? 'subject' : 'subjects'}`
                )}
              </p>
            </div>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-3 space-y-3">
        {loading ? (
          <div className="text-center py-6">
            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-nmg-primary inline-block"></span>
            <div className="text-gray-500 mt-2">Loading quizzes...</div>
          </div>
        ) : (
          Object.entries(data || {}).map(([subjectKey, subjectData]) => {
            return (
              <SubjectBlock
                key={subjectKey}
                subjectName={subjectKey}
                grade={title}
                system={system}
                level={level}
                quizzes={subjectData}
                loading={loading}
              />
            )
          })
        )}
      </CollapsibleContent>
    </Collapsible>
  )
} 