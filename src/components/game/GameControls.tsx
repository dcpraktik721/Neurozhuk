'use client';

import { Play, Pause, RotateCcw, BookOpen, Keyboard, Volume2, VolumeX, Flag } from 'lucide-react';
import type { GameMode, GameState, DifficultyMode } from '@/types';

interface GameControlsProps {
  mode: GameMode;
  gameState: GameState;
  difficultyMode: DifficultyMode;
  musicEnabled: boolean;
  onModeChange: (mode: GameMode) => void;
  onDifficultyModeChange: (mode: DifficultyMode) => void;
  onMusicToggle: () => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onFinish: () => void;
  onShowRules: () => void;
}

export default function GameControls({
  mode,
  gameState,
  difficultyMode,
  musicEnabled,
  onModeChange,
  onDifficultyModeChange,
  onMusicToggle,
  onStart,
  onPause,
  onResume,
  onReset,
  onFinish,
  onShowRules,
}: GameControlsProps) {
  const isIdle = gameState === 'idle' || gameState === 'ended';
  const isPlaying = gameState === 'playing';
  const isPaused = gameState === 'paused';

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 space-y-4">
      {/* Mode selector — 3 options */}
      <div>
        <p className="text-xs text-slate-50 uppercase tracking-wider mb-2 font-medium">Режим игры</p>
        <div className="flex gap-1 bg-slate-900/60 rounded-xl p-1">
          <button
            onClick={() => onModeChange('normal')}
            disabled={!isIdle}
            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'normal'
                ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg shadow-green-600/25'
                : 'text-slate-50 hover:text-white'
            } disabled:opacity-60`}
          >
            Обычный
          </button>
          <button
            onClick={() => onModeChange('timed')}
            disabled={!isIdle}
            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'timed'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/25'
                : 'text-slate-50 hover:text-white'
            } disabled:opacity-60`}
          >
            На время
          </button>
          <button
            onClick={() => onModeChange('practice')}
            disabled={!isIdle}
            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'practice'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-50 hover:text-white'
            } disabled:opacity-60`}
          >
            Трен.
          </button>
        </div>
      </div>

      {/* Difficulty selector */}
      <div>
        <p className="text-xs text-slate-50 uppercase tracking-wider mb-2 font-medium">Сложность</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onDifficultyModeChange('easy')}
            disabled={!isIdle}
            className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
              difficultyMode === 'easy'
                ? 'bg-green-600/30 border border-green-500/50 text-green-300'
                : 'bg-slate-900/40 border border-slate-700/50 text-slate-50 hover:text-white'
            } disabled:opacity-60`}
          >
            🟢 Легкий (с подсказкой)
          </button>
          <button
            onClick={() => onDifficultyModeChange('normal')}
            disabled={!isIdle}
            className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
              difficultyMode === 'normal'
                ? 'bg-yellow-600/30 border border-yellow-500/50 text-yellow-300'
                : 'bg-slate-900/40 border border-slate-700/50 text-slate-50 hover:text-white'
            } disabled:opacity-60`}
          >
            🟡 Норма (без подсказки)
          </button>
        </div>
      </div>

      {/* Music toggle */}
      <div>
        <p className="text-xs text-slate-50 uppercase tracking-wider mb-2 font-medium">Музыка</p>
        <button
          onClick={onMusicToggle}
          className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between gap-2 ${
            musicEnabled
              ? 'bg-purple-600/30 border border-purple-500/50 text-purple-200'
              : 'bg-slate-900/40 border border-slate-700/50 text-slate-50 hover:text-white'
          }`}
          aria-pressed={musicEnabled}
          aria-label={musicEnabled ? 'Выключить музыку' : 'Включить музыку'}
        >
          <span className="flex items-center gap-2">
            {musicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{musicEnabled ? 'Включена' : 'Выключена'}</span>
          </span>
          <span
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              musicEnabled ? 'bg-purple-500' : 'bg-slate-700'
            }`}
            aria-hidden="true"
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                musicEnabled ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        {isIdle && (
          <button
            onClick={onStart}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" fill="currentColor" />
            Начать игру
          </button>
        )}

        {isPlaying && (
          <button
            onClick={onPause}
            className="w-full py-2.5 px-4 bg-slate-700/80 hover:bg-slate-600/80 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Пауза
          </button>
        )}

        {isPaused && (
          <button
            onClick={onResume}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            Продолжить
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            onClick={onFinish}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-orange-900/30"
          >
            <Flag className="w-4 h-4" />
            Завершить тренировку
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            onClick={onReset}
            className="w-full py-2 px-4 bg-slate-700/50 hover:bg-red-600/40 text-slate-300 hover:text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Перезапустить
          </button>
        )}
      </div>

      {/* Rules button */}
      <button
        onClick={onShowRules}
        className="w-full py-2 px-4 border border-slate-600/50 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
      >
        <BookOpen className="w-3.5 h-3.5" />
        Правила
      </button>

      {/* Keyboard hints */}
      <div className="pt-2 border-t border-slate-700/50">
        <div className="flex items-center gap-1.5 text-slate-500 mb-2">
          <Keyboard className="w-3.5 h-3.5" />
          <span className="text-xs font-medium uppercase tracking-wider">Управление</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-50">Движение</span>
            <span className="text-slate-500">← ↑ → ↓ / WASD</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-50">Пауза</span>
            <span className="text-slate-500">Пробел</span>
          </div>
        </div>
      </div>
    </div>
  );
}
