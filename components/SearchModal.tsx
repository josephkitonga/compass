"use client"

import { useState, useEffect } from "react"
import { Search, X, BookOpen, Target, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Imported data service for our cached data
import { getCachedQuizData, getAllQuizzes } from "@/lib/data-service"
import type { QuizApiData } from "@/lib/api-service"

interface SearchResult {
  id: string
  title: string
  subject: string
  grade: string
  system: string
  difficulty: string
  questions: number
  type: string
  quizLink?: string // Added for external links
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [allQuizzes, setAllQuizzes] = useState<SearchResult[]>([])

  // Load quiz data on component mount - use cached data first
  useEffect(() => {
    async function loadQuizzes() {
      try {
        // First try to get cached data for immediate results
        const cachedData = getCachedQuizData()
        if (cachedData) {
          const quizzes = await getAllQuizzes()
          setAllQuizzes(Array.isArray(quizzes) ? quizzes : [])
          return
        }
        
        // If no cached data, fetch fresh data (this will be slow but only happens once)
        const quizzes = await getAllQuizzes()
        setAllQuizzes(Array.isArray(quizzes) ? quizzes : [])
      } catch (error) {
        console.warn('Failed to load quizzes for search:', error)
        setAllQuizzes([])
      }
    }
    loadQuizzes()
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setResults([])
    }
  }, [isOpen])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    
    // Simulate search delay
    const timeoutId = setTimeout(() => {
      const searchTerm = query.toLowerCase()
      const filtered = Array.isArray(allQuizzes) ? allQuizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm) ||
        quiz.subject.toLowerCase().includes(searchTerm) ||
        quiz.grade.toLowerCase().includes(searchTerm) ||
        quiz.system.toLowerCase().includes(searchTerm)
      ) : [];
      setResults(filtered.slice(0, 10)) // Limit to 10 results
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, allQuizzes])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSystemColor = (system: string) => {
    return system === 'CBC' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex items-start justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Search Quizzes</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by subject, grade, or quiz title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4"
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-nmg-primary"></div>
                <span className="ml-2 text-gray-500">Searching...</span>
              </div>
            ) : query.trim() && results.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try searching with different keywords</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                {results.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                    if (result.quizLink) {
                      window.open(result.quizLink, '_blank', 'noopener,noreferrer');
                    } else {
                      window.location.href = `/quiz/${result.id}`;
                    }
                  }}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base mb-2">{result.title}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {result.subject}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {result.grade}
                            </Badge>
                            <Badge className={`text-xs ${getSystemColor(result.system)}`}>
                              {result.system}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {result.questions} questions
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {result.type}
                            </div>
                          </div>
                        </div>
                        <Badge className={getDifficultyColor(result.difficulty)}>
                          {result.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Search for quizzes</h3>
                <p className="text-gray-500">Type to search by subject, grade, or quiz title</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 