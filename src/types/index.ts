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
] as const;

export function getRank(score: number): typeof RANKS[number] {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].minScore) return RANKS[i];
  }
  return RANKS[0];
}
