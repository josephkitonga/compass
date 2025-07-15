// Data service to handle API integration with Roodito
import { 
  QuizApiService, 
  transformQuizApiData, 
  groupQuizzesBySystem,
  type QuizApiData,
  type QuizFilters 
} from './api-service'
import achievementsData from '@/app/data/achievements.json'

export interface Question {
  question: string
  options: string[]
  answer: string
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  questions: Question[]
  duration: number
  type: string
  difficulty: string
}

// Extended interface for API-based quizzes
export interface ApiQuiz {
  id: string
  title: string
  subject: string
  grade: string
  level?: string
  questions: number // Number of questions, not the actual questions
  duration: number
  type: string
  difficulty: string
  quizLink?: string
  date?: string
  system: string
}

export interface GradeData {
  [subject: string]: Quiz[]
}

export interface SystemData {
  [grade: string]: GradeData
}

export interface QuizData {
  CBC: SystemData
  "844": SystemData
}

// New interface for API-based quiz data structure
export interface ApiQuizData {
  [system: string]: {
    [level: string]: {
      [grade: string]: QuizApiData[]
    }
  }
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
}

export interface PastScore {
  id: string
  title: string
  subject: string
  grade: string
  system: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeTaken: string
  date: string
  difficulty: string
}

export interface LeaderboardPlayer {
  rank: number
  name: string
  school: string
  totalScore: number
  quizzesTaken: number
  averageScore: number
  avatar: string
}

export interface UserStats {
  totalQuizzesTaken: number
  averageScore: number
  highestScore: number
  totalTimeSpent: string
  streakDays: number
  rank: number
}

export interface AchievementsData {
  userStats: UserStats
  pastScores: PastScore[]
  leaderboards: {
    overall: LeaderboardPlayer[]
    bySubject: {
      [subject: string]: LeaderboardPlayer[]
    }
  }
  achievements: Achievement[]
  progress: {
    weeklyActivity: Array<{
      day: string
      quizzes: number
      time: number
    }>
  }
}

// Cache for API responses
let quizCache: QuizApiData[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Get all quizzes from API with caching
export const getQuizData = async (): Promise<ApiQuizData> => {
  try {
    const now = Date.now()
    
    // Use cache if it's still valid
    if (quizCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return groupQuizzesBySystem(quizCache)
    }
    
    // Fetch all pages from API
    let allQuizzes: QuizApiData[] = [];
    let page = 1;
    let totalPages = 1;
    const perPage = 400;
    do {
      const response = await QuizApiService.getQuizzes({ per_page: perPage, page });
      if (response.data && Array.isArray(response.data)) {
        allQuizzes = allQuizzes.concat(response.data);
      }
      totalPages = response.pagination?.total_pages || 1;
      page++;
    } while (page <= totalPages);
    quizCache = allQuizzes;
    cacheTimestamp = now;
    
    return groupQuizzesBySystem(allQuizzes)
  } catch (error) {
    console.error('Failed to fetch quiz data:', error)
    // Return empty structure if API fails
    return { CBC: {}, "844": {} }
  }
}

// Get all quizzes as a flat array for search and UI
export const getAllQuizzes = async (): Promise<ApiQuiz[]> => {
  try {
    // Fetch all pages from API
    let allQuizzes: QuizApiData[] = [];
    let page = 1;
    let totalPages = 1;
    const perPage = 400;
    do {
      const response = await QuizApiService.getQuizzes({ per_page: perPage, page });
      if (response.data && Array.isArray(response.data)) {
        allQuizzes = allQuizzes.concat(response.data);
      }
      totalPages = response.pagination?.total_pages || 1;
      page++;
    } while (page <= totalPages);
    return allQuizzes.map(transformQuizApiData);
  } catch (error) {
    console.error('Failed to fetch all quizzes:', error)
    return []
  }
}

// Find quiz by ID from API
export const findQuizById = async (quizId: string): Promise<{ quiz: ApiQuiz; subject: string; grade: string; system: string; level?: string } | null> => {
  try {
    const apiQuiz = await QuizApiService.getQuizById(quizId)
    if (!apiQuiz) return null;
    const transformedQuiz = transformQuizApiData(apiQuiz)
    
    return {
      quiz: transformedQuiz,
      subject: transformedQuiz.subject,
      grade: transformedQuiz.grade,
      system: transformedQuiz.system,
      level: transformedQuiz.level
    }
  } catch (error) {
    console.error(`Failed to find quiz with ID ${quizId}:`, error)
    return null
  }
}

// Search quizzes
export const searchQuizzes = async (query: string, filters: QuizFilters = {}): Promise<ApiQuiz[]> => {
  try {
    const results = await QuizApiService.searchQuizzes(query, filters)
    return results.map(transformQuizApiData)
  } catch (error) {
    console.error('Failed to search quizzes:', error)
    return []
  }
}

// Get quizzes by subject
export const getQuizzesBySubject = async (subject: string, filters: QuizFilters = {}): Promise<ApiQuiz[]> => {
  try {
    const results = await QuizApiService.getQuizzesBySubject(subject, filters)
    return results.map(transformQuizApiData)
  } catch (error) {
    console.error(`Failed to get quizzes for subject ${subject}:`, error)
    return []
  }
}

// Get quizzes by grade
export const getQuizzesByGrade = async (grade: string, filters: QuizFilters = {}): Promise<ApiQuiz[]> => {
  try {
    const results = await QuizApiService.getQuizzesByGrade(grade, filters)
    return results.map(transformQuizApiData)
  } catch (error) {
    console.error(`Failed to get quizzes for grade ${grade}:`, error)
    return []
  }
}

// Get quizzes by level
export const getQuizzesByLevel = async (level: string, filters: QuizFilters = {}): Promise<ApiQuiz[]> => {
  try {
    const results = await QuizApiService.getQuizzesByLevel(level, filters)
    return results.map(transformQuizApiData)
  } catch (error) {
    console.error(`Failed to get quizzes for level ${level}:`, error)
    return []
  }
}

// Get paginated quizzes
export const getPaginatedQuizzes = async (page: number = 1, perPage: number = 10, filters: QuizFilters = {}): Promise<{
  quizzes: ApiQuiz[]
  pagination: {
    total: number
    page: number
    per_page: number
    total_pages: number
  }
}> => {
  try {
    const response = await QuizApiService.getQuizzes({ 
      page, 
      per_page: perPage, 
      ...filters 
    })
    
    return {
      quizzes: response.data.map(transformQuizApiData),
      pagination: response.pagination
    }
  } catch (error) {
    console.error('Failed to get paginated quizzes:', error)
    return {
      quizzes: [],
      pagination: { total: 0, page: 1, per_page: perPage, total_pages: 0 }
    }
  }
}

export const getAchievementsData = (): AchievementsData => {
  return achievementsData as unknown as AchievementsData
}

// Placeholder for saving quiz results (to be implemented by backend dev)
export async function saveQuizResult(result: any) {
  // TODO: Implement backend API call here
  // Example: await fetch('/api/results', { method: 'POST', body: JSON.stringify(result) })
  console.log('Saving quiz result:', result)
  return { success: true }
}

// Placeholder for fetching user results (to be implemented by backend dev)
export async function fetchUserResults(userId: string) {
  // TODO: Implement backend API call here
  // Example: return await fetch(`/api/results?userId=${userId}`).then(res => res.json())
  return []
} 