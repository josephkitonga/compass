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
    // Use a small perPage for production stability and fastest loading
    const perPage = filters.per_page || 20;
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

  // These methods are not used in the current implementation
  // They were causing multiple API calls and are now disabled
  // All data is fetched centrally through getQuizData()
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
  system: (() => {
    // More accurate system detection
    if (apiData.level && (apiData.level.includes('Primary') || apiData.level.includes('Junior Secondary') || apiData.level.includes('Senior Secondary'))) {
      return 'CBC'
    }
    // Check if grade is in CBC range (4-12)
    const gradeNum = parseInt(apiData.grade)
    if (!isNaN(gradeNum) && gradeNum >= 4 && gradeNum <= 12) {
      return 'CBC'
    }
    // Default to 8-4-4 for other cases
    return '844'
  })()
})

export const groupQuizzesBySystem = (quizzes: QuizApiData[]) => {
  const grouped: { CBC: { [key: string]: { [grade: string]: QuizApiData[] } }; "844": { [key: string]: { [grade: string]: QuizApiData[] } } } = {
    CBC: {},
    "844": {}
  }
  const uniqueGrades = new Set<string>();
  const uniqueLevels = new Set<string>();

  quizzes.forEach(quiz => {
    uniqueGrades.add(quiz.grade);
    if (quiz.level) uniqueLevels.add(quiz.level);
    // Print all grades/levels for debugging
    console.log(`Quiz: grade='${quiz.grade}', level='${quiz.level}', subject='${quiz.subject}'`)
    // Improved system detection
    let system = '844' // Default to 8-4-4
    // CBC detection
    if (quiz.level && (quiz.level.toLowerCase().includes('primary') || quiz.level.toLowerCase().includes('junior secondary') || quiz.level.toLowerCase().includes('senior secondary'))) {
      system = 'CBC'
    } else {
      // Check if grade is in CBC range (4-12)
      const gradeNum = parseInt(quiz.grade)
      if (!isNaN(gradeNum) && gradeNum >= 4 && gradeNum <= 12) {
        system = 'CBC'
      }
    }
    // CBC grouping
    if (system === 'CBC') {
      const gradeNum = parseInt(quiz.grade)
      // Upper Primary: Grades 4, 5, 6
      if (!isNaN(gradeNum) && gradeNum >= 4 && gradeNum <= 6) {
        if (!grouped.CBC['Upper Primary']) grouped.CBC['Upper Primary'] = {}
        if (!grouped.CBC['Upper Primary'][quiz.grade]) grouped.CBC['Upper Primary'][quiz.grade] = []
        grouped.CBC['Upper Primary'][quiz.grade].push(quiz)
      }
      // Junior Secondary: Grades 7, 8, 9
      else if (!isNaN(gradeNum) && gradeNum >= 7 && gradeNum <= 9) {
        if (!grouped.CBC['Junior Secondary']) grouped.CBC['Junior Secondary'] = {}
        if (!grouped.CBC['Junior Secondary'][quiz.grade]) grouped.CBC['Junior Secondary'][quiz.grade] = []
        grouped.CBC['Junior Secondary'][quiz.grade].push(quiz)
      }
      // Senior Secondary: group by level if present
      else if (quiz.level && quiz.level.toLowerCase() === 'senior secondary') {
        if (!grouped.CBC['Senior Secondary']) grouped.CBC['Senior Secondary'] = {};
        const key = quiz.grade && quiz.grade.trim() ? quiz.grade : 'Unknown';
        if (!grouped.CBC['Senior Secondary'][key]) grouped.CBC['Senior Secondary'][key] = [];
        grouped.CBC['Senior Secondary'][key].push(quiz);
      }
      // Senior Secondary: fallback to ultra-permissive matching
      else if (
        (!isNaN(gradeNum) && gradeNum >= 10 && gradeNum <= 12) ||
        (quiz.level && /senior|form\s*3|form\s*4|form\s*iii|form\s*iv|10|11|12/i.test(quiz.level)) ||
        (quiz.grade && /senior|form\s*3|form\s*4|form\s*iii|form\s*iv|10|11|12/i.test(quiz.grade))
      ) {
        if (!grouped.CBC['Senior Secondary']) grouped.CBC['Senior Secondary'] = {}
        if (!grouped.CBC['Senior Secondary'][quiz.grade]) grouped.CBC['Senior Secondary'][quiz.grade] = []
        grouped.CBC['Senior Secondary'][quiz.grade].push(quiz)
      }
      // Fallback for other CBC grades
      else {
        const level = quiz.level || 'Other'
        if (!grouped.CBC[level]) grouped.CBC[level] = {}
        if (!grouped.CBC[level][quiz.grade]) grouped.CBC[level][quiz.grade] = []
        grouped.CBC[level][quiz.grade].push(quiz)
      }
    }
    // 8-4-4 grouping: group by level if present
    else if (system === '844') {
      const grade = quiz.grade || 'General'
      if (quiz.level && /^form\s*([234])$/i.test(quiz.level)) {
        if (!grouped['844']['Secondary']) grouped['844']['Secondary'] = {};
        const key = quiz.level.trim();
        if (!grouped['844']['Secondary'][key]) grouped['844']['Secondary'][key] = [];
        grouped['844']['Secondary'][key].push(quiz);
      }
      // 8-4-4 Secondary: fallback to ultra-permissive matching
      else if (
        /form\s*2|form\s*3|form\s*4|form\s*ii|form\s*iii|form\s*iv|2|3|4/i.test(grade) ||
        (quiz.level && /form\s*2|form\s*3|form\s*4|form\s*ii|form\s*iii|form\s*iv|2|3|4/i.test(quiz.level))
      ) {
        if (!grouped["844"]['Secondary']) grouped["844"]['Secondary'] = {}
        if (!grouped["844"]['Secondary'][quiz.grade]) grouped["844"]['Secondary'][quiz.grade] = []
        grouped["844"]['Secondary'][quiz.grade].push(quiz)
      } else {
        // Fallback for any other 8-4-4 grades
        if (!grouped["844"]['Other']) grouped["844"]['Other'] = {}
        if (!grouped["844"]['Other'][quiz.grade]) grouped["844"]['Other'][quiz.grade] = []
        grouped["844"]['Other'][quiz.grade].push(quiz)
      }
    }
  })

  // Synthesize demo quizzes for missing grades/levels for UI completeness
  // CBC Upper Primary: 4,5,6
  if (!grouped.CBC) grouped.CBC = {};
  ['4','5','6'].forEach((g: string) => {
    if (!grouped.CBC['Upper Primary']) grouped.CBC['Upper Primary'] = {};
    if (!grouped.CBC['Upper Primary'][g] || grouped.CBC['Upper Primary'][g].length === 0) {
      grouped.CBC['Upper Primary'][g] = [
        { date: '', level: 'Upper Primary', subject: 'Demo Quiz', grade: g, number_of_question: '1', quiz_id: `demo-up-${g}`, quiz_link: '', quiz_type: 'Demo' }
      ];
    }
  });
  // CBC Junior Secondary: 7,8,9
  ['7','8','9'].forEach((g: string) => {
    if (!grouped.CBC['Junior Secondary']) grouped.CBC['Junior Secondary'] = {};
    if (!grouped.CBC['Junior Secondary'][g] || grouped.CBC['Junior Secondary'][g].length === 0) {
      grouped.CBC['Junior Secondary'][g] = [
        { date: '', level: 'Junior Secondary', subject: 'Demo Quiz', grade: g, number_of_question: '1', quiz_id: `demo-js-${g}`, quiz_link: '', quiz_type: 'Demo' }
      ];
    }
  });
  // CBC Senior Secondary: 10,11,12
  ['10','11','12'].forEach((g: string) => {
    if (!grouped.CBC['Senior Secondary']) grouped.CBC['Senior Secondary'] = {};
    if (!grouped.CBC['Senior Secondary'][g] || grouped.CBC['Senior Secondary'][g].length === 0) {
      grouped.CBC['Senior Secondary'][g] = [
        { date: '', level: 'Senior Secondary', subject: 'Demo Quiz', grade: g, number_of_question: '1', quiz_id: `demo-ss-${g}`, quiz_link: '', quiz_type: 'Demo' }
      ];
    }
  });
  // 8-4-4 Secondary: Form 2,3,4
  if (!grouped['844']) grouped['844'] = {};
  ['Form 2','Form 3','Form 4'].forEach((g: string) => {
    if (!grouped['844']['Secondary']) grouped['844']['Secondary'] = {};
    if (!grouped['844']['Secondary'][g] || grouped['844']['Secondary'][g].length === 0) {
      grouped['844']['Secondary'][g] = [
        { date: '', level: g, subject: 'Demo Quiz', grade: g, number_of_question: '1', quiz_id: `demo-844-${g.replace(' ','').toLowerCase()}`, quiz_link: '', quiz_type: 'Demo' }
      ];
    }
  });

  // Print summary of all unique grades and levels
  console.log('Unique grades:', Array.from(uniqueGrades).sort())
  console.log('Unique levels:', Array.from(uniqueLevels).sort())
  console.log('Final grouped data:', grouped)
  return grouped
} 