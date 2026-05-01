'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  Flame,
  BarChart3,
  Clock,
  Award,
  TrendingUp,
  Star,
  Calendar,
  Play,
} from 'lucide-react';
import { RANKS, getRank, type GameSession, type Achievement } from '@/types';
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

function getActivityColor(level: number): string {
  if (level <= 0) return 'bg-slate-100';
  if (level === 1) return 'bg-green-200';
  if (level === 2) return 'bg-green-400';
  return 'bg-green-600';
}

// Get the start of the week (Monday) for a given date, normalized to local midnight
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  return d;
}

interface WeeklyBucket {
  weekKey: string;
  weekStart: Date;
  scores: number[];
  accuracies: number[];
}

function buildWeeklyScores(
  sessions: GameSession[],
): { week: string; score: number; accuracy: number }[] {
  if (sessions.length === 0) return [];

  const buckets = new Map<string, WeeklyBucket>();
  for (const s of sessions) {
    const created = new Date(s.createdAt);
    if (Number.isNaN(created.getTime())) continue;
    const ws = getWeekStart(created);
    const key = ws.toISOString().slice(0, 10);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { weekKey: key, weekStart: ws, scores: [], accuracies: [] };
      buckets.set(key, bucket);
    }
    bucket.scores.push(s.score);
    bucket.accuracies.push(s.accuracy);
  }

  const sorted = Array.from(buckets.values()).sort(
    (a, b) => a.weekStart.getTime() - b.weekStart.getTime(),
  );
  const lastSeven = sorted.slice(-7);

  return lastSeven.map((b) => {
    const avgScore =
      b.scores.reduce((sum, n) => sum + n, 0) / b.scores.length;
    const avgAccuracy =
      b.accuracies.reduce((sum, n) => sum + n, 0) / b.accuracies.length;
    const day = b.weekStart.getDate().toString().padStart(2, '0');
    const month = (b.weekStart.getMonth() + 1).toString().padStart(2, '0');
    return {
      week: `${day}.${month}`,
      score: Math.round(avgScore),
      accuracy: Math.round(avgAccuracy),
    };
  });
}

// 28-day activity grid: index 0 = 27 days ago, index 27 = today
function buildActivity(sessions: GameSession[]): number[] {
  const activity = new Array<number>(28).fill(0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const s of sessions) {
    const created = new Date(s.createdAt);
    if (Number.isNaN(created.getTime())) continue;
    const c = new Date(created);
    c.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (today.getTime() - c.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays < 0 || diffDays > 27) continue;
    const idx = 27 - diffDays;
    activity[idx] += 1;
  }
  return activity;
}

