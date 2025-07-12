"use client"

import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, ChevronDown } from "lucide-react"
import SubjectBlock from "./SubjectBlock"
import type { GradeData } from "@/lib/data-service"

interface GradeSectionProps {
  title: string
  data: GradeData
  system: string
  level: string
}

export default function GradeSection({ title, data, system, level }: GradeSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-nmg-accent text-white">
              <span className="font-bold text-sm">{title.charAt(0)}</span>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
              <p className="text-sm text-gray-600">{Object.keys(data || {}).length} subjects</p>
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
        {Object.entries(data || {}).map(([subjectKey, subjectData]) => {
          // subjectData is always Quiz[]
          const quizzes = Array.isArray(subjectData) ? subjectData : [];
          return (
            <SubjectBlock
              key={subjectKey}
              subjectName={subjectKey}
              quizzes={quizzes}
              grade={title}
              system={system}
              level={level}
            />
          )
        })}
      </CollapsibleContent>
    </Collapsible>
  )
} 