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
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.34),transparent_34%),linear-gradient(135deg,#020617_0%,#0f2f3a_46%,#04130f_100%)] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[linear-gradient(180deg,#07565a_0%,#0b2b4a_43%,#0b1728_100%)] border border-emerald-300/30 rounded-2xl shadow-[0_28px_90px_rgba(2,44,34,0.55)] max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header summary */}
        <div className="bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.38),transparent_44%),linear-gradient(135deg,rgba(5,150,105,0.88),rgba(20,83,45,0.70)_48%,rgba(15,23,42,0.24))] px-6 pt-8 pb-6 text-center">
          <p className="text-sm !text-white uppercase tracking-wider font-medium mb-2">Игра окончена</p>

          {/* Score */}
          <div className="mb-3">
            <p className="text-6xl font-bold !text-white tabular-nums">{session.score}</p>
            <p className="text-sm !text-white mt-1">очков</p>
          </div>

          {/* Rank */}
          <div className="inline-flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-lg text-white">
              {rankEmoji} {rank.name}
            </span>
          </div>

          {nextRank && (
            <p className="text-xs !text-white mt-1">
              До звания «<span className="font-semibold text-amber-200">{nextRank.name}</span>» -- {pointsToNext} очков
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-900/90 border border-cyan-300/25 rounded-xl p-3 text-center">
              <Target className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-2xl font-bold !text-white">{session.accuracy}%</p>
              <p className="text-xs !text-cyan-100">Точность</p>
            </div>
            <div className="bg-slate-900/90 border border-sky-300/25 rounded-xl p-3 text-center">
              <Timer className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <p className="text-xl font-bold !text-white">{formatDuration(session.duration)}</p>
              <p className="text-xs !text-sky-100">Время</p>
            </div>
            <div className="bg-slate-900/90 border border-orange-300/25 rounded-xl p-3 text-center">
              <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <p className="text-2xl font-bold !text-white">{session.maxStreak}</p>
              <p className="text-xs !text-orange-100">Макс. серия</p>
            </div>
            <div className="bg-slate-900/90 border border-violet-300/25 rounded-xl p-3 text-center">
              <TrendingUp className="w-4 h-4 text-violet-400 mx-auto mb-1" />
              <p className="text-2xl font-bold !text-white">{session.level}</p>
              <p className="text-xs !text-violet-100">Уровень</p>
            </div>
            <div className="bg-slate-900/90 border border-amber-300/25 rounded-xl p-3 text-center">
              <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-2xl font-bold !text-white">{session.maxCombo}</p>
              <p className="text-xs !text-amber-100">Макс. комбо</p>
            </div>
            <div className="bg-slate-900/90 border border-emerald-300/25 rounded-xl p-3 text-center">
              <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-2xl font-bold !text-white">{session.totalCorrect ?? session.correctAnswers}</p>
              <p className="text-xs !text-emerald-100">Правильных</p>
            </div>
            {(session.totalWrong ?? 0) > 0 && (
              <div className="bg-rose-950/80 border border-rose-300/30 rounded-xl p-3 text-center col-span-2">
                <XCircle className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                <p className="text-2xl font-bold !text-rose-100">{session.totalWrong}</p>
                <p className="text-xs !text-rose-100">Ошибок</p>
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
                className="flex-1 py-2.5 px-4 border border-emerald-300/35 bg-slate-950/35 hover:bg-emerald-300/10 text-emerald-50 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
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
      <div className="flex items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Сохраняем результат…</span>
      </div>
    );
  }
  if (status === 'saved') {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
        <CheckCircle className="w-4 h-4" />
        <span>Результат сохранён в вашем профиле</span>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>{error || 'Не удалось сохранить результат. Попробуйте позже.'}</span>
      </div>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-emerald-300/20 bg-slate-950/45 px-3 py-2 text-sm text-slate-100">
        <Save className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>Зарегистрируйтесь, чтобы сохранять результаты и отслеживать прогресс.</span>
      </div>
    );
  }
  if (status === 'unconfigured') {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
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
        className="flex-1 py-2.5 px-4 border border-emerald-300/35 bg-slate-950/35 hover:bg-emerald-300/10 text-emerald-50 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
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
        className="flex-1 py-2.5 px-4 border border-slate-400/20 text-slate-300 rounded-xl font-medium flex items-center justify-center gap-2 text-sm opacity-70 cursor-progress"
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
        className="flex-1 py-2.5 px-4 border border-rose-400/35 bg-slate-950/35 hover:bg-rose-400/10 text-rose-100 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
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
        className="flex-1 py-2.5 px-4 border border-emerald-300/35 bg-slate-950/35 hover:bg-emerald-300/10 text-emerald-50 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
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
