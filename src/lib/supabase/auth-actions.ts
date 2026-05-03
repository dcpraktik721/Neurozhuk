// ========================================
// Поймай Жука — Server Auth Actions
// ========================================
// Server Actions for authentication flows.
// Used by auth forms (login, register) via form action.

'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { recordSecurityEvent, hashIdentifier } from '@/lib/security/audit-log';
import { validatePasswordPolicy } from '@/lib/security/password-policy';
import { getClientIp, hashForRateLimit, rateLimit } from '@/lib/security/rate-limit';
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

const AUTH_RATE_LIMIT_ERROR = 'Слишком много попыток. Подождите немного и попробуйте снова.';
const SIGN_IN_ERROR = 'Не удалось войти. Проверьте email и пароль.';
const SIGN_UP_ERROR = 'Не удалось создать аккаунт. Проверьте данные и попробуйте позже.';

async function getAuthRequestContext() {
  const headerStore = await headers();
  const ip = getClientIp(headerStore);
  return {
    ip,
    ipHash: hashIdentifier(ip),
  };
}

function normalizeEmail(raw: FormDataEntryValue | null): string {
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
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

  const { ipHash } = await getAuthRequestContext();
  const signupLimit = rateLimit(`auth:signup:${ipHash}`, 3, 60 * 60 * 1000);
  if (!signupLimit.ok) {
    recordSecurityEvent({
      type: 'auth.signup.rate_limited',
      outcome: 'blocked',
      ipHash,
      reason: 'fixed-window limit exceeded',
    });
    return { error: AUTH_RATE_LIMIT_ERROR };
  }

  const email = normalizeEmail(formData.get('email'));
  const password = formData.get('password') as string;
  const displayNameRaw = formData.get('displayName');
  const displayName =
    typeof displayNameRaw === 'string' ? displayNameRaw.trim() : '';
  const pdnConsent = formData.get('pdnConsent');
  const ageGroupRaw = formData.get('ageGroup');
  const ageGroup =
    ageGroupRaw === 'child' || ageGroupRaw === 'adult' ? ageGroupRaw : 'adult';

  if (!email || !password) {
    return { error: 'Email и пароль обязательны.' };
  }

  const passwordError = validatePasswordPolicy(password);
  if (passwordError) {
    return { error: passwordError };
  }

  if (displayName.length > 64) {
    return { error: 'Имя или никнейм не должен быть длиннее 64 символов.' };
  }

  if (pdnConsent !== 'accepted') {
    return { error: 'Для регистрации необходимо согласие на обработку персональных данных.' };
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
    recordSecurityEvent({
      type: 'auth.signup.failed',
      outcome: 'failure',
      subjectHash: hashForRateLimit(email),
      ipHash,
      reason: error.message,
    });
    return { error: SIGN_UP_ERROR };
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

  recordSecurityEvent({
    type: 'auth.signup.succeeded',
    outcome: 'success',
    actorId: signUpData.user?.id,
    subjectHash: hashForRateLimit(email),
    ipHash,
  });

  redirect('/dashboard');
}

/**
 * Sign in an existing user with email and password.
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase не настроен. Авторизация недоступна.' };
  }

  const { ipHash } = await getAuthRequestContext();
  const email = normalizeEmail(formData.get('email'));
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email и пароль обязательны.' };
  }

  const signInLimit = rateLimit(
    `auth:signin:${ipHash}:${hashForRateLimit(email)}`,
    5,
    15 * 60 * 1000,
  );
  if (!signInLimit.ok) {
    recordSecurityEvent({
      type: 'auth.signin.rate_limited',
      outcome: 'blocked',
      subjectHash: hashForRateLimit(email),
      ipHash,
      reason: 'fixed-window limit exceeded',
    });
    return { error: AUTH_RATE_LIMIT_ERROR };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    recordSecurityEvent({
      type: 'auth.signin.failed',
      outcome: 'failure',
      subjectHash: hashForRateLimit(email),
      ipHash,
      reason: error.message,
    });
    return { error: SIGN_IN_ERROR };
  }

  recordSecurityEvent({
    type: 'auth.signin.succeeded',
    outcome: 'success',
    subjectHash: hashForRateLimit(email),
    ipHash,
  });

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
