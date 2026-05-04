// ========================================
// Поймай Жука — Core Types
// ========================================

// Game Types
export interface Equation {
  equation: string;
  answer: number;
  difficulty: 1 | 2 | 3;
}

export interface Enemy {
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  number: number;
  id: string;
  isTarget: boolean;
}

export interface Player {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export type GameMode = 'normal' | 'timed' | 'practice';
export type GameState = 'idle' | 'playing' | 'paused' | 'ended';
export type DifficultyMode = 'easy' | 'normal';

export interface GameSession {
  id: string;
  score: number;
  correctAnswers: number;
  totalAttempts: number;
  accuracy: number;
  duration: number;
  mode: GameMode;
  rank: string;
  maxStreak: number;
  createdAt: string;
  level: number;
  maxCombo: number;
  totalCorrect: number;
  totalWrong: number;
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  enemyCount: number;
  timedDuration: number;
  playerSpeed: number;
  playerSize: number;
  enemySize: number;
}

export interface GameCallbacks {
  onScoreChange?: (score: number) => void;
  onGameEnd?: (session: GameSession) => void;
  onEquationChange?: (equation: string, answer: number) => void;
  onStateChange?: (state: GameState) => void;
  onTimeChange?: (time: number) => void;
  onStreakChange?: (streak: number) => void;
  onAccuracyChange?: (accuracy: number) => void;
  onLevelChange?: (level: number, progress: number, target: number) => void;
  onComboChange?: (combo: number) => void;
  onTotalsChange?: (correct: number, wrong: number) => void;
  onNotification?: (message: string, color: string) => void;
  onDifficultyModeChange?: (mode: DifficultyMode) => void;
}

// User Types
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  totalSessions: number;
  bestScore: number;
  averageScore: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: {
    type: 'score' | 'sessions' | 'streak' | 'accuracy' | 'rank';
    value: number;
  };
}

export interface ProgressData {
  dailyScores: { date: string; score: number; sessions: number }[];
  weeklyAverages: { week: string; avgScore: number; avgAccuracy: number }[];
  totalSessions: number;
  totalPlayTime: number;
  bestScore: number;
  averageScore: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  rankHistory: { date: string; rank: string }[];
}

// Theory Content Types
export interface TheoryArticle {
  slug: string;
  title: string;
  description: string;
  content: string;
  icon: string;
  readTime: number;
  order: number;
}

// Rank System
export const RANKS = [
  { name: 'Новичок', minScore: 0, color: '#9CA3AF', emoji: '' },
  { name: 'Ученик', minScore: 100, color: '#60A5FA', emoji: '📖' },
  { name: 'Знаток', minScore: 200, color: '#34D399', emoji: '📚' },
  { name: 'Профессионал', minScore: 300, color: '#A78BFA', emoji: '🎯' },
  { name: 'Мастер', minScore: 400, color: '#F59E0B', emoji: '🎯' },
  { name: 'Эксперт', minScore: 500, color: '#EF4444', emoji: '⭐' },
  { name: 'Легенда', minScore: 600, color: '#EC4899', emoji: '👑' },
  { name: 'Миф', minScore: 700, color: '#8B5CF6', emoji: '👑' },
  { name: 'Гений', minScore: 800, color: '#06B6D4', emoji: '🏆' },
  { name: 'Абсолютный чемпион', minScore: 900, color: '#F97316', emoji: '🏆' },
  { name: 'Совершенство', minScore: 1000, color: '#FFD700', emoji: '🏆' },
  { name: 'Сверхмастер', minScore: 1180, color: '#FACC15', emoji: '🏆' },
  { name: 'Виртуоз', minScore: 1390, color: '#FB923C', emoji: '🎼' },
  { name: 'Грандмастер', minScore: 1640, color: '#F97316', emoji: '♛' },
  { name: 'Архимастер', minScore: 1940, color: '#EF4444', emoji: '⚜️' },
  { name: 'Титан', minScore: 2290, color: '#DC2626', emoji: '🛡️' },
  { name: 'Магистр скорости', minScore: 2700, color: '#0EA5E9', emoji: '⚡' },
  { name: 'Хранитель темпа', minScore: 3190, color: '#14B8A6', emoji: '⏱️' },
  { name: 'Повелитель точности', minScore: 3760, color: '#22C55E', emoji: '🎯' },
  { name: 'Повелитель внимания', minScore: 4440, color: '#84CC16', emoji: '👁️' },
  { name: 'Владыка решений', minScore: 5230, color: '#A855F7', emoji: '🧩' },
  { name: 'Молниеносный ум', minScore: 6180, color: '#38BDF8', emoji: '🧠' },
  { name: 'Непревзойденный', minScore: 7290, color: '#818CF8', emoji: '💎' },
  { name: 'Триумфатор', minScore: 8600, color: '#C084FC', emoji: '🏅' },
  { name: 'Абсолютный мастер', minScore: 10150, color: '#E879F9', emoji: '🌟' },
  { name: 'Вершина разума', minScore: 11980, color: '#F472B6', emoji: '⛰️' },
  { name: 'Верховный чемпион', minScore: 14130, color: '#F43F5E', emoji: '👑' },
  { name: 'За гранью', minScore: 16670, color: '#64748B', emoji: '🚀' },
  { name: 'Космический разум', minScore: 19670, color: '#7DD3FC', emoji: '🌌' },
  { name: 'Легенда эпохи', minScore: 23210, color: '#FDE68A', emoji: '📜' },
  { name: 'Бесконечность', minScore: 27390, color: '#E0E7FF', emoji: '∞' },
] as const;

export function getRank(score: number): typeof RANKS[number] {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].minScore) return RANKS[i];
  }
  return RANKS[0];
}
