"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fetchAllQuizData } from '@/lib/data-service'
import type { QuizApiData } from '@/lib/api-service'

interface QuizDataContextType {
  groupedData: {
    CBC: { [level: string]: { [grade: string]: QuizApiData[] } }
    "844": { [level: string]: { [grade: string]: QuizApiData[] } }
  }
  allQuizzes: QuizApiData[]
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

const QuizDataContext = createContext<QuizDataContextType | undefined>(undefined)

export const useQuizData = () => {
  const context = useContext(QuizDataContext)
  if (context === undefined) {
    throw new Error('useQuizData must be used within a QuizDataProvider')
  }
  return context
}

interface QuizDataProviderProps {
  children: ReactNode
}

export const QuizDataProvider: React.FC<QuizDataProviderProps> = ({ children }) => {
  const [groupedData, setGroupedData] = useState<QuizDataContextType['groupedData']>({
    CBC: {},
    "844": {}
  })
  const [allQuizzes, setAllQuizzes] = useState<QuizApiData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const { groupedData: data, allQuizzes: quizzes } = await fetchAllQuizData()
      setGroupedData(data as QuizDataContextType['groupedData'])
      setAllQuizzes(quizzes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quiz data')
      console.error('Error fetching quiz data:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  const value: QuizDataContextType = {
    groupedData,
    allQuizzes,
    loading,
    error,
    refreshData
  }

  return (
    <QuizDataContext.Provider value={value}>
      {children}
    </QuizDataContext.Provider>
  )
} 