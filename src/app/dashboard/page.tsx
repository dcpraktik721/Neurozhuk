'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Play,
  Trophy,
  Target,
  Flame,
  BarChart3,
  Clock,
  Award,
  TrendingUp,
  ArrowRight,
  Star,
} from 'lucide-react';
import { getRank, type GameSession, type Achievement } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useGameSessions, type UserStats } from '@/hooks/useGameSessions';

const MODE_LABELS: Record<string, string> = {
  normal: 'Обычный',
  timed: 'На время',
  practice: 'Практика',
};

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isConfigured } = useAuth();
  const { getStats, getSessions, getAchievements } = useGameSessions();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isConfigured) return;
    if (!user) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }

    let cancelled = false;
    Promise.all([getStats(), getSessions(1, 5), getAchievements()]).then(
      ([s, list, ach]) => {
        if (cancelled) return;
        setStats(s);
        setSessions(list?.sessions || []);
        setAchievements(ach || []);
        setDataLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [authLoading, isConfigured, user, router, getStats, getSessions, getAchievements]);

  // Demo mode (Supabase not configured)
  if (!isConfigured && !authLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-amber-50">
              <BarChart3 className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
              Демо-режим
            </h1>
            <p className="text-slate-500 mb-6">
              Платформа работает в демо-режиме. Подключите Supabase для
              сохранения прогресса.
            </p>
            <Link
              href="/play"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Играть
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Loading state
  if (dataLoading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const bestScore = stats?.bestScore ?? 0;
  const totalSessions = stats?.totalSessions ?? 0;
  const averageScore = Math.round(stats?.averageScore ?? 0);
  const accuracy = Math.round(stats?.averageAccuracy ?? 0);
  const currentStreak = stats?.currentStreak ?? 0;

  const rank = getRank(bestScore);

  const displayName =
    profile?.displayName || user?.email?.split('@')[0] || 'Игрок';

  const statsCards = [
    {
      icon: Trophy,
      label: 'Всего сессий',
      value: totalSessions.toString(),
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Star,
      label: 'Лучший результат',
      value: bestScore.toString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: BarChart3,
      label: 'Средний результат',
      value: averageScore.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Target,
      label: 'Точность',
      value: `${accuracy}%`,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Flame,
      label: 'Серия',
      value: `${currentStreak} дн.`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">
                Привет, {displayName}! 👋
              </h1>
              <p className="text-slate-500">
                Текущий ранг:{' '}
                <span
                  className="font-semibold"
                  style={{ color: rank.color }}
                >
                  {rank.name}
                </span>
              </p>
            </div>
            <Link
              href="/play"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Начать тренировку
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        >
          {statsCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-xl ${stat.bgColor} mb-3`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Последние тренировки
                </h2>
              </div>
              <Link
                href="/progress"
                className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium group"
              >
                Все
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="px-6 pb-6">
              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-slate-100">
                    <Play className="w-6 h-6 text-slate-50" />
                  </div>
                  <p className="text-slate-700 font-semibold mb-1">
                    Сыграйте первую партию
                  </p>
                  <p className="text-sm text-slate-50 mb-4">
                    История тренировок появится здесь
                  </p>
                  <Link
                    href="/play"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <Play className="w-4 h-4" />
                    Начать игру
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left text-xs font-semibold text-slate-50 uppercase tracking-wider pb-3">
                          Дата
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-50 uppercase tracking-wider pb-3">
                          Режим
                        </th>
                        <th className="text-right text-xs font-semibold text-slate-50 uppercase tracking-wider pb-3">
                          Очки
                        </th>
                        <th className="text-right text-xs font-semibold text-slate-50 uppercase tracking-wider pb-3">
                          Точность
                        </th>
                        <th className="text-right text-xs font-semibold text-slate-50 uppercase tracking-wider pb-3">
                          Время
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {sessions.slice(0, 5).map((session) => (
                        <tr key={session.id} className="hover:bg-slate-50/50">
                          <td className="py-3 text-sm text-slate-700">
                            {new Date(session.createdAt).toLocaleDateString(
                              'ru-RU'
                            )}
                          </td>
                          <td className="py-3">
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                              {MODE_LABELS[session.mode] ?? session.mode}
                            </span>
                          </td>
                          <td className="py-3 text-right text-sm font-semibold text-slate-900">
                            {session.score}
                          </td>
                          <td className="py-3 text-right text-sm text-slate-600">
                            {Math.round(session.accuracy)}%
                          </td>
                          <td className="py-3 text-right text-sm text-slate-500">
                            {formatDuration(session.duration)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Достижения
                </h2>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-3">
              {achievements.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-3">
                  Пока нет достижений. Сыграйте первую игру, чтобы открыть награды.
                </p>
              ) : (
                achievements.slice(0, 4).map((achievement) => {
                  const unlocked = !!achievement.unlockedAt;
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        unlocked
                          ? 'border-slate-100 bg-white'
                          : 'border-slate-100 bg-slate-50 opacity-60'
                      }`}
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold ${
                            unlocked ? 'text-slate-900' : 'text-slate-500'
                          }`}
                        >
                          {achievement.title}
                        </p>
                        <p className="text-xs text-slate-50 truncate">
                          {achievement.description}
                        </p>
                      </div>
                      {unlocked && (
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-green-100">
                          <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              <Link
                href="/progress"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium rounded-xl hover:bg-emerald-50 transition-all group"
              >
                Все достижения
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
