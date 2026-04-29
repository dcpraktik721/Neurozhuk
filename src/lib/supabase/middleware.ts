// ========================================
// Поймай Жука — Supabase Middleware Helper
// ========================================
// Refreshes the Supabase auth session on every request
// by reading/writing cookies through Next.js middleware.

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, skip session refresh
  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do NOT run supabase.auth.getSession() here.
  // Use getUser() instead — it validates the JWT against the Supabase Auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes — redirect unauthenticated users to login
  const protectedPaths = ['/dashboard', '/progress'];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
