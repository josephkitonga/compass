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

// Enhanced caching system
interface CacheEntry {
  data: QuizApiData[]
  timestamp: number
  groupedData: ApiQuizData
}

let quizCache: CacheEntry | null = null
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes cache
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Progressive loading state
export interface LoadingState {
  isLoading: boolean
  progress: number
  currentPage: number
  totalPages: number
  loadedQuizzes: number
  totalQuizzes: number
}

// Get all quizzes from API with enhanced caching and progressive loading
export const getQuizData = async (onProgress?: (state: LoadingState) => void, onPartialData?: (data: ApiQuizData) => void): Promise<ApiQuizData> => {
  try {
    const now = Date.now()
    
    // Use cache if it's still valid
    if (quizCache && (now - quizCache.timestamp) < CACHE_DURATION) {
      console.log('Using cached quiz data')
      return quizCache.groupedData
    }
    
    console.log('Fetching all quiz data from API...')
    
    // Initialize loading state
    let loadingState: LoadingState = {
      isLoading: true,
      progress: 0,
      currentPage: 1,
      totalPages: 1,
      loadedQuizzes: 0,
      totalQuizzes: 0
    }
    
    // Fetch all pages from API with retry logic and progress tracking
    let allQuizzes: QuizApiData[] = [];
    let page = 1;
    let totalPages = 1;
    const perPage = 50; // Smaller page size for faster initial loads
    
    // First, get the first page to determine total pages
    try {
      const firstResponse = await QuizApiService.getQuizzes({ per_page: perPage, page: 1 });
      if (firstResponse.data && Array.isArray(firstResponse.data)) {
        allQuizzes = firstResponse.data;
        totalPages = firstResponse.pagination?.total_pages || 1;
        
        // Update loading state
        loadingState.totalPages = totalPages;
        loadingState.totalQuizzes = firstResponse.pagination?.total || 0;
        loadingState.loadedQuizzes = allQuizzes.length;
        loadingState.progress = (1 / totalPages) * 100;
        onProgress?.(loadingState);
        
        // Immediately show first page data
        const initialGroupedData = groupQuizzesBySystem(allQuizzes);
        onPartialData?.(initialGroupedData);
        console.log('Showing initial data from first page');
      }
    } catch (error) {
      console.error('Failed to fetch first page:', error);
      throw error;
    }
    
    // Fetch remaining pages with retry logic
    for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
      let retries = 0;
      let success = false;
      
      while (retries < MAX_RETRIES && !success) {
        try {
          const response = await QuizApiService.getQuizzes({ per_page: perPage, page: currentPage });
          if (response.data && Array.isArray(response.data)) {
            allQuizzes = allQuizzes.concat(response.data);
            success = true;
            
            // Update loading state
            loadingState.currentPage = currentPage;
            loadingState.loadedQuizzes = allQuizzes.length;
            loadingState.progress = (currentPage / totalPages) * 100;
            onProgress?.(loadingState);
            
            // Show updated data after each page
            const updatedGroupedData = groupQuizzesBySystem(allQuizzes);
            onPartialData?.(updatedGroupedData);
            console.log(`Updated data after page ${currentPage}`);
          }
        } catch (error) {
          retries++;
          console.warn(`Failed to fetch page ${currentPage}, retry ${retries}/${MAX_RETRIES}:`, error);
          
          if (retries < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
          } else {
            console.error(`Failed to fetch page ${currentPage} after ${MAX_RETRIES} retries`);
            // Continue with partial data rather than failing completely
            break;
          }
        }
      }
    }
    
    console.log(`Fetched ${allQuizzes.length} total quizzes from ${totalPages} pages`)
    
    // Group the data
    const groupedData = groupQuizzesBySystem(allQuizzes);
    
    // Cache the results
    quizCache = {
      data: allQuizzes,
      timestamp: now,
      groupedData
    };
    
    // Final loading state
    loadingState.isLoading = false;
    loadingState.progress = 100;
    onProgress?.(loadingState);
    
    return groupedData;
  } catch (error) {
    console.error('Failed to fetch quiz data:', error)
    // Return empty structure if API fails
    return { CBC: {}, "844": {} }
  }
}

// Get cached data without fetching (for immediate UI rendering)
export const getCachedQuizData = (): ApiQuizData | null => {
  if (quizCache && (Date.now() - quizCache.timestamp) < CACHE_DURATION) {
    return quizCache.groupedData;
  }
  return null;
}

// Clear cache (useful for testing or manual refresh)
export const clearQuizCache = (): void => {
  quizCache = null;
}

// Get quiz data with fallback to cached data
export const getQuizDataWithFallback = async (): Promise<ApiQuizData> => {
  try {
    return await getQuizData();
  } catch (error) {
    console.warn('Failed to fetch fresh data, using cached data if available');
    const cached = getCachedQuizData();
    if (cached) {
      return cached;
    }
    return { CBC: {}, "844": {} };
  }
}

// These methods are not used in the current implementation
// They were causing multiple API calls and are now disabled
// All data is fetched centrally through getQuizData()

// These pagination methods are not used in the current implementation
// They were causing multiple API calls and are now disabled
// All data is fetched centrally through getQuizData()

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

// Function to find a specific quiz by ID
export async function findQuizById(quizId: string): Promise<{
  quiz: ApiQuiz | null
  subject: string
  grade: string
  system: string
} | null> {
  try {
    // Get all quiz data
    const allQuizData = await getQuizData()
    
    // Search through all systems and levels
    for (const [system, levels] of Object.entries(allQuizData)) {
      for (const [level, grades] of Object.entries(levels)) {
        for (const [grade, quizzes] of Object.entries(grades)) {
          for (const quiz of quizzes) {
            if (quiz.quiz_id === quizId) {
              return {
                quiz: transformQuizApiData(quiz),
                subject: quiz.subject || 'General',
                grade: quiz.grade,
                system: system
              }
            }
          }
        }
      }
    }
    
    return null
  } catch (error) {
    console.error('Failed to find quiz by ID:', error)
    return null
  }
}

// Function to get all quizzes as a flat array for search functionality
export async function getAllQuizzes(): Promise<ApiQuiz[]> {
  try {
    // First try to use cached data
    const cachedData = getCachedQuizData()
    if (cachedData) {
      const allQuizzes: ApiQuiz[] = []
      
      // Flatten the nested structure from cached data
      for (const [system, levels] of Object.entries(cachedData)) {
        for (const [level, grades] of Object.entries(levels)) {
          for (const [grade, quizzes] of Object.entries(grades)) {
            for (const quiz of quizzes) {
              allQuizzes.push(transformQuizApiData(quiz))
            }
          }
        }
      }
      
      return allQuizzes
    }
    
    // If no cached data, fetch fresh data (this will be slow but only happens once)
    const allQuizData = await getQuizData()
    const allQuizzes: ApiQuiz[] = []
    
    // Flatten the nested structure
    for (const [system, levels] of Object.entries(allQuizData)) {
      for (const [level, grades] of Object.entries(levels)) {
        for (const [grade, quizzes] of Object.entries(grades)) {
          for (const quiz of quizzes) {
            allQuizzes.push(transformQuizApiData(quiz))
          }
        }
      }
    }
    
    return allQuizzes
  } catch (error) {
    console.error('Failed to get all quizzes:', error)
    return []
  }
} 