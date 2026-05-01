'use client';

import { useState, useCallback, useRef } from 'react';
import { Bug } from 'lucide-react';
import type { GameSession, GameMode, GameState, DifficultyMode, Achievement } from '@/types';
import type { GameEngine } from '@/lib/game/engine';
import GameCanvas from '@/components/game/GameCanvas';
import GameControls from '@/components/game/GameControls';
import GameStats from '@/components/game/GameStats';
import GameRules from '@/components/game/GameRules';
import GameResults from '@/components/game/GameResults';
import { useGameSessions } from '@/hooks/useGameSessions';
import { useAuth } from '@/hooks/useAuth';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { useLocalStorageBoolean } from '@/hooks/useLocalStorageBoolean';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'unauthenticated' | 'unconfigured';

const MUSIC_SRC = '/audio/frog-game.mp3';
const MUSIC_PREF_KEY = 'poymai-zhuka:music-enabled';

export default function PlayPage() {
  // Core game state
  const [gameState, setGameState] = useState<GameState>('idle');
  const [mode, setMode] = useState<GameMode>('normal');
  const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>('easy');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [time, setTime] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [streak, setStreak] = useState(0);
  const [equation, setEquation] = useState('');

  // Level / combo / totals state
  const [level, setLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [levelTarget, setLevelTarget] = useState(10);
  const [combo, setCombo] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);

  // UI state
  const [showRules, setShowRules] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastSession, setLastSession] = useState<GameSession | null>(null);

  // Music state — persisted in localStorage, default ON.
  // Hook uses useSyncExternalStore so we never setState in an effect.
  const [musicEnabled, setMusicEnabled] = useLocalStorageBoolean(MUSIC_PREF_KEY, true);
  const handleMusicToggle = useCallback(() => {
    setMusicEnabled((prev) => !prev);
  }, [setMusicEnabled]);

  // Persistence state
  const { saveSession, checkAchievements } = useGameSessions();
  const { user, isConfigured } = useAuth();
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Engine ref
  const engineRef = useRef<GameEngine | null>(null);

  // Callbacks
  const handleEngineReady = useCallback((engine: GameEngine) => {
    engineRef.current = engine;
  }, []);

  const handleScoreChange = useCallback((s: number) => {
    setScore(s);
    setBestScore((prev) => Math.max(prev, s));
  }, []);

  const handleGameEnd = useCallback(async (session: GameSession) => {
    setLastSession(session);
    setShowResults(true);
    setGameState('ended');
    setSaveError(null);
    setNewAchievements([]);

    // Decide initial save status based on environment + auth
    if (!isConfigured) {
      setSaveStatus('unconfigured');
      return;
    }
    if (!user) {
      setSaveStatus('unauthenticated');
      return;
    }

    setSaveStatus('saving');
    const saved = await saveSession(session);
    if (saved) {
      setSaveStatus('saved');
      const achievements = await checkAchievements(saved);
      if (achievements.length > 0) setNewAchievements(achievements);
    } else {
      setSaveStatus('error');
      setSaveError('Не удалось сохранить результат. Проверьте подключение.');
    }
  }, [isConfigured, user, saveSession, checkAchievements]);

  const handleEquationChange = useCallback((eq: string) => {
    setEquation(eq);
  }, []);

  const handleTimeChange = useCallback((t: number) => {
    setTime(t);
  }, []);

  const handleStreakChange = useCallback((s: number) => {
    setStreak(s);
  }, []);

  const handleAccuracyChange = useCallback((a: number) => {
    setAccuracy(a);
  }, []);

  const handleStateChange = useCallback((s: GameState) => {
    setGameState(s);
  }, []);

  const handleLevelChange = useCallback((lv: number, progress: number, target: number) => {
    setLevel(lv);
    setLevelProgress(progress);
    setLevelTarget(target);
  }, []);

  const handleComboChange = useCallback((c: number) => {
    setCombo(c);
  }, []);

  const handleTotalsChange = useCallback((correct: number, wrong: number) => {
    setTotalCorrect(correct);
    setTotalWrong(wrong);
  }, []);

  // Reset all counters helper
  const resetCounters = useCallback(() => {
    setScore(0);
    setAccuracy(100);
    setStreak(0);
    setTime(0);
    setEquation('');
    setLevel(1);
    setLevelProgress(0);
    setLevelTarget(10);
    setCombo(0);
    setTotalCorrect(0);
    setTotalWrong(0);
  }, []);

  // Control actions
  const handleStart = useCallback(() => {
    setShowResults(false);
    resetCounters();
    engineRef.current?.start(mode, difficultyMode);
  }, [mode, difficultyMode, resetCounters]);

  const handlePause = useCallback(() => {
    engineRef.current?.pause();
  }, []);

  const handleResume = useCallback(() => {
    engineRef.current?.resume();
  }, []);

  const handleReset = useCallback(() => {
    engineRef.current?.reset();
    resetCounters();
    setGameState('idle');
  }, [resetCounters]);

  const handleFinish = useCallback(() => {
    // Triggers engine.finish() which produces a GameSession via onGameEnd.
    engineRef.current?.finish();
  }, []);

  const handlePlayAgain = useCallback(() => {
    setShowResults(false);
    resetCounters();
    engineRef.current?.start(mode, difficultyMode);
  }, [mode, difficultyMode, resetCounters]);

  const isActive = gameState === 'playing' || gameState === 'paused';
  const mobileStatLabelClassName = 'text-xs font-bold uppercase tracking-[0.08em]';
  const mobileStatValueClassName = 'text-lg font-black text-white tabular-nums';
  const mobileStatTextStyle = {
    color: '#FFFFFF',
    textShadow: '0 1px 6px rgba(0,0,0,0.42)',
  } as const;

  // Background music: play during active game (playing or paused),
  // stop on idle / ended. Pauses during in-game pause.
  useBackgroundMusic({
    src: MUSIC_SRC,
    enabled: musicEnabled,
    shouldPlay: gameState === 'playing',
    volume: 0.35,
  });

  return (
    <>
      <title>Играть -- Поймай Жука</title>
      <meta name="description" content="Играйте в математическую игру Поймай Жука! Ловите жуков с правильными ответами, набирайте очки и повышайте своё звание." />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="w-6 h-6 text-green-400" />
              <span className="text-lg font-bold text-white">Поймай Жука</span>
            </div>
            <p className="text-sm text-slate-300 hidden sm:block">Математическая аркада</p>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Hero — visible only when idle */}
          {gameState === 'idle' && (
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="text-green-400">Поймай</span> <span className="text-green-400">жука</span>
              </h1>
              <p className="max-w-lg mx-auto" style={{ color: '#ffffff' }}>
                Решай примеры, лови жуков с правильными ответами, набирай очки и получай звания!
              </p>
            </div>
          )}

          {/* Game layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-4 lg:gap-6 items-start">
            {/* Left panel: Controls (desktop) */}
            <div className="hidden lg:block order-1">
              <GameControls
                mode={mode}
                gameState={gameState}
                difficultyMode={difficultyMode}
                musicEnabled={musicEnabled}
                onModeChange={setMode}
                onDifficultyModeChange={setDifficultyMode}
                onMusicToggle={handleMusicToggle}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onReset={handleReset}
                onFinish={handleFinish}
                onShowRules={() => setShowRules(true)}
              />
            </div>

            {/* Center: Canvas + bars */}
            <div className="order-2 lg:order-2">
              {/* Equation bar above canvas on mobile */}
              {isActive && equation && (
                <div className="lg:hidden bg-gradient-to-r from-amber-700 to-orange-700 border-2 border-amber-400 rounded-2xl p-4 mb-3 text-center shadow-lg shadow-amber-900/30">
                  <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: '#ffffff' }}>Найди жука с числом</p>
                  <p className="text-3xl font-black tracking-wide" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{equation}</p>
                </div>
              )}

              {/* Mobile score bar */}
              {isActive && (
                <div className="lg:hidden flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-2 mb-3 flex-wrap gap-2">
                  <div className="text-center">
                    <p className={mobileStatLabelClassName} style={mobileStatTextStyle}>Очки</p>
                    <p className={mobileStatValueClassName} style={mobileStatTextStyle}>{score}</p>
                  </div>
                  <div className="text-center">
                    <p className={mobileStatLabelClassName} style={mobileStatTextStyle}>Уровень</p>
                    <p className={mobileStatValueClassName} style={mobileStatTextStyle}>{level}</p>
                  </div>
                  <div className="text-center">
                    <p className={mobileStatLabelClassName} style={mobileStatTextStyle}>Комбо</p>
                    <p className={mobileStatValueClassName} style={mobileStatTextStyle}>
                      {combo}{combo >= 5 ? '🔥' : ''}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={mobileStatLabelClassName} style={mobileStatTextStyle}>{mode === 'timed' ? 'Осталось' : 'Время'}</p>
                    <p className={mobileStatValueClassName} style={mobileStatTextStyle}>
                      {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={mobileStatLabelClassName} style={mobileStatTextStyle}>Точность</p>
                    <p className={mobileStatValueClassName} style={mobileStatTextStyle}>
                      {score === 0 && accuracy === 100 ? '—' : `${accuracy}%`}
                    </p>
                  </div>
                </div>
              )}

              <GameCanvas
                mode={mode}
                difficultyMode={difficultyMode}
                gameState={gameState}
                onGameEnd={handleGameEnd}
                onScoreChange={handleScoreChange}
                onEquationChange={handleEquationChange}
                onTimeChange={handleTimeChange}
                onStreakChange={handleStreakChange}
                onAccuracyChange={handleAccuracyChange}
                onStateChange={handleStateChange}
                onEngineReady={handleEngineReady}
                onLevelChange={handleLevelChange}
                onComboChange={handleComboChange}
                onTotalsChange={handleTotalsChange}
                bestScore={bestScore}
              />

              {/* Mobile controls below canvas */}
              <div className="lg:hidden mt-4">
                <GameControls
                  mode={mode}
                  gameState={gameState}
                  difficultyMode={difficultyMode}
                  musicEnabled={musicEnabled}
                  onModeChange={setMode}
                  onDifficultyModeChange={setDifficultyMode}
                  onMusicToggle={handleMusicToggle}
                  onStart={handleStart}
                  onPause={handlePause}
                  onResume={handleResume}
                  onReset={handleReset}
                  onFinish={handleFinish}
                  onShowRules={() => setShowRules(true)}
                />
              </div>
            </div>

            {/* Right panel: Stats (desktop) */}
            <div className="hidden lg:block order-3">
              <GameStats
                score={score}
                bestScore={bestScore}
                time={time}
                accuracy={accuracy}
                streak={streak}
                equation={equation}
                mode={mode}
                gameState={gameState}
                level={level}
                levelProgress={levelProgress}
                levelTarget={levelTarget}
                combo={combo}
                totalCorrect={totalCorrect}
                totalWrong={totalWrong}
              />
            </div>
          </div>
        </main>

        {/* Modals */}
        <GameRules isOpen={showRules} onClose={() => setShowRules(false)} />
        <GameResults
          session={lastSession}
          isOpen={showResults}
          saveStatus={saveStatus}
          saveError={saveError}
          newAchievements={newAchievements}
          onPlayAgain={handlePlayAgain}
          onClose={() => setShowResults(false)}
        />
      </div>
    </>
  );
}