export default function ProgressPage() {
  const router = useRouter();
  const { user, loading: authLoading, isConfigured } = useAuth();
  const { getStats, getSessions, getAchievements } = useGameSessions();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isConfigured) return;
    if (!user) {
      router.push('/auth/login?redirect=/progress');
      return;
    }

    let cancelled = false;
    Promise.all([getStats(), getSessions(1, 50), getAchievements()]).then(
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

  const weeklyScores = useMemo(() => buildWeeklyScores(sessions), [sessions]);
  const activity = useMemo(() => buildActivity(sessions), [sessions]);
  const maxWeeklyScore = useMemo(
    () =>
      weeklyScores.length > 0
        ? Math.max(...weeklyScores.map((w) => w.score), 1)
        : 1,
    [weeklyScores],
  );

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

  if (dataLoading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const bestScore = stats?.bestScore ?? 0;
  const averageScore = Math.round(stats?.averageScore ?? 0);
  const averageAccuracy = Math.round(stats?.averageAccuracy ?? 0);
  const totalPlayTimeSeconds = stats?.totalPlayTime ?? 0;
  const totalPlayTimeHours = Math.floor(totalPlayTimeSeconds / 3600);
  const totalPlayTimeMinutes = Math.floor((totalPlayTimeSeconds % 3600) / 60);
  const currentStreak = stats?.currentStreak ?? 0;
  const longestStreak = stats?.longestStreak ?? 0;

  const currentRank = getRank(bestScore);

  const historyRows = sessions.slice(0, 20);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
            Мой прогресс
          </h1>
          <p className="text-slate-500">Подробная статистика ваших тренировок</p>
        </motion.div>

        {/* All-time Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 mb-3">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{bestScore}</p>
            <p className="text-sm text-slate-500">Лучший результат</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 mb-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{averageScore}</p>
            <p className="text-sm text-slate-500">Средний результат</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 mb-3">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {averageAccuracy}%
            </p>
            <p className="text-sm text-slate-500">Средняя точность</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-50 mb-3">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {totalPlayTimeHours}ч {totalPlayTimeMinutes}м
            </p>
            <p className="text-sm text-slate-500">Общее время</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Score Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Динамика результатов
                </h2>
                <p className="text-sm text-slate-50">
                  Средний балл по неделям
                </p>
              </div>
            </div>

            {weeklyScores.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <p className="text-slate-700 font-semibold mb-1">
                  Пока нет данных
                </p>
                <p className="text-sm text-slate-50">
                  Сыграйте несколько партий, чтобы увидеть динамику
                </p>
              </div>
            ) : (
              <div className="flex items-end gap-3 h-48 mb-4">
                {weeklyScores.map((item, index) => (
                  <div
                    key={`${item.week}-${index}`}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-xs font-semibold text-slate-700">
                      {item.score}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${(item.score / maxWeeklyScore) * 100}%`,
                      }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-green-500 to-teal-400 min-h-[4px]"
                    />
                    <span className="text-xs text-slate-50 mt-1">
                      {item.week}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-50">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Активность</h2>
                <p className="text-sm text-slate-50">Последние 28 дней</p>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {activity.map((level, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-md ${getActivityColor(level)} transition-colors`}
                  title={`${level} тренировок`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-50">Меньше</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm ${getActivityColor(level)}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-50">Больше</span>
            </div>

            {/* Streak info */}
            <div className="mt-5 flex items-center gap-4 p-3 rounded-xl bg-orange-50 border border-orange-100">
              <Flame className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {currentStreak} дн. подряд
                </p>
                <p className="text-xs text-slate-500">
                  Рекорд: {longestStreak} дн.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Rank Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Прогресс рангов
              </h2>
              <p className="text-sm text-slate-50">
                Текущий ранг:{' '}
                <span
                  className="font-semibold"
                  style={{ color: currentRank.color }}
                >
                  {currentRank.name}
                </span>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max pb-2">
              {RANKS.map((rank, index) => {
                const isActive = bestScore >= rank.minScore;
                const isCurrent = currentRank.name === rank.name;
                return (
                  <div key={rank.name} className="flex items-center">
                    <div
                      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                        isCurrent
                          ? 'bg-slate-900 scale-105 shadow-md'
                          : isActive
                          ? 'bg-slate-100'
                          : 'bg-slate-50 opacity-50'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: rank.color }}
                      />
                      <span
                        className={`text-xs font-medium whitespace-nowrap ${
                          isCurrent ? 'text-white' : 'text-slate-600'
                        }`}
                      >
                        {rank.name}
                      </span>
                      <span
                        className={`text-[10px] ${
                          isCurrent ? 'text-slate-300' : 'text-slate-50'
                        }`}
                      >
                        {rank.minScore}+
                      </span>
                    </div>
                    {index < RANKS.length - 1 && (
                      <div
                        className={`w-4 h-0.5 ${
                          isActive ? 'bg-slate-300' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Session History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8"
        >
          <div className="flex items-center gap-3 p-6 pb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              История тренировок
            </h2>
          </div>

          <div className="px-6 pb-6 overflow-x-auto">
            {historyRows.length === 0 ? (
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
                    <th className="text-right text-xs font-semibold text-slate-50 uppercase tracking-wider pb-3">
                      Ранг
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {historyRows.map((session) => {
                    const sessionRank = getRank(session.score);
                    return (
                      <tr key={session.id} className="hover:bg-slate-50/50">
                        <td className="py-3 text-sm text-slate-700">
                          {new Date(session.createdAt).toLocaleDateString(
                            'ru-RU',
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
                        <td className="py-3 text-right">
                          <span
                            className="text-sm font-medium"
                            style={{ color: sessionRank.color }}
                          >
                            {sessionRank.name}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Achievement Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Достижения</h2>
              <p className="text-sm text-slate-50">
                Открыто:{' '}
                {achievements.filter((a) => !!a.unlockedAt).length} из{' '}
                {achievements.length}
              </p>
            </div>
          </div>

          {achievements.length === 0 ? (
            <p className="text-sm text-slate-500 italic text-center py-6">
              Достижения появятся после первой сохранённой игры.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {achievements.map((achievement) => {
                const unlocked = !!achievement.unlockedAt;
                return (
                  <div
                    key={achievement.id}
                    className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all ${
                      unlocked
                        ? 'border-amber-100 bg-amber-50/50'
                        : 'border-slate-100 bg-slate-50 opacity-50 grayscale'
                    }`}
                  >
                    <span className="text-3xl mb-2">{achievement.icon}</span>
                    <p
                      className={`text-xs font-semibold mb-0.5 ${
                        unlocked ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {achievement.title}
                    </p>
                    <p className="text-[10px] text-slate-50 leading-tight">
                      {achievement.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
