// Data service for Roodito API integration
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

export interface ApiQuiz {
  id: string
  title: string
  subject: string
  grade: string
  level?: string
  questions: number
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

// Cache configuration
interface CacheEntry {
  data: QuizApiData[]
  timestamp: number
  groupedData: ApiQuizData
}

let quizCache: CacheEntry | null = null
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

export interface LoadingState {
  isLoading: boolean
  progress: number
  currentPage: number
  totalPages: number
  loadedQuizzes: number
  totalQuizzes: number
}

export const getQuizData = async (
  onProgress?: (state: LoadingState) => void, 
  onPartialData?: (data: ApiQuizData) => void
): Promise<ApiQuizData> => {
  try {
    const now = Date.now()
    
    if (quizCache && (now - quizCache.timestamp) < CACHE_DURATION) {
      return quizCache.groupedData
    }
    
    let loadingState: LoadingState = {
      isLoading: true,
      progress: 0,
      currentPage: 1,
      totalPages: 1,
      loadedQuizzes: 0,
      totalQuizzes: 0
    }
    
    let allQuizzes: QuizApiData[] = [];
    let page = 1;
    let totalPages = 1;
    const perPage = 50;
    
    // Fetch first page
    try {
      const firstResponse = await QuizApiService.getQuizzes({ per_page: perPage, page: 1 });
      if (firstResponse.data && Array.isArray(firstResponse.data)) {
        allQuizzes = firstResponse.data;
        totalPages = firstResponse.pagination?.total_pages || 1;
        
        loadingState.totalPages = totalPages;
        loadingState.totalQuizzes = firstResponse.pagination?.total || 0;
        loadingState.loadedQuizzes = allQuizzes.length;
        loadingState.progress = (1 / totalPages) * 100;
        onProgress?.(loadingState);
        
        const initialGroupedData = groupQuizzesBySystem(allQuizzes);
        onPartialData?.(initialGroupedData);
      }
    } catch (error) {
      throw error;
    }
    
    // Fetch remaining pages
    for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
      let retries = 0;
      let success = false;
      
      while (retries < MAX_RETRIES && !success) {
        try {
          const response = await QuizApiService.getQuizzes({ per_page: perPage, page: currentPage });
          if (response.data && Array.isArray(response.data)) {
            allQuizzes = allQuizzes.concat(response.data);
            success = true;
            
            loadingState.currentPage = currentPage;
            loadingState.loadedQuizzes = allQuizzes.length;
            loadingState.progress = (currentPage / totalPages) * 100;
            onProgress?.(loadingState);
            
            const updatedGroupedData = groupQuizzesBySystem(allQuizzes);
            onPartialData?.(updatedGroupedData);
          }
        } catch (error) {
          retries++;
          if (retries < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
          } else {
            break;
          }
        }
      }
    }
    
    const groupedData = groupQuizzesBySystem(allQuizzes);
    
    quizCache = {
      data: allQuizzes,
      timestamp: now,
      groupedData
    };
    
    loadingState.isLoading = false;
    loadingState.progress = 100;
    onProgress?.(loadingState);
    
    return groupedData;
  } catch (error) {
    throw new Error(`Failed to fetch quiz data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const getCachedQuizData = (): ApiQuizData | null => {
  if (quizCache && (Date.now() - quizCache.timestamp) < CACHE_DURATION) {
    return quizCache.groupedData;
  }
  return null;
}

export const clearQuizCache = (): void => {
  quizCache = null;
}

export const getQuizDataWithFallback = async (): Promise<ApiQuizData> => {
  try {
    return await getQuizData();
  } catch (error) {
    console.error('Failed to fetch quiz data:', error);
    return { CBC: {}, "844": {} };
  }
}

export const getAchievementsData = (): AchievementsData => {
  return achievementsData as unknown as AchievementsData;
}

export async function saveQuizResult(result: any) {
  // Implementation for saving quiz results
  console.log('Saving quiz result:', result);
}

export async function fetchUserResults(userId: string) {
  // Implementation for fetching user results
  return [];
}

export async function findQuizById(quizId: string): Promise<{
  quiz: ApiQuiz | null
  subject: string
  grade: string
  system: string
} | null> {
  try {
    const cachedData = getCachedQuizData();
    if (!cachedData) {
      return null;
    }
    
    for (const [system, levels] of Object.entries(cachedData)) {
      for (const [level, grades] of Object.entries(levels)) {
        for (const [grade, quizzes] of Object.entries(grades)) {
          const quiz = quizzes.find(q => q.quiz_id === quizId);
          if (quiz) {
            return {
              quiz: transformQuizApiData(quiz),
              subject: quiz.subject || 'General',
              grade: quiz.grade,
              system
            };
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error finding quiz by ID:', error);
    return null;
  }
}

export async function getAllQuizzes(): Promise<ApiQuiz[]> {
  try {
    const cachedData = getCachedQuizData();
    if (!cachedData) {
      return [];
    }
    
    const allQuizzes: ApiQuiz[] = [];
    
    for (const [system, levels] of Object.entries(cachedData)) {
      for (const [level, grades] of Object.entries(levels)) {
        for (const [grade, quizzes] of Object.entries(grades)) {
          quizzes.forEach(quiz => {
            allQuizzes.push(transformQuizApiData(quiz));
          });
        }
      }
    }
    
    return allQuizzes;
  } catch (error) {
    console.error('Error getting all quizzes:', error);
    return [];
  }
} 