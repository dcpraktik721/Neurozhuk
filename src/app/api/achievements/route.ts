// ========================================
// Поймай Жука — Achievements API
// ========================================
// GET  /api/achievements — Get user's unlocked achievements
// POST /api/achievements — Check & unlock new achievements

import { NextResponse, type NextRequest } from 'next/server';
import { recordSecurityEvent } from '@/lib/security/audit-log';
import { validateStateChangingOrigin } from '@/lib/security/origin';
import { getClientIp, hashForRateLimit, rateLimit, rateLimitedJson } from '@/lib/security/rate-limit';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

// ── Achievement Definitions ──

interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: string;
  requirement: {
    type: 'score' | 'sessions' | 'streak' | 'accuracy' | 'rank';
    value: number;
  };
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    key: 'first_game',
    title: 'Первая игра',
    description: 'Завершите первую тренировку',
    icon: '🎮',
    requirement: { type: 'sessions', value: 1 },
  },
  {
    key: 'score_100',
    title: 'Сотня',
    description: 'Наберите 100 очков за одну игру',
    icon: '💯',
    requirement: { type: 'score', value: 100 },
  },
  {
    key: 'score_500',
    title: 'Полтысячи',
    description: 'Наберите 500 очков за одну игру',
    icon: '🏆',
    requirement: { type: 'score', value: 500 },
  },
  {
    key: 'accuracy_90',
    title: 'Снайпер',
    description: 'Достигните точности 90%+',
    icon: '🎯',
    requirement: { type: 'accuracy', value: 90 },
  },
  {
    key: 'streak_7',
    title: 'Неделя тренировок',
    description: '7 дней подряд',
    icon: '🔥',
    requirement: { type: 'streak', value: 7 },
  },
  {
    key: 'sessions_10',
    title: 'Десятка',
    description: 'Завершите 10 тренировок',
    icon: '⭐',
    requirement: { type: 'sessions', value: 10 },
  },
  {
    key: 'sessions_50',
    title: 'Полтинник',
    description: '50 тренировок — серьёзный результат',
    icon: '🌟',
    requirement: { type: 'sessions', value: 50 },
  },
  {
    key: 'rank_master',
    title: 'Мастер',
    description: 'Достигните ранга "Мастер"',
    icon: '👑',
    requirement: { type: 'rank', value: 400 },
  },
];

