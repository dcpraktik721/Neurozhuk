import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export function GET() {
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
