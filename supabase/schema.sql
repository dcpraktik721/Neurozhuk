-- ========================================
-- НейроЖук — Database Schema
-- ========================================
-- PostgreSQL / Supabase schema for the НейроЖук EdTech platform.
-- Run this in the Supabase SQL Editor to set up all tables,
-- RLS policies, triggers, and indexes.

-- ── Profiles ──
-- Extends Supabase auth.users with display info and preferences.
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  age_group TEXT CHECK (age_group IN ('child', 'adult')) DEFAULT 'adult',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Профили пользователей — расширяет auth.users дополнительными данными';
COMMENT ON COLUMN public.profiles.age_group IS 'Возрастная группа: child (ребёнок) или adult (взрослый)';

-- ── Game Sessions ──
-- Each completed game round is stored as a session.
CREATE TABLE public.game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  accuracy DECIMAL(5,2) NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0, -- seconds
  mode TEXT CHECK (mode IN ('normal', 'timed', 'practice')) DEFAULT 'normal',
  rank TEXT NOT NULL DEFAULT 'Новичок',
  max_streak INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  max_combo INTEGER NOT NULL DEFAULT 0,
  total_correct INTEGER NOT NULL DEFAULT 0,
  total_wrong INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.game_sessions IS 'Записи игровых сессий — каждая завершённая тренировка';
COMMENT ON COLUMN public.game_sessions.duration IS 'Продолжительность игры в секундах';
COMMENT ON COLUMN public.game_sessions.mode IS 'Режим: normal (обычный), timed (на время), practice (тренировка)';
COMMENT ON COLUMN public.game_sessions.max_streak IS 'Максимальная серия правильных ответов подряд за сессию';

-- ── Achievements ──
-- Unlocked achievements per user (one row per achievement).
CREATE TABLE public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_key)
);

COMMENT ON TABLE public.achievements IS 'Достижения пользователей — разблокированные награды';
COMMENT ON COLUMN public.achievements.achievement_key IS 'Уникальный ключ достижения (first_game, score_100 и т.д.)';

-- ── User Stats ──
-- Materialized/cached aggregate stats for fast dashboard reads.
-- Updated by a trigger after each game_session insert.
CREATE TABLE public.user_stats (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_sessions INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  average_score DECIMAL(10,2) DEFAULT 0,
  average_accuracy DECIMAL(5,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0, -- days in a row
  longest_streak INTEGER DEFAULT 0,
  total_play_time INTEGER DEFAULT 0, -- total seconds played
  last_played_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.user_stats IS 'Агрегированная статистика — кеш для быстрого чтения на дашборде';
COMMENT ON COLUMN public.user_stats.current_streak IS 'Текущая серия дней подряд с тренировками';
COMMENT ON COLUMN public.user_stats.total_play_time IS 'Общее время игры в секундах';

-- ========================================
-- Indexes
-- ========================================

CREATE INDEX idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX idx_game_sessions_created_at ON public.game_sessions(created_at DESC);
CREATE INDEX idx_game_sessions_user_created ON public.game_sessions(user_id, created_at DESC);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);

-- ========================================
-- Row Level Security (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read and update only their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Game Sessions: users can read and insert their own sessions
CREATE POLICY "Users can view own sessions"
  ON public.game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Achievements: users can read and insert their own achievements
CREATE POLICY "Users can view own achievements"
  ON public.achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Stats: users can read their own stats (updates via trigger only)
CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

-- ========================================
-- Triggers
-- ========================================

-- 1. Auto-create profile + user_stats when a new user signs up.
-- Picks up `display_name` and `age_group` from raw_user_meta_data
-- (set by the signUp server action).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_age_group TEXT;
BEGIN
  v_age_group := COALESCE(NEW.raw_user_meta_data ->> 'age_group', 'adult');
  IF v_age_group NOT IN ('child', 'adult') THEN
    v_age_group := 'adult';
  END IF;

  INSERT INTO public.profiles (id, display_name, age_group)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', ''),
    v_age_group
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. Update user_stats after a new game session is inserted
CREATE OR REPLACE FUNCTION public.update_user_stats_after_session()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_total_sessions INTEGER;
  v_best_score INTEGER;
  v_avg_score DECIMAL(10,2);
  v_avg_accuracy DECIMAL(5,2);
  v_total_play_time INTEGER;
  v_last_played DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  -- Compute aggregates from all sessions
  SELECT
    COUNT(*),
    COALESCE(MAX(score), 0),
    COALESCE(AVG(score), 0),
    COALESCE(AVG(accuracy), 0),
    COALESCE(SUM(duration), 0)
  INTO v_total_sessions, v_best_score, v_avg_score, v_avg_accuracy, v_total_play_time
  FROM public.game_sessions
  WHERE user_id = NEW.user_id;

  -- Calculate daily streak
  -- Get the last played date before this session
  SELECT last_played_at::date, current_streak, longest_streak
  INTO v_last_played, v_current_streak, v_longest_streak
  FROM public.user_stats
  WHERE user_id = NEW.user_id;

  -- Update streak logic
  IF v_last_played IS NULL THEN
    -- First session ever
    v_current_streak := 1;
  ELSIF v_last_played = CURRENT_DATE THEN
    -- Already played today, no change
    NULL;
  ELSIF v_last_played = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Played yesterday — extend streak
    v_current_streak := COALESCE(v_current_streak, 0) + 1;
  ELSE
    -- Missed a day — reset streak
    v_current_streak := 1;
  END IF;

  -- Update longest streak if current exceeds it
  IF v_current_streak > COALESCE(v_longest_streak, 0) THEN
    v_longest_streak := v_current_streak;
  END IF;

  -- Upsert user_stats
  INSERT INTO public.user_stats (
    user_id, total_sessions, best_score, average_score,
    average_accuracy, total_play_time, current_streak,
    longest_streak, last_played_at, updated_at
  )
  VALUES (
    NEW.user_id, v_total_sessions, v_best_score, v_avg_score,
    v_avg_accuracy, v_total_play_time, v_current_streak,
    v_longest_streak, NOW(), NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_sessions = EXCLUDED.total_sessions,
    best_score = EXCLUDED.best_score,
    average_score = EXCLUDED.average_score,
    average_accuracy = EXCLUDED.average_accuracy,
    total_play_time = EXCLUDED.total_play_time,
    current_streak = EXCLUDED.current_streak,
    longest_streak = EXCLUDED.longest_streak,
    last_played_at = EXCLUDED.last_played_at,
    updated_at = EXCLUDED.updated_at;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_game_session_inserted
  AFTER INSERT ON public.game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats_after_session();

-- 3. Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
