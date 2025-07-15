import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const search = req.nextUrl.search || '';
  const url = 'https://roodito.com/Api_controller/quiz_table_data' + search;

  try {
    const controller = new AbortController();
    let didTimeout = false;
    const timeout = setTimeout(() => {
      didTimeout = true;
      console.error('Proxy fetch timeout: aborting after 30s', url);
      controller.abort();
    }, 30000); // 30s timeout

    const apiRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (didTimeout) {
      return NextResponse.json(
        { error: 'Proxy timeout', message: 'The upstream API took too long to respond.' },
        { status: 504 }
      );
    }

    const contentType = apiRes.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await apiRes.json();
    } else {
      data = await apiRes.text();
    }

    if (!apiRes.ok) {
      console.error('Upstream API error:', apiRes.status, data);
      return NextResponse.json(
        { error: 'Upstream API error', status: apiRes.status, data },
        { status: apiRes.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy error', message: error.message || String(error) },
      { status: 500 }
    );
  }
} 