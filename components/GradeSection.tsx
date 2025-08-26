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

  // Get all expected grades for this level
  const getExpectedGrades = () => {
    if (system === 'CBC') {
      if (level === 'Upper Primary') {
        return ['4', '5', '6']
      } else if (level === 'Junior Secondary') {
        return ['7', '8', '9']
      } else if (level === 'Senior Secondary') {
        return ['10', '11', '12']
      }
    } else if (system === '844') {
      if (level === 'Secondary') {
        return ['Form 2', 'Form 3', 'Form 4']
      }
    }
    return Object.keys(data || {})
  }

  // Get all expected subjects for this level
  const getExpectedSubjects = () => {
    if (system === 'CBC') {
      if (level === 'Upper Primary') {
        return ['Mathematics', 'English', 'Science', 'Social Studies', 'Kiswahili', 'Creative Arts', 'Physical Education']
      } else if (level === 'Junior Secondary') {
        return ['Mathematics', 'English', 'Science', 'Social Studies', 'Kiswahili', 'Creative Arts', 'Physical Education', 'Business Studies', 'Computer Studies']
      } else if (level === 'Senior Secondary') {
        return ['Mathematics', 'English', 'Biology', 'Chemistry', 'Physics', 'Geography', 'History', 'Kiswahili', 'Business Studies', 'Computer Studies', 'Agriculture', 'Economics']
      }
    } else if (system === '844') {
      if (level === 'Secondary') {
        return ['Mathematics', 'English', 'Biology', 'Chemistry', 'Physics', 'Geography', 'History', 'Kiswahili', 'Business Studies', 'Computer Studies', 'Agriculture', 'Economics']
      }
    }
    return ['General']
  }

  const expectedGrades = getExpectedGrades()
  const expectedSubjects = getExpectedSubjects()

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
                  `${expectedGrades.length} ${expectedGrades.length === 1 ? 'grade' : 'grades'}`
                ) : (
                  title === 'Secondary' ? 'Forms 2, 3, 4' :
                  `${expectedGrades.length} ${expectedGrades.length === 1 ? 'subject' : 'subjects'}`
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
          expectedGrades.map((gradeKey) => {
            const gradeData = data[gradeKey] || []
            
            // Group subjects by availability
            const availableSubjects = expectedSubjects.filter(subjectName => {
              const subjectQuizzes = gradeData.filter(quiz => quiz.subject === subjectName) || []
              return subjectQuizzes.length > 0
            })
            
            const comingSoonSubjects = expectedSubjects.filter(subjectName => {
              const subjectQuizzes = gradeData.filter(quiz => quiz.subject === subjectName) || []
              return subjectQuizzes.length === 0
            })
            
            return (
              <div key={gradeKey} className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-700 ml-2 border-l-4 border-nmg-primary pl-3">
                  {system === '844' ? gradeKey : `Grade ${gradeKey}`}
                </h5>
                
                {/* Available Subjects */}
                {availableSubjects.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-green-500">📚</span>
                      <span className="text-sm font-medium text-green-700">Available Now</span>
                    </div>
                    <div className="space-y-2">
                      {availableSubjects.map((subjectName) => {
                        const subjectQuizzes = gradeData.filter(quiz => quiz.subject === subjectName) || []
                        return (
                          <SubjectBlock
                            key={subjectName}
                            subjectName={subjectName}
                            grade={gradeKey}
                            system={system}
                            level={level}
                            quizzes={subjectQuizzes}
                            loading={loading}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
                
                {/* Coming Soon Subjects */}
                {comingSoonSubjects.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-sm font-medium text-gray-600">Coming Soon</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-4">
                      {comingSoonSubjects.map((subjectName) => (
                        <div key={subjectName} className="flex items-center space-x-2 p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                          <span className="text-xs font-medium text-gray-600 group-hover:text-blue-700">{subjectName}</span>
                          <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </CollapsibleContent>
    </Collapsible>
  )
} 