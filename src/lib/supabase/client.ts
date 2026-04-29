// ========================================
// Поймай Жука — Browser Supabase Client
// ========================================
// Creates a Supabase client for use in Client Components (browser).

import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn(
      '[Поймай Жука] Supabase не настроен: отсутствуют NEXT_PUBLIC_SUPABASE_URL или NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Работаем в офлайн-режиме.'
    );
    // Return a dummy client that will throw on actual calls —
    // callers must check isSupabaseConfigured() first.
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  }

  client = createBrowserClient(url, key);
  return client;
}

/** Check if Supabase environment variables are properly set */
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
