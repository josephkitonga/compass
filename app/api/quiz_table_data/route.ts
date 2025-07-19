import { NextRequest, NextResponse } from 'next/server';

const ROODITO_API_BASE = 'https://roodito.com/Api_controller/quiz_table_data';
const TUTOR_ID = '62fa2e148efknmg';
const REQUEST_TIMEOUT = 30000; // 30 seconds

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '20';
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const level = searchParams.get('level');
    const quizType = searchParams.get('quiz_type');

    // Build query string with required tutor_id
    const queryParams = new URLSearchParams({
      page,
      per_page: perPage,
      tutor_id: TUTOR_ID
    });

    // Add optional parameters if provided
    if (subject) queryParams.append('subject', subject);
    if (grade) queryParams.append('grade', grade);
    if (level) queryParams.append('level', level);
    if (quizType) queryParams.append('quiz_type', quizType);

    const apiUrl = `${ROODITO_API_BASE}?${queryParams.toString()}`;
    
    console.log(`[API] Fetching: ${apiUrl}`);

    // Setup timeout and abort controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error(`[API] Timeout after ${REQUEST_TIMEOUT}ms:`, apiUrl);
    }, REQUEST_TIMEOUT);

    // Make API request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'NMG-Quiz-Portal/1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle response
    if (!response.ok) {
      console.error(`[API] Error ${response.status}:`, response.statusText);
      return NextResponse.json(
        {
          error: 'API_ERROR',
          status: response.status,
          message: `Upstream API returned ${response.status}`,
          timestamp: new Date().toISOString()
        },
        { status: response.status }
      );
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      try {
        data = JSON.parse(textData);
      } catch {
        console.warn('[API] Non-JSON response received, returning as text');
        data = { raw: textData };
      }
    }

    console.log(`[API] Success: ${data?.data?.length || 0} quizzes returned`);
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
        'X-API-Version': '1.0',
        'X-Tutor-ID': TUTOR_ID
      }
    });

  } catch (error: any) {
    console.error('[API] Unexpected error:', error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        {
          error: 'TIMEOUT',
          message: 'Request timed out',
          timestamp: new Date().toISOString()
        },
        { status: 408 }
      );
    }

    return NextResponse.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 