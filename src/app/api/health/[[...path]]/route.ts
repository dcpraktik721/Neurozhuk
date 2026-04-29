import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  console.info('[healthcheck] GET', {
    url: request.url,
    host: request.headers.get('host'),
    userAgent: request.headers.get('user-agent'),
  });

  return NextResponse.json(
    {
      status: 'ok',
      service: 'neurozhuk',
      supabaseConfigured: isSupabaseConfigured(),
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}

export function HEAD(request: Request) {
  console.info('[healthcheck] HEAD', {
    url: request.url,
    host: request.headers.get('host'),
    userAgent: request.headers.get('user-agent'),
  });

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
