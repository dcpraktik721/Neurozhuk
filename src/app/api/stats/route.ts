// ========================================
// Поймай Жука — User Stats API
// ========================================
// GET /api/stats — Get the authenticated user's aggregated stats

import { NextResponse, type NextRequest } from 'next/server';
import { getClientIp, hashForRateLimit, rateLimit, rateLimitedJson } from '@/lib/security/rate-limit';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const ipHash = hashForRateLimit(ip);
  const ipLimit = rateLimit(`api:stats:get:ip:${ipHash}`, 180, 60_000);
  if (!ipLimit.ok) {
    return rateLimitedJson(ipLimit.retryAfter, {
      error: 'Слишком много запросов. Попробуйте позже.',
      stats: null,
    });
  }

  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase не настроен.', stats: null },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация.', stats: null },
        { status: 401 }
      );
    }

    const userLimit = rateLimit(`api:stats:get:user:${user.id}`, 90, 60_000);
    if (!userLimit.ok) {
      return rateLimitedJson(userLimit.retryAfter, {
        error: 'Слишком много запросов. Попробуйте позже.',
        stats: null,
      });
    }

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no stats row exists yet, return defaults
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          stats: {
            totalSessions: 0,
            bestScore: 0,
            averageScore: 0,
            averageAccuracy: 0,
            currentStreak: 0,
            longestStreak: 0,
            totalPlayTime: 0,
            lastPlayedAt: null,
          },
        });
      }
      console.error('[stats/GET]', error);
      return NextResponse.json(
        { error: 'Не удалось загрузить статистику.', stats: null },
        { status: 500 }
      );
    }

    const stats = {
      totalSessions: data.total_sessions,
      bestScore: data.best_score,
      averageScore: Number(data.average_score),
      averageAccuracy: Number(data.average_accuracy),
      currentStreak: data.current_streak,
      longestStreak: data.longest_streak,
      totalPlayTime: data.total_play_time,
      lastPlayedAt: data.last_played_at,
    };

    return NextResponse.json({ stats });
  } catch (err) {
    console.error('[stats/GET] unexpected:', err);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера.', stats: null },
      { status: 500 }
    );
  }
}
