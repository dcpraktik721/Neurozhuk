'use client';

import { X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gamepad2, Target, Brain, Timer, Star } from 'lucide-react';
import { RANKS } from '@/types';

interface GameRulesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameRules({ isOpen, onClose }: GameRulesProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-white">Правила игры</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* How to play */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Как играть</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-green-400 font-bold mt-0.5">1.</span>
                <span>На экране показано математическое выражение. Найдите жука с правильным ответом.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400 font-bold mt-0.5">2.</span>
                <span>Управляйте зелёным жуком и поймайте жука с нужным числом.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400 font-bold mt-0.5">3.</span>
                <span>Жуки двигаются вертикально. Ваш жук может двигаться в любом направлении.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400 font-bold mt-0.5">4.</span>
                <span>Неправильный жук -- штраф к точности и сброс серии.</span>
              </li>
            </ul>
          </section>

          {/* Controls */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Gamepad2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Управление</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">Клавиатура</p>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="flex gap-0.5">
                    <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">
                      <ArrowUp className="w-3 h-3" />
                    </kbd>
                    <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">
                      <ArrowDown className="w-3 h-3" />
                    </kbd>
                    <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">
                      <ArrowLeft className="w-3 h-3" />
                    </kbd>
                    <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">
                      <ArrowRight className="w-3 h-3" />
                    </kbd>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">или W A S D</p>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">Мобильный</p>
                <p className="text-sm text-slate-300">Экранные кнопки направления</p>
              </div>
            </div>
            <div className="mt-2 bg-slate-900/60 rounded-xl p-3">
              <p className="text-sm text-slate-300">
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Пробел</kbd> -- пауза/продолжить
              </p>
            </div>
          </section>

          {/* Scoring */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Очки</h3>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 space-y-1.5 text-sm text-slate-300">
              <p><span className="text-green-400 font-semibold">+10 очков</span> за каждый правильный жук</p>
              <p>Чем больше очков, тем сложнее примеры</p>
              <p>Два режима: <span className="text-green-400">обычный</span> (без лимита) и <span className="text-orange-400">на время</span> (5 минут)</p>
            </div>
          </section>

          {/* Timer */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Timer className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Режимы</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-sm font-medium text-green-400 mb-1">Обычный режим</p>
                <p className="text-xs text-slate-400">Играйте без ограничений по времени. Таймер считает, сколько вы уже играете.</p>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-sm font-medium text-orange-400 mb-1">Игра на время</p>
                <p className="text-xs text-slate-400">5 минут (300 секунд). Наберите максимум очков до конца таймера!</p>
              </div>
            </div>
          </section>

          {/* Ranks */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Звания</h3>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {RANKS.map((rank) => (
                <div
                  key={rank.name}
                  className="flex items-center justify-between bg-slate-900/60 rounded-lg px-3 py-1.5"
                >
                  <span className="text-sm font-medium" style={{ color: rank.color }}>
                    {rank.name}
                  </span>
                  <span className="text-xs text-slate-500">{rank.minScore}+</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
