'use client';

import { Suspense, useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bug, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { signIn } from '@/lib/supabase/auth-actions';

// ── Inner form: uses useSearchParams() and therefore must live inside <Suspense>.
function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
      {/* Error block */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hidden redirect */}
        <input type="hidden" name="redirect" value={redirectTo} />

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-50" />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
              disabled={isPending}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700"
            >
              Пароль
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-50" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-50 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? (
                <EyeOff className="w-4.5 h-4.5" />
              ) : (
                <Eye className="w-4.5 h-4.5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              Вход...
            </>
          ) : (
            <>
              <LogIn className="w-4.5 h-4.5" />
              Войти
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ── Skeleton shown while LoginForm is suspending on useSearchParams()
function LoginFormSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 animate-pulse">
      <div className="space-y-5">
        <div className="h-12 rounded-xl bg-slate-100" />
        <div className="h-12 rounded-xl bg-slate-100" />
        <div className="h-14 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-md">
              <Bug className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              Поймай Жука
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            Вход в аккаунт
          </h1>
          <p className="text-slate-500">
            Войдите, чтобы отслеживать свой прогресс
          </p>
        </div>

        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>

        {/* Register link */}
        <p className="text-center mt-6 text-slate-500">
          Нет аккаунта?{' '}
          <Link
            href="/auth/register"
            className="text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            Зарегистрируйтесь
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
