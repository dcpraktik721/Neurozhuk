// ========================================
// Поймай Жука — Achievements API
// ========================================
// GET  /api/achievements — Get user's unlocked achievements
// POST /api/achievements — Check & unlock new achievements

import { NextResponse, type NextRequest } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { validateAchievementCheckInput } from '@/lib/validation/api';

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

export async function GET() {
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

    // Validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Некорректный JSON в теле запроса.', newAchievements: [] },
        { status: 400 }
      );
    }
    const parsed = validateAchievementCheckInput(body);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: parsed.error, newAchievements: [] },
        { status: 400 }
      );
    }
    const { score, accuracy } = parsed.value;

    // Fetch user stats
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

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
          met = (score ?? 0) >= def.requirement.value;
          break;
        case 'accuracy':
          met = (accuracy ?? 0) >= def.requirement.value;
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