export { ACHIEVEMENT_DEFS };

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const ipHash = hashForRateLimit(ip);
  const ipLimit = rateLimit(`api:achievements:get:ip:${ipHash}`, 180, 60_000);
  if (!ipLimit.ok) {
    return rateLimitedJson(ipLimit.retryAfter, {
      error: 'Слишком много запросов. Попробуйте позже.',
      achievements: [],
    });
  }

  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ achievements: [], definitions: ACHIEVEMENT_DEFS }, { status: 503 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация.', achievements: [] },
        { status: 401 }
      );
    }

    const userLimit = rateLimit(`api:achievements:get:user:${user.id}`, 90, 60_000);
    if (!userLimit.ok) {
      return rateLimitedJson(userLimit.retryAfter, {
        error: 'Слишком много запросов. Попробуйте позже.',
        achievements: [],
      });
    }

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('[achievements/GET]', error);
      return NextResponse.json(
        { error: 'Не удалось загрузить достижения.', achievements: [] },
        { status: 500 }
      );
    }

    // Merge definitions with unlocked status
    const unlockedKeys = new Set((data || []).map((a) => a.achievement_key));
    const unlockedMap = new Map(
      (data || []).map((a) => [a.achievement_key, a.unlocked_at])
    );

    const achievements = ACHIEVEMENT_DEFS.map((def) => ({
      id: def.key,
      title: def.title,
      description: def.description,
      icon: def.icon,
      requirement: def.requirement,
      unlockedAt: unlockedKeys.has(def.key) ? unlockedMap.get(def.key) : undefined,
    }));

    return NextResponse.json({ achievements });
  } catch (err) {
    console.error('[achievements/GET] unexpected:', err);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера.', achievements: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const ipHash = hashForRateLimit(ip);
  const ipLimit = rateLimit(`api:achievements:post:ip:${ipHash}`, 120, 60_000);
  if (!ipLimit.ok) {
    recordSecurityEvent({
      type: 'api.achievements.post.rate_limited',
      outcome: 'blocked',
      ipHash,
      route: '/api/achievements',
    });
    return rateLimitedJson(ipLimit.retryAfter, {
      error: 'Слишком много запросов. Попробуйте позже.',
      newAchievements: [],
    });
  }

  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase не настроен.', newAchievements: [] },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация.', newAchievements: [] },
        { status: 401 }
      );
    }

    const userLimit = rateLimit(`api:achievements:post:user:${user.id}`, 30, 60_000);
    if (!userLimit.ok) {
      recordSecurityEvent({
        type: 'api.achievements.post.user_rate_limited',
        outcome: 'blocked',
        actorId: user.id,
        ipHash,
        route: '/api/achievements',
      });
      return rateLimitedJson(userLimit.retryAfter, {
        error: 'Слишком много запросов. Попробуйте позже.',
        newAchievements: [],
      });
    }

    if (!validateStateChangingOrigin(request)) {
      recordSecurityEvent({
        type: 'api.achievements.post.bad_origin',
        outcome: 'blocked',
        actorId: user.id,
        ipHash,
        route: '/api/achievements',
      });
      return NextResponse.json({ error: 'Forbidden', newAchievements: [] }, { status: 403 });
    }

    // Fetch user stats
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: latestSession } = await supabase
      .from('game_sessions')
      .select('score, accuracy')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const lastSessionScore = latestSession?.score ?? 0;
    const lastSessionAccuracy = Number(latestSession?.accuracy ?? 0);

    // Fetch already unlocked achievements
    const { data: unlocked } = await supabase
      .from('achievements')
      .select('achievement_key')
      .eq('user_id', user.id);

    const unlockedKeys = new Set((unlocked || []).map((a) => a.achievement_key));

    // Check each achievement definition
    const newlyUnlocked: AchievementDef[] = [];

    for (const def of ACHIEVEMENT_DEFS) {
      if (unlockedKeys.has(def.key)) continue;

      let met = false;
      switch (def.requirement.type) {
        case 'sessions':
          met = (stats?.total_sessions ?? 0) >= def.requirement.value;
          break;
        case 'score':
          met = lastSessionScore >= def.requirement.value;
          break;
        case 'accuracy':
          met = lastSessionAccuracy >= def.requirement.value;
          break;
        case 'streak':
          met = (stats?.current_streak ?? 0) >= def.requirement.value;
          break;
        case 'rank':
          // rank requirement uses score threshold (e.g., 400 for "Мастер")
          met = (stats?.best_score ?? 0) >= def.requirement.value;
          break;
      }

      if (met) {
        newlyUnlocked.push(def);
      }
    }

    // Insert newly unlocked achievements
    if (newlyUnlocked.length > 0) {
      const { error: insertError } = await supabase
        .from('achievements')
        .insert(
          newlyUnlocked.map((def) => ({
            user_id: user.id,
            achievement_key: def.key,
          }))
        );

      if (insertError) {
        console.error('[achievements/POST] insert error:', insertError);
        // Don't fail — some might be duplicates due to race conditions
      }
    }

    const newAchievements = newlyUnlocked.map((def) => ({
      id: def.key,
      title: def.title,
      description: def.description,
      icon: def.icon,
      requirement: def.requirement,
      unlockedAt: new Date().toISOString(),
    }));

    return NextResponse.json({ newAchievements });
  } catch (err) {
    console.error('[achievements/POST] unexpected:', err);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера.', newAchievements: [] },
      { status: 500 }
    );
  }
}
