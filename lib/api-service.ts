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
const REQUEST_TIMEOUT = 30000;

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
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
      
      const response = await fetch(`${API_BASE_URL}/quiz_table_data`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      })

      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${response.status}`,
          response.status
        )
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408)
      }
      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0
      )
    }
  }

  static async getQuizzes(filters: QuizFilters = {}): Promise<QuizApiResponse> {
    const params = new URLSearchParams()
    const perPage = filters.per_page || 200; // Changed default to 200
    
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

  static async fetchAllPages(filters: QuizFilters = {}): Promise<QuizApiData[]> {
    let allQuizzes: QuizApiData[] = [];
    let page = 1;
    let totalPages = 1;
    const perPage = filters.per_page || 200; // Changed default to 200
    
    do {
      try {
        const response = await this.getQuizzes({ ...filters, per_page: perPage, page });
        if (response.data && Array.isArray(response.data)) {
          allQuizzes = allQuizzes.concat(response.data);
        }
        totalPages = response.pagination?.total_pages || 1;
        page++;
      } catch (error) {
        console.error(`Failed to fetch page ${page}:`, error);
        break;
      }
    } while (page <= totalPages);
    
    return allQuizzes;
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
  difficulty: 'Medium',
  duration: 15,
  quizLink: apiData.quiz_link,
  date: apiData.date,
  system: (() => {
    if (apiData.level && (apiData.level.includes('Primary') || apiData.level.includes('Junior Secondary') || apiData.level.includes('Senior Secondary'))) {
      return 'CBC'
    }
    const gradeNum = parseInt(apiData.grade)
    if (!isNaN(gradeNum) && gradeNum >= 4 && gradeNum <= 12) {
      return 'CBC'
    }
    return '844'
  })()
})

export const groupQuizzesBySystem = (quizzes: QuizApiData[]) => {
  const grouped: { CBC: { [key: string]: { [grade: string]: QuizApiData[] } }; "844": { [key: string]: { [grade: string]: QuizApiData[] } } } = {
    CBC: {},
    "844": {}
  }
  
  console.log('GroupQuizzesBySystem: Processing', quizzes.length, 'quizzes');
  console.log('GroupQuizzesBySystem: Sample quiz data:', quizzes.slice(0, 3));
  
  quizzes.forEach((quiz, index) => {
    let system = '844';
    
    // Better system determination logic that prioritizes level over grade
    if (quiz.level) {
      // If level is provided, use it to determine system
      if (quiz.level.toLowerCase().includes('primary') || 
          quiz.level.toLowerCase().includes('junior secondary') || 
          quiz.level.toLowerCase().includes('senior secondary')) {
        system = 'CBC';
      }
    } else {
      // Fallback to grade-based logic
      const gradeNum = parseInt(quiz.grade);
      if (!isNaN(gradeNum) && gradeNum >= 4 && gradeNum <= 12) {
        system = 'CBC';
      }
    }
    
    if (system === 'CBC') {
      const gradeNum = parseInt(quiz.grade);
      if (!isNaN(gradeNum) && gradeNum >= 4 && gradeNum <= 6) {
        if (!grouped.CBC['Upper Primary']) grouped.CBC['Upper Primary'] = {};
        if (!grouped.CBC['Upper Primary'][quiz.grade]) grouped.CBC['Upper Primary'][quiz.grade] = [];
        grouped.CBC['Upper Primary'][quiz.grade].push(quiz);
      } else if (
        (!isNaN(gradeNum) && gradeNum >= 7 && gradeNum <= 9) ||
        (quiz.level && quiz.level.toLowerCase().includes('junior secondary'))
      ) {
        if (!grouped.CBC['Junior Secondary']) grouped.CBC['Junior Secondary'] = {};
        if (!grouped.CBC['Junior Secondary'][quiz.grade]) grouped.CBC['Junior Secondary'][quiz.grade] = [];
        grouped.CBC['Junior Secondary'][quiz.grade].push(quiz);
        console.log(`Quiz ${index}: Added to Junior Secondary Grade ${quiz.grade}`);
      } else if (
        (quiz.level && quiz.level.toLowerCase().includes('senior secondary')) ||
        (!isNaN(gradeNum) && gradeNum >= 10 && gradeNum <= 12) ||
        (quiz.level && /senior|form\s*3|form\s*4|form\s*iii|form\s*iv|10|11|12/i.test(quiz.level)) ||
        (quiz.grade && /senior|form\s*3|form\s*4|form\s*iii|form\s*iv|10|11|12/i.test(quiz.grade))
      ) {
        if (!grouped.CBC['Senior Secondary']) grouped.CBC['Senior Secondary'] = {};
        if (!grouped.CBC['Senior Secondary'][quiz.grade]) grouped.CBC['Senior Secondary'][quiz.grade] = [];
        grouped.CBC['Senior Secondary'][quiz.grade].push(quiz);
      } else {
        const level = quiz.level || 'Other';
        if (!grouped.CBC[level]) grouped.CBC[level] = {};
        if (!grouped.CBC[level][quiz.grade]) grouped.CBC[level][quiz.grade] = [];
        grouped.CBC[level][quiz.grade].push(quiz);
      }
    } else if (system === '844') {
      const grade = quiz.grade || 'General';
      if (quiz.level && /^form\s*([234])$/i.test(quiz.level)) {
        if (!grouped['844']['Secondary']) grouped['844']['Secondary'] = {};
        const key = quiz.level.trim();
        if (!grouped['844']['Secondary'][key]) grouped['844']['Secondary'][key] = [];
        grouped['844']['Secondary'][key].push(quiz);
      } else if (
        /form\s*2|form\s*3|form\s*4|form\s*ii|form\s*iii|form\s*iv|2|3|4/i.test(grade) ||
        (quiz.level && /form\s*2|form\s*3|form\s*4|form\s*ii|form\s*iii|form\s*iv|2|3|4/i.test(quiz.level))
      ) {
        if (!grouped["844"]['Secondary']) grouped["844"]['Secondary'] = {};
        if (!grouped["844"]['Secondary'][quiz.grade]) grouped["844"]['Secondary'][quiz.grade] = [];
        grouped["844"]['Secondary'][quiz.grade].push(quiz);
      } else {
        if (!grouped["844"]['Other']) grouped["844"]['Other'] = {};
        if (!grouped["844"]['Other'][quiz.grade]) grouped["844"]['Other'][quiz.grade] = [];
        grouped["844"]['Other'][quiz.grade].push(quiz);
      }
    }
    
    console.log(`Quiz ${index}: Subject=${quiz.subject}, Grade=${quiz.grade}, Level=${quiz.level}, System=${system}`);
  });
  
  // Ensure all CBC levels are always present, even if empty
  if (!grouped.CBC['Upper Primary']) grouped.CBC['Upper Primary'] = {};
  if (!grouped.CBC['Junior Secondary']) grouped.CBC['Junior Secondary'] = {};
  if (!grouped.CBC['Senior Secondary']) grouped.CBC['Senior Secondary'] = {};
  
  // Ensure all expected grades are present within each CBC level
  if (grouped.CBC['Upper Primary']) {
    ['4', '5', '6'].forEach(grade => {
      if (!grouped.CBC['Upper Primary'][grade]) grouped.CBC['Upper Primary'][grade] = [];
    });
  }
  if (grouped.CBC['Junior Secondary']) {
    ['7', '8', '9'].forEach(grade => {
      if (!grouped.CBC['Junior Secondary'][grade]) grouped.CBC['Junior Secondary'][grade] = [];
    });
  }
  if (grouped.CBC['Senior Secondary']) {
    ['10', '11', '12'].forEach(grade => {
      if (!grouped.CBC['Senior Secondary'][grade]) grouped.CBC['Senior Secondary'][grade] = [];
    });
  }
  
  // Ensure all 844 levels are always present, even if empty
  if (!grouped['844']['Secondary']) grouped['844']['Secondary'] = {};
  
  // Ensure all expected forms are present within 8-4-4 Secondary
  if (grouped['844']['Secondary']) {
    ['Form 2', 'Form 3', 'Form 4'].forEach(form => {
      if (!grouped['844']['Secondary'][form]) grouped['844']['Secondary'][form] = [];
    });
  }
  
  console.log('GroupQuizzesBySystem: Final grouped structure:', grouped);
  console.log('GroupQuizzesBySystem: CBC structure details:', {
    'Upper Primary': Object.keys(grouped.CBC['Upper Primary'] || {}),
    'Junior Secondary': Object.keys(grouped.CBC['Junior Secondary'] || {}),
    'Senior Secondary': Object.keys(grouped.CBC['Senior Secondary'] || {})
  });
  console.log('GroupQuizzesBySystem: 844 structure details:', {
    'Secondary': Object.keys(grouped['844']['Secondary'] || {})
  });
  return grouped;
} 

// API Service for Roodito Authentication
export interface LoginResponse {
  success: boolean
  token?: string
  user?: any
  message?: string
}

export interface RegisterResponse {
  success: boolean
  token?: string
  user?: any
  message?: string
}

export class AuthService {
  private static baseUrl = 'https://api.roodito.com/api'

  // Get CSRF token from cookies (if needed)
  private static getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
    return xsrfCookie ? xsrfCookie.split('=')[1] : null
  }

  // Login with phone/email and password
  static async login(identifier: string, password: string): Promise<LoginResponse> {
    try {
      // For now, simulate successful login with fallback
      // In production, uncomment the real API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a secure token
      const token = this.generateSecureToken()
      
      return {
        success: true,
        token: token,
        user: { identifier, name: identifier }
      }
      
      /* Uncomment for real API integration
      const formData = new FormData()
      formData.append('identifier', identifier)
      formData.append('password', password)

      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          token: data.token || this.generateSecureToken(),
          user: data.user || { identifier, name: identifier }
        }
      } else {
        return {
          success: false,
          message: data.message || 'Login failed'
        }
      }
      */
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Network error occurred'
      }
    }
  }

  // Register new user
  static async register(userData: {
    identifier: string
    password: string
    name?: string
    email?: string
  }): Promise<RegisterResponse> {
    try {
      // For now, simulate successful registration with fallback
      // In production, uncomment the real API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a secure token
      const token = this.generateSecureToken()
      
      return {
        success: true,
        token: token,
        user: { identifier: userData.identifier, name: userData.name }
      }
      
      /* Uncomment for real API integration
      const formData = new FormData()
      formData.append('identifier', userData.identifier)
      formData.append('password', userData.password)
      if (userData.name) formData.append('name', userData.name)
      if (userData.email) formData.append('email', userData.email)

      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          token: data.token || this.generateSecureToken(),
          user: data.user || { identifier: userData.identifier, name: userData.name }
        }
      } else {
        return {
          success: false,
          message: data.message || 'Registration failed'
        }
      }
      */
    } catch (error) {
      console.error('Register error:', error)
      return {
        success: false,
        message: 'Network error occurred'
      }
    }
  }

  // Search users (for validation)
  static async searchUsers(query: string): Promise<any> {
    try {
      const formData = new FormData()
      formData.append('query', query)

      const response = await fetch(`${this.baseUrl}/search/users?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      })

      return await response.json()
    } catch (error) {
      console.error('Search users error:', error)
      return { success: false, message: 'Search failed' }
    }
  }

  // Validate token (for quiz access)
  static async validateToken(token: string): Promise<boolean> {
    try {
      // For now, we'll validate locally
      // In production, you'd make an API call to validate
      return Boolean(token && token.length > 10)
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  // Generate secure token for direct access
  private static generateSecureToken(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2)
    return `roodito_${timestamp}_${random}`
  }
} 