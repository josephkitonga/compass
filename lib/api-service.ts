// API service for Roodito integration
export interface QuizApiResponse {
  text: string
  type: string
  data: QuizApiData[]
  pagination: PaginationData
}

export interface QuizApiData {
  date: string
  level: string | null
  subject: string | null
  grade: string
  number_of_question: string
  quiz_id: string
  quiz_link: string
  quiz_type: string
}

export interface PaginationData {
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface QuizFilters {
  page?: number
  per_page?: number
  subject?: string
  grade?: string
  level?: string
  quiz_type?: string
}

const API_BASE_URL = '/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class QuizApiService {
  private static async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      console.log('Fetching:', `${API_BASE_URL}/${endpoint}`)
      const response = await fetch(`${API_BASE_URL}/quiz_table_data${endpoint.replace('quiz_table_data', '')}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          ...options?.headers,
        },
        ...options,
      })

      console.log('Response status:', response.status)
      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status
        )
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0
      )
    }
  }

  static async getQuizzes(filters: QuizFilters = {}): Promise<QuizApiResponse> {
    const params = new URLSearchParams()
    let perPage = filters.per_page && filters.per_page > 400 ? 400 : (filters.per_page || 400);
    if (filters.page) params.append('page', filters.page.toString())
    params.append('per_page', perPage.toString())
    if (filters.subject) params.append('subject', filters.subject)
    if (filters.grade) params.append('grade', filters.grade)
    if (filters.level) params.append('level', filters.level)
    if (filters.quiz_type) params.append('quiz_type', filters.quiz_type)
    const queryString = params.toString()
    const endpoint = `quiz_table_data${queryString ? `?${queryString}` : ''}`
    return this.makeRequest<QuizApiResponse>(endpoint)
  }

  // Helper to fetch all pages for a given filter
  static async fetchAllPages(filters: QuizFilters = {}): Promise<QuizApiData[]> {
    let allQuizzes: QuizApiData[] = [];
    let page = 1;
    let totalPages = 1;
    const perPage = filters.per_page || 400;
    do {
      const response = await this.getQuizzes({ ...filters, per_page: perPage, page });
      if (response.data && Array.isArray(response.data)) {
        allQuizzes = allQuizzes.concat(response.data);
      }
      totalPages = response.pagination?.total_pages || 1;
      page++;
    } while (page <= totalPages);
    return allQuizzes;
  }

  static async getAllQuizzes(): Promise<QuizApiData[]> {
    return this.fetchAllPages();
  }

  static async getQuizById(quizId: string): Promise<QuizApiData | null> {
    const allQuizzes = await this.fetchAllPages();
    return allQuizzes.find(q => q.quiz_id === quizId) || null;
  }

  static async searchQuizzes(query: string, filters: QuizFilters = {}): Promise<QuizApiData[]> {
    const allQuizzes = await this.fetchAllPages(filters);
    return allQuizzes.filter(quiz => 
      quiz.subject?.toLowerCase().includes(query.toLowerCase()) ||
      quiz.grade?.toLowerCase().includes(query.toLowerCase()) ||
      quiz.level?.toLowerCase().includes(query.toLowerCase()) ||
      quiz.quiz_type?.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async getQuizzesBySubject(subject: string, filters: QuizFilters = {}): Promise<QuizApiData[]> {
    return this.fetchAllPages({ ...filters, subject });
  }

  static async getQuizzesByGrade(grade: string, filters: QuizFilters = {}): Promise<QuizApiData[]> {
    return this.fetchAllPages({ ...filters, grade });
  }

  static async getQuizzesByLevel(level: string, filters: QuizFilters = {}): Promise<QuizApiData[]> {
    return this.fetchAllPages({ ...filters, level });
  }
}

// Utility functions for data transformation
export const transformQuizApiData = (apiData: QuizApiData) => ({
  id: apiData.quiz_id,
  title: `${apiData.subject || 'Quiz'} - ${apiData.grade}`,
  subject: apiData.subject || 'General',
  grade: apiData.grade,
  level: apiData.level || undefined,
  questions: parseInt(apiData.number_of_question) || 0,
  type: apiData.quiz_type || 'Quiz',
  difficulty: 'Medium', // Default since API doesn't provide this
  duration: 15, // Default duration
  quizLink: apiData.quiz_link,
  date: apiData.date,
  system: (apiData.level && (apiData.level.includes('Primary') || apiData.level.includes('Junior Secondary') || apiData.level.includes('Senior Secondary'))) ? 'CBC' : '844' // Pin Junior/Senior Secondary to CBC
})

export const groupQuizzesBySystem = (quizzes: QuizApiData[]) => {
  const grouped: { CBC: { [key: string]: { [key: string]: QuizApiData[] } }; "844": { [key: string]: { [key: string]: QuizApiData[] } } } = {
    CBC: {},
    "844": {}
  }
  
  quizzes.forEach(quiz => {
    const system = (quiz.level && (quiz.level.includes('Primary') || quiz.level.includes('Junior Secondary') || quiz.level.includes('Senior Secondary'))) ? 'CBC' : '844'
    const level = quiz.level || 'General'
    const grade = quiz.grade || 'General'
    
    if (!grouped[system][level]) grouped[system][level] = {}
    if (!grouped[system][level][grade]) grouped[system][level][grade] = []
    
    grouped[system][level][grade].push(quiz)
  })
  
  return grouped
} 