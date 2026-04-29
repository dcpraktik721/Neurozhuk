// ========================================
// Поймай Жука — Next.js Proxy (Middleware)
// ========================================
// Refreshes Supabase auth cookies on every matched request and
// guards protected routes (`/dashboard`, `/progress`) on the server.

import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export default async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Skip Next internals and static asset URLs.
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav)$).*)',
  ],
};
