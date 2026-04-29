// ========================================
// Поймай Жука — useGameSessions Hook
// ========================================
// Client-side hook for game data operations:
// save sessions, load history, get stats, check achievements.

'use client';

import { useState, useCallback } from 'react';
import type { GameSession, Achievement } from '@/types';

export interface UserStats {
  totalSessions: number;
  bestScore: number;
  averageScore: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  totalPlayTime: number;
  lastPlayedAt: string | null;
}

interface SessionsResponse {
  sessions: GameSession[];
  total: number;
  limit: number;
  offset: number;
}

interface UseGameSessionsReturn {
  loading: boolean;
  error: string | null;
  saveSession: (session: GameSession) => Promise<GameSession | null>;
  getSessions: (page?: number, pageSize?: number) => Promise<SessionsResponse | null>;
  getStats: () => Promise<UserStats | null>;
  getAchievements: () => Promise<Achievement[]>;
  checkAchievements: (session: GameSession) => Promise<Achievement[]>;
}

export function useGameSessions(): UseGameSessionsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save a new game session
  const saveSession = useCallback(async (session: GameSession): Promise<GameSession | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: session.score,
          correctAnswers: session.correctAnswers,
          totalAttempts: session.totalAttempts,
          accuracy: session.accuracy,
          duration: session.duration,
          mode: session.mode,
          rank: session.rank,
          maxStreak: session.maxStreak,
          level: session.level,
          maxCombo: session.maxCombo,
          totalCorrect: session.totalCorrect,
          totalWrong: session.totalWrong,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Не удалось сохранить результат.');
        return null;
      }

      return data.session as GameSession;
    } catch {
      setError('Ошибка сети. Проверьте подключение к интернету.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get paginated session history
  const getSessions = useCallback(async (
    page: number = 1,
    pageSize: number = 20,
  ): Promise<SessionsResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * pageSize;
      const res = await fetch(
        `/api/sessions?limit=${pageSize}&offset=${offset}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Не удалось загрузить историю.');
        return null;
      }

      return data as SessionsResponse;
    } catch {
      setError('Ошибка сети. Проверьте подключение к интернету.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's aggregated stats
  const getStats = useCallback(async (): Promise<UserStats | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Не удалось загрузить статистику.');
        return null;
      }

      return data.stats as UserStats;
    } catch {
      setError('Ошибка сети. Проверьте подключение к интернету.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all achievements (with unlocked status) for the current user
  const getAchievements = useCallback(async (): Promise<Achievement[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/achievements');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Не удалось загрузить достижения.');
        return [];
      }
      return (data.achievements || []) as Achievement[];
    } catch {
      setError('Ошибка сети. Проверьте подключение к интернету.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Check and unlock achievements based on a completed session
  const checkAchievements = useCallback(async (
    session: GameSession,
  ): Promise<Achievement[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: session.score,
          accuracy: session.accuracy,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Не удалось проверить достижения.');
        return [];
      }

      return (data.newAchievements || []) as Achievement[];
    } catch {
      setError('Ошибка сети. Проверьте подключение к интернету.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    saveSession,
    getSessions,
    getStats,
    getAchievements,
    checkAchievements,
  };
}
