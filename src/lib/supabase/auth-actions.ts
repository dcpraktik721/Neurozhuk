// ========================================
// Поймай Жука — Server Auth Actions
// ========================================
// Server Actions for authentication flows.
// Used by auth forms (login, register) via form action.

'use server';

import { redirect } from 'next/navigation';
import { createClient, isSupabaseConfigured } from './server';

export interface AuthResult {
  error: string | null;
}

function safeRedirectPath(raw: FormDataEntryValue | null): string {
  if (typeof raw !== 'string') return '/dashboard';

  const value = raw.trim();
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return '/dashboard';
  }

  return value;
}

/**
 * Sign up a new user with email, password, display name and age group.
 * Creates the auth user; the DB trigger will auto-create the profile
 * (with age_group from raw_user_meta_data) and user_stats rows.
 *
 * If a session is established (no email-confirmation required), we also
 * defensively UPDATE the profile row to make sure age_group is recorded
 * even if the trigger ran with a stale function definition.
 */
export async function signUp(formData: FormData): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase не настроен. Регистрация недоступна.' };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const displayName = formData.get('displayName') as string;
  const ageGroupRaw = formData.get('ageGroup');
  const ageGroup =
    ageGroupRaw === 'child' || ageGroupRaw === 'adult' ? ageGroupRaw : 'adult';

  if (!email || !password) {
    return { error: 'Email и пароль обязательны.' };
  }

  if (password.length < 6) {
    return { error: 'Пароль должен содержать минимум 6 символов.' };
  }

  const supabase = await createClient();

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || '',
        age_group: ageGroup,
      },
    },
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  // If we got a session immediately (email confirmation disabled), make
  // sure the profile row carries the right age_group / display_name.
  if (signUpData.user && signUpData.session) {
    await supabase
      .from('profiles')
      .update({
        display_name: displayName || '',
        age_group: ageGroup,
      })
      .eq('id', signUpData.user.id);
  }

  redirect('/dashboard');
}

/**
 * Sign in an existing user with email and password.
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase не настроен. Авторизация недоступна.' };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email и пароль обязательны.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  redirect(safeRedirectPath(formData.get('redirect')));
}

/**
 * Sign out the current user and redirect to home.
 */
export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) {
    redirect('/');
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

// ── Helpers ──

function translateError(message: string): string {
  const translations: Record<string, string> = {
    'Invalid login credentials': 'Неверный email или пароль.',
    'Email not confirmed': 'Email не подтверждён. Проверьте почту.',
    'User already registered': 'Пользователь с таким email уже зарегистрирован.',
    'Password should be at least 6 characters': 'Пароль должен содержать минимум 6 символов.',
    'Signup requires a valid password': 'Введите корректный пароль.',
    'Unable to validate email address: invalid format': 'Некорректный формат email.',
    'Email rate limit exceeded': 'Слишком много попыток. Подождите немного.',
  };
  return translations[message] || `Ошибка: ${message}`;
}
