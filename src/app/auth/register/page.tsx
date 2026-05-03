'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bug, Mail, Lock, Eye, EyeOff, User, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { MIN_PASSWORD_LENGTH, validatePasswordPolicy } from '@/lib/security/password-policy';
import { signUp } from '@/lib/supabase/auth-actions';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ageGroup, setAgeGroup] = useState<'child' | 'adult'>('adult');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    const passwordError = validatePasswordPolicy(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (!agreed) {
      setError('Необходимо принять условия использования и согласие на обработку персональных данных');
      return;
    }

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signUp(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

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
            Создать аккаунт
          </h1>
          <p className="text-slate-500">
            Зарегистрируйтесь и начните тренировку
          </p>
        </div>

        {/* Form Card */}
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
            {/* Hidden ageGroup — server reads from FormData */}
            <input type="hidden" name="ageGroup" value={ageGroup} />

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Имя или никнейм
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-50" />
                <input
                  id="name"
                  name="displayName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Можно оставить пустым"
                  maxLength={64}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  disabled={isPending}
                />
              </div>
            </div>

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
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-50" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={`Минимум ${MIN_PASSWORD_LENGTH} символов, буквы и цифры`}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-50 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-50" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-50 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Возрастная группа
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAgeGroup('child')}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    ageGroup === 'child'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">👧</span>
                  <span className="text-sm font-medium">
                    Ребёнок (7&ndash;14)
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setAgeGroup('adult')}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    ageGroup === 'adult'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">👨‍💼</span>
                  <span className="text-sm font-medium">Взрослый (15+)</span>
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                name="pdnConsent"
                type="checkbox"
                value="accepted"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-slate-500">
                Я принимаю{' '}
                <Link
                  href="/terms"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  пользовательское соглашение
                </Link>{' '}
                и даю{' '}
                <Link
                  href="/consent"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  согласие на обработку персональных данных
                </Link>{' '}
                для регистрации, ведения аккаунта, сохранения игрового прогресса и обратной связи. Подробнее —{' '}
                <Link
                  href="/privacy"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  политика обработки персональных данных
                </Link>
              </label>
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
                  Создание...
                </>
              ) : (
                <>
                  <UserPlus className="w-4.5 h-4.5" />
                  Создать аккаунт
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-slate-500">
          Уже есть аккаунт?{' '}
          <Link
            href="/auth/login"
            className="text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            Войдите
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
