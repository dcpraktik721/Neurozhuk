'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { GameEngine } from '@/lib/game/engine';
import type { GameCallbacks } from '@/types';
import type { GameSession, GameMode, GameState, DifficultyMode } from '@/types';

const MOBILE_BREAKPOINT = 768;
const MOBILE_GAME_CONFIG = {
  playerSize: 76,
  enemySize: 68,
};

// ── Notification toast ──

interface ToastNotification {
  id: number;
  message: string;
  color: string;
}

let _toastId = 0;

function GameNotification({ notifications }: { notifications: ToastNotification[] }) {
  return (
    <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="px-3 py-2 rounded-xl text-sm font-bold text-white shadow-lg animate-[slideInRight_0.3s_ease-out]"
          style={{ backgroundColor: n.color + 'DD', border: `1px solid ${n.color}` }}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}

interface GameCanvasProps {
  mode: GameMode;
  difficultyMode: DifficultyMode;
  gameState: GameState;
  onGameEnd: (session: GameSession) => void;
  onScoreChange: (score: number) => void;
  onEquationChange: (equation: string) => void;
  onTimeChange: (time: number) => void;
  onStreakChange: (streak: number) => void;
  onAccuracyChange: (accuracy: number) => void;
  onStateChange: (state: GameState) => void;
  onEngineReady: (engine: GameEngine) => void;
  onLevelChange: (level: number, progress: number, target: number) => void;
  onComboChange: (combo: number) => void;
  onTotalsChange: (correct: number, wrong: number) => void;
  bestScore: number;
}

export default function GameCanvas({
  gameState,
  onGameEnd,
  onScoreChange,
  onEquationChange,
  onTimeChange,
  onStreakChange,
  onAccuracyChange,
  onStateChange,
  onEngineReady,
  onLevelChange,
  onComboChange,
  onTotalsChange,
  bestScore,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const notificationTimeoutsRef = useRef<number[]>([]);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Notification handler
  const handleNotification = useCallback((message: string, color: string) => {
    const id = ++_toastId;
    setNotifications((prev) => [...prev.slice(-3), { id, message, color }]);
    const timeoutId = window.setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      notificationTimeoutsRef.current = notificationTimeoutsRef.current.filter((storedId) => storedId !== timeoutId);
    }, 2000);
    notificationTimeoutsRef.current.push(timeoutId);
  }, []);

  useEffect(() => () => {
    for (const timeoutId of notificationTimeoutsRef.current) {
      window.clearTimeout(timeoutId);
    }
    notificationTimeoutsRef.current = [];
  }, []);

  // Initialize engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isMobile === null) return;

    const callbacks: GameCallbacks = {
      onScoreChange,
      onGameEnd,
      onEquationChange: (eq) => onEquationChange(eq),
      onStateChange,
      onTimeChange,
      onStreakChange,
      onAccuracyChange,
      onLevelChange,
      onComboChange,
      onTotalsChange,
      onNotification: handleNotification,
    };

    const engine = new GameEngine(
      canvas,
      isMobile ? MOBILE_GAME_CONFIG : {},
      callbacks,
    );
    engine.setBestScore(bestScore);
    engineRef.current = engine;
    onEngineReady(engine);

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // bestScore is intentionally excluded — the engine receives initial value
    // here and is then updated via the dedicated effect below. Including it
    // in deps would tear down/re-init the engine on every score change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    handleNotification,
    isMobile,
    onAccuracyChange,
    onComboChange,
    onEngineReady,
    onEquationChange,
    onGameEnd,
    onLevelChange,
    onScoreChange,
    onStateChange,
    onStreakChange,
    onTimeChange,
    onTotalsChange,
  ]);

  // Update bestScore when it changes
  useEffect(() => {
    engineRef.current?.setBestScore(bestScore);
  }, [bestScore]);

  // Touch controls
  const handleTouchStart = useCallback((dir: { x: number; y: number }) => {
    engineRef.current?.setTouchDirection(dir.x, dir.y);
  }, []);

  const handleTouchEnd = useCallback(() => {
    engineRef.current?.setTouchDirection(0, 0);
  }, []);

  return (
    <div className="relative w-full">
      {/* Canvas container */}
      <div className="relative w-full aspect-square max-w-[800px] mx-auto">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-xl border border-slate-700/50 shadow-2xl shadow-green-500/10"
        />

        {/* Toast notifications */}
        <GameNotification notifications={notifications} />

        {/* Paused overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            <div className="text-center">
              <p className="text-white text-3xl font-bold mb-2">Пауза</p>
              <p className="text-slate-300 text-sm">Нажмите Пробел или кнопку для продолжения</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile touch controls */}
      {isMobile && gameState === 'playing' && (
        <div className="mt-4 flex justify-center">
          <div className="grid grid-cols-3 gap-2 w-44">
            <div />
            <button
              className="bg-slate-700/80 active:bg-green-600 text-white rounded-xl p-4 text-xl font-bold select-none touch-none"
              onTouchStart={(e) => { e.preventDefault(); handleTouchStart({ x: 0, y: -1 }); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd(); }}
              onMouseDown={() => handleTouchStart({ x: 0, y: -1 })}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
            >
              ↑
            </button>
            <div />
            <button
              className="bg-slate-700/80 active:bg-green-600 text-white rounded-xl p-4 text-xl font-bold select-none touch-none"
              onTouchStart={(e) => { e.preventDefault(); handleTouchStart({ x: -1, y: 0 }); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd(); }}
              onMouseDown={() => handleTouchStart({ x: -1, y: 0 })}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
            >
              ←
            </button>
            <button
              className="bg-slate-700/80 active:bg-green-600 text-white rounded-xl p-4 text-xl font-bold select-none touch-none"
              onTouchStart={(e) => { e.preventDefault(); handleTouchStart({ x: 0, y: 1 }); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd(); }}
              onMouseDown={() => handleTouchStart({ x: 0, y: 1 })}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
            >
              ↓
            </button>
            <button
              className="bg-slate-700/80 active:bg-green-600 text-white rounded-xl p-4 text-xl font-bold select-none touch-none"
              onTouchStart={(e) => { e.preventDefault(); handleTouchStart({ x: 1, y: 0 }); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd(); }}
              onMouseDown={() => handleTouchStart({ x: 1, y: 0 })}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
