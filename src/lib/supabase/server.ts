// ========================================
// Поймай Жука — Server Supabase Client
// ========================================
// Creates a Supabase client for use in Server Components,
// Route Handlers, and Server Actions.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn(
      '[Поймай Жука] Supabase не настроен на сервере. ' +
      'Установите NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
    // Return a non-functional client; callers should use isSupabaseConfigured()
    return createServerClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {
            // no-op
          },
        },
      }
    );
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method is called from a Server Component.
          // This can be ignored if middleware refreshes the session.
        }
      },
    },
  });
}

/** Check if Supabase environment variables are properly set (server-side) */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  // Detect placeholder values
  if (url.includes('your-project-url') || url.includes('placeholder')) return false;
  if (key.includes('your-anon-key') || key.includes('placeholder')) return false;
  // Real Supabase URL должен быть https://xxx.supabase.co
  if (!url.startsWith('https://') || !url.includes('.supabase.')) return false;
  return true;
}
