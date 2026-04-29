'use client';

import { Trophy, Target, Timer, Star } from 'lucide-react';
import { getRank, RANKS } from '@/types';
import type { GameMode, GameState } from '@/types';

interface GameStatsProps {
  score: number;
  bestScore: number;
  time: number;
  accuracy: number;
  streak: number;
  equation: string;
  mode: GameMode;
  gameState: GameState;
  level: number;
  levelProgress: number;
  levelTarget: number;
  combo: number;
  totalCorrect: number;
  totalWrong: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}


export default function GameStats({
  score,
  bestScore,
  time,
  accuracy,
  streak,
  equation,
  mode,
  gameState,
  level,
  levelProgress,
  levelTarget,
  combo,
  totalCorrect,
  totalWrong,
}: GameStatsProps) {
  const rank = getRank(score);
  const rankObj = RANKS.find((r) => r.name === rank.name);
  const rankEmoji = rankObj && 'emoji' in rankObj ? (rankObj as typeof rankObj & { emoji: string }).emoji : '';
  const isActive = gameState === 'playing' || gameState === 'paused';

  return (
    <div className="space-y-3">
      {/* Equation — most prominent */}
      {isActive && equation && (
        <div className="bg-gradient-to-r from-amber-700 to-orange-700 border-2 border-amber-400 rounded-2xl p-4 text-center shadow-lg shadow-amber-900/30">
          <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: '#ffffff' }}>НАЙДИ ЖУКА С ЧИСЛОМ</p>
          <p className="text-3xl md:text-4xl font-black tracking-wide" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{equation}</p>
        </div>
      )}

      {/* Score */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-green-400" />
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Очки</span>
        </div>
        <p className="text-4xl font-bold text-white tabular-nums">{score}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Trophy className="w-3 h-3 text-amber-400" />
          <span className="text-xs text-slate-400">Рекорд: <span className="text-amber-400 font-medium">{bestScore}</span></span>
        </div>
      </div>

      {/* Level with progress bar */}
      {isActive && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Уровень</span>
            <span className="text-sm font-bold text-white">{level}</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (levelProgress / levelTarget) * 100)}%`,
                background: 'linear-gradient(to right, #22C55E, #FFD700)',
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 text-right">{levelProgress}/{levelTarget}</p>
        </div>
      )}

      {/* Combo */}
      {isActive && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Комбо</span>
          </div>
          <p className={`text-2xl font-bold tabular-nums ${
            combo >= 10 ? 'text-red-400' : combo >= 5 ? 'text-orange-400' : 'text-white'
          }`}>
            {combo}{combo >= 5 ? ' 🔥' : ''}
          </p>
        </div>
      )}

      {/* Rank */}
      {isActive && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Звание</span>
          </div>
          <p className="text-lg font-bold" style={{ color: rank.color }}>
            {rankEmoji} {rank.name}
          </p>
        </div>
      )}

      {/* Timer */}
      {isActive && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Timer className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              {mode === 'timed' ? 'Осталось' : 'Время'}
            </span>
          </div>
          <p className={`text-2xl font-bold tabular-nums ${
            mode === 'timed' && time <= 30 ? 'text-red-400 animate-pulse' : 'text-white'
          }`}>
            {formatTime(time)}
          </p>
        </div>
      )}

      {/* Accuracy */}
      {isActive && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Точность</span>
          </div>
          <p className="text-2xl font-bold text-white">{accuracy}%</p>
        </div>
      )}

      {/* Correct / Wrong counters */}
      {isActive && (totalCorrect > 0 || totalWrong > 0) && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">Ответы</p>
          <div className="flex gap-4">
            <div>
              <p className="text-xl font-bold text-green-400">{totalCorrect}</p>
              <p className="text-xs text-slate-500">Верно</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-400">{totalWrong}</p>
              <p className="text-xs text-slate-500">Ошибок</p>
            </div>
          </div>
        </div>
      )}

      {/* Streak */}
      {isActive && streak > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Серия</span>
          </div>
          <p className={`text-2xl font-bold ${streak >= 5 ? 'text-orange-400' : streak >= 3 ? 'text-amber-400' : 'text-white'}`}>
            {streak}{streak >= 5 ? ' 🔥' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
