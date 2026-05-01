'use client';

import Link from 'next/link';
import {
  Trophy,
  Target,
  Timer,
  Flame,
  RotateCcw,
  Save,
  Share2,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { getRank, RANKS } from '@/types';
import type { GameSession, Achievement } from '@/types';

export type SaveStatus =
  | 'idle'
  | 'saving'
  | 'saved'
  | 'error'
  | 'unauthenticated'
  | 'unconfigured';

interface GameResultsProps {
  session: GameSession | null;
  isOpen: boolean;
  saveStatus?: SaveStatus;
  saveError?: string | null;
  newAchievements?: Achievement[];
  onPlayAgain: () => void;
  onClose: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} сек`;
  return `${m} мин ${s} сек`;
}

export default function GameResults({
  session,
  isOpen,
  saveStatus = 'idle',
  saveError = null,
  newAchievements = [],
  onPlayAgain,
  onClose,
}: GameResultsProps) {
  if (!isOpen || !session) return null;

  const rank = getRank(session.score);
  const rankIndex = RANKS.findIndex((r) => r.name === rank.name);
  const nextRank = rankIndex < RANKS.length - 1 ? RANKS[rankIndex + 1] : null;
  const pointsToNext = nextRank ? nextRank.minScore - session.score : 0;

  const rankObj = RANKS.find((r) => r.name === rank.name);
  const rankEmoji = rankObj && 'emoji' in rankObj
    ? (rankObj as typeof rankObj & { emoji: string }).emoji
    : '';

  const handleShare = async () => {
    const text = `Поймай Жука: ${session.score} очков! Уровень: ${session.level}. Звание: ${rank.name}. Точность: ${session.accuracy}%. Попробуй побить мой рекорд!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Поймай Жука - Результат', text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-green-600/30 via-teal-600/20 to-blue-600/30 px-6 pt-8 pb-6 text-center">
          <p className="text-sm text-slate-300 uppercase tracking-wider font-medium mb-2">Игра окончена</p>

          {/* Score */}
          <div className="mb-3">
            <p className="text-6xl font-bold text-white tabular-nums">{session.score}</p>
            <p className="text-sm text-slate-50 mt-1">очков</p>
          </div>

          {/* Rank badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 mb-2"
            style={{ borderColor: rank.color, backgroundColor: `${rank.color}20` }}
          >
            <Trophy className="w-5 h-5" style={{ color: rank.color }} />
            <span className="font-bold text-lg" style={{ color: rank.color }}>
              {rankEmoji} {rank.name}
            </span>
          </div>

          {nextRank && (
            <p className="text-xs text-slate-50 mt-1">
              До звания «<span style={{ color: nextRank.color }}>{nextRank.name}</span>» -- {pointsToNext} очков
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <Target className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{session.accuracy}%</p>
              <p className="text-xs text-slate-50">Точность</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <Timer className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{formatDuration(session.duration)}</p>
              <p className="text-xs text-slate-50">Время</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{session.maxStreak}</p>
              <p className="text-xs text-slate-50">Макс. серия</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <TrendingUp className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{session.level}</p>
              <p className="text-xs text-slate-50">Уровень</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{session.maxCombo}</p>
              <p className="text-xs text-slate-50">Макс. комбо</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{session.totalCorrect ?? session.correctAnswers}</p>
              <p className="text-xs text-slate-50">Правильных</p>
            </div>
            {(session.totalWrong ?? 0) > 0 && (
              <div className="bg-slate-900/60 rounded-xl p-3 text-center col-span-2">
                <XCircle className="w-4 h-4 text-red-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{session.totalWrong}</p>
                <p className="text-xs text-slate-50">Ошибок</p>
              </div>
            )}
          </div>

          {/* New achievements banner */}
          {newAchievements.length > 0 && (
            <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <p className="text-sm font-bold text-amber-200">Новые достижения!</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {newAchievements.map((a) => (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-xs text-amber-100"
                    title={a.description}
                  >
                    <span>{a.icon}</span>
                    <span className="font-medium">{a.title}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Save status banner */}
          <SaveStatusBanner status={saveStatus} error={saveError} />

          {/* Actions */}
          <div className="space-y-2 mt-3">
            <button
              onClick={onPlayAgain}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Играть ещё
            </button>

            <div className="flex gap-2">
              <SaveActionButton status={saveStatus} onClose={onClose} />
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 px-4 border border-slate-600/50 hover:bg-slate-700/50 text-slate-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Share2 className="w-4 h-4" />
                Поделиться
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Subcomponents ─────────────────────────────────

function SaveStatusBanner({ status, error }: { status: SaveStatus; error: string | null }) {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Сохраняем результат…</span>
      </div>
    );
  }
  if (status === 'saved') {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-200">
        <CheckCircle className="w-4 h-4" />
        <span>Результат сохранён в вашем профиле</span>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>{error || 'Не удалось сохранить результат. Попробуйте позже.'}</span>
      </div>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-slate-600/40 bg-slate-700/30 px-3 py-2 text-sm text-slate-50">
        <Save className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>Зарегистрируйтесь, чтобы сохранять результаты и отслеживать прогресс.</span>
      </div>
    );
  }
  if (status === 'unconfigured') {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>Результат не сохраняется: Supabase не настроен.</span>
      </div>
    );
  }
  return null;
}

function SaveActionButton({ status, onClose }: { status: SaveStatus; onClose: () => void }) {
  // Authenticated and saved → link to /progress
  if (status === 'saved') {
    return (
      <Link
        href="/progress"
        onClick={onClose}
        className="flex-1 py-2.5 px-4 border border-green-600/50 hover:bg-green-600/20 text-green-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
      >
        <TrendingUp className="w-4 h-4" />
        Прогресс
      </Link>
    );
  }
  // Saving — show disabled spinner
  if (status === 'saving') {
    return (
      <button
        type="button"
        disabled
        className="flex-1 py-2.5 px-4 border border-slate-600/50 text-slate-50 rounded-xl font-medium flex items-center justify-center gap-2 text-sm opacity-70 cursor-progress"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Сохраняем
      </button>
    );
  }
  // Error — link to dashboard so user can retry context
  if (status === 'error') {
    return (
      <Link
        href="/dashboard"
        onClick={onClose}
        className="flex-1 py-2.5 px-4 border border-red-600/40 hover:bg-red-600/15 text-red-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
      >
        <AlertCircle className="w-4 h-4" />
        Кабинет
      </Link>
    );
  }
  // Unauthenticated — push to register
  if (status === 'unauthenticated') {
    return (
      <Link
        href="/auth/register"
        onClick={onClose}
        className="flex-1 py-2.5 px-4 border border-emerald-600/50 hover:bg-emerald-600/20 text-emerald-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
      >
        <Save className="w-4 h-4" />
        Сохранять
      </Link>
    );
  }
  // Idle / unconfigured — silent
  return (
    <span className="flex-1" />
  );
}
