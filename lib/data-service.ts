// Data service to handle JSON imports server-side
import quizData from '@/app/data/quizzes.json'
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

// Export the data with proper typing
export const getQuizData = (): QuizData => {
  return quizData as unknown as QuizData
}

export const getAchievementsData = (): AchievementsData => {
  return achievementsData as unknown as AchievementsData
}

// Recursively collect all quizzes from any nested structure
function collectQuizzes(obj: any, meta: any = {}, result: any[] = []) {
  if (Array.isArray(obj)) {
    obj.forEach((quiz) => {
      result.push({
        ...quiz,
        ...meta
      })
    })
  } else if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      // If this is a system, level, grade, or subject, add to meta
      let newMeta = { ...meta }
      if (meta.system === undefined) newMeta.system = key
      else if (meta.level === undefined && key.match(/Primary|Secondary|Form/)) newMeta.level = key
      else if (meta.grade === undefined && key.match(/Grade|Form/)) newMeta.grade = key
      else if (meta.subject === undefined && typeof value === 'object' && Array.isArray(value)) newMeta.subject = key
      collectQuizzes(value, newMeta, result)
    })
  }
  return result
}

export const getAllQuizzes = () => {
  const data = getQuizData()
  // Start recursion at the system level
  const quizzes: any[] = []
  Object.entries(data).forEach(([system, systemData]) => {
    collectQuizzes(systemData, { system }, quizzes)
  })
  // Normalize output for search and UI
  return quizzes.map(q => ({
    id: q.id,
    title: q.title || 'Untitled Quiz',
    subject: q.subject || '',
    grade: q.grade || '',
    system: q.system || '',
    difficulty: q.difficulty || 'Medium',
    questions: Array.isArray(q.questions) ? q.questions.length : (q.questions || 0),
    type: q.type || 'quiz'
  }))
}

export interface QuizMeta {
  quiz: any
  subject: string
  grade: string
  system: string
  level?: string
}

export const findQuizById = (quizId: string): QuizMeta | null => {
  const data = getQuizData()
  let found: QuizMeta | null = null
  function search(obj: any, meta: any = {}) {
    if (Array.isArray(obj)) {
      obj.forEach((quiz) => {
        if (quiz.id === quizId) {
          found = { quiz, ...meta }
        }
      })
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        let newMeta = { ...meta }
        if (meta.system === undefined) newMeta.system = key
        else if (meta.level === undefined && key.match(/Primary|Secondary|Form/)) newMeta.level = key
        else if (meta.grade === undefined && key.match(/Grade|Form/)) newMeta.grade = key
        else if (meta.subject === undefined && typeof value === 'object' && Array.isArray(value)) newMeta.subject = key
        search(value, newMeta)
      })
    }
  }
  Object.entries(data).forEach(([system, systemData]) => {
    search(systemData, { system })
  })
  return found
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