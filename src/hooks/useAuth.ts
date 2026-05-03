// ========================================
// Поймай Жука — useAuth Hook
// ========================================
// Manages authentication state on the client side.
// Subscribes to Supabase auth changes, caches profile data.

'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { validatePasswordPolicy } from '@/lib/security/password-policy';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl?: string;
  ageGroup: 'child' | 'adult';
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const configured = isSupabaseConfigured();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // Lazy init: only "loading" if Supabase is actually wired — otherwise
  // there is nothing to load and we shouldn't trigger a setState in the effect.
  const [loading, setLoading] = useState(() => configured);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile from Supabase
  const fetchProfile = useCallback(async (userId: string) => {
    if (!configured) return;
    try {
      const supabase = createClient();
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, age_group')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('[useAuth] profile fetch error:', profileError);
        return;
      }

      if (data) {
        setProfile({
          id: data.id,
          displayName: data.display_name,
          avatarUrl: data.avatar_url ?? undefined,
          ageGroup: data.age_group as 'child' | 'adult',
        });
      }
    } catch (err) {
      console.error('[useAuth] unexpected profile error:', err);
    }
  }, [configured]);

  // Initialize auth state and subscribe to changes.
  // When Supabase is not configured we exit immediately — `loading`
  // is already initialised to `false` via the lazy useState above,
  // so we don't need to call setState inside the effect body.
  useEffect(() => {
    if (!configured) {
      return;
    }

    const supabase = createClient();

    // Get the initial session
    supabase.auth.getSession().then(({ data: { session: s } }: { data: { session: Session | null } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
      }
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, s: Session | null) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          fetchProfile(s.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [configured, fetchProfile]);

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    if (!configured) {
      return { error: 'Supabase не настроен. Авторизация недоступна.' };
    }
    setError(null);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        const msg = translateAuthError(signInError.message);
        setError(msg);
        return { error: msg };
      }
      return { error: null };
    } catch {
      const msg = 'Произошла непредвиденная ошибка при входе.';
      setError(msg);
      return { error: msg };
    }
  }, [configured]);

  // Sign up with email/password and display name
  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    if (!configured) {
      return { error: 'Supabase не настроен. Регистрация недоступна.' };
    }
    const passwordError = validatePasswordPolicy(password);
    if (passwordError) {
      return { error: passwordError };
    }
    setError(null);
    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      if (signUpError) {
        const msg = translateAuthError(signUpError.message);
        setError(msg);
        return { error: msg };
      }
      return { error: null };
    } catch {
      const msg = 'Произошла непредвиденная ошибка при регистрации.';
      setError(msg);
      return { error: msg };
    }
  }, [configured]);

  // Sign out
  const signOut = useCallback(async () => {
    if (!configured) return;
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      // Redirect to home page after sign out
      window.location.href = '/';
    } catch (err) {
      console.error('[useAuth] signOut error:', err);
    }
  }, [configured]);

  return {
    user,
    session,
    profile,
    loading,
    error,
    isConfigured: configured,
    signIn,
    signUp,
    signOut,
  };
}

// ── Helpers ──

function translateAuthError(message: string): string {
  if (message === 'Password should be at least 6 characters') {
    return 'Пароль не соответствует требованиям безопасности.';
  }

  return 'Не удалось выполнить операцию. Проверьте данные и попробуйте позже.';
}
