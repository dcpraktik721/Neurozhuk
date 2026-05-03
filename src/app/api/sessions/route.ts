// ========================================
// Поймай Жука — Game Sessions API
// ========================================
// POST /api/sessions — Save a new game session (validated)
// GET  /api/sessions — Get paginated session history

import { NextResponse, type NextRequest } from 'next/server';
import { getRank } from '@/types';
import { recordSecurityEvent } from '@/lib/security/audit-log';
import { validateStateChangingOrigin } from '@/lib/security/origin';
import { getClientIp, hashForRateLimit, rateLimit, rateLimitedJson } from '@/lib/security/rate-limit';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { parsePagination, validateSessionInput } from '@/lib/validation/api';

// Map a DB row → camelCase GameSession
function rowToSession(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    score: row.score as number,
    correctAnswers: row.correct_answers as number,
    totalAttempts: row.total_attempts as number,
    accuracy: Number(row.accuracy ?? 0),
    duration: row.duration as number,
    mode: row.mode as string,
    rank: row.rank as string,
    maxStreak: row.max_streak as number,
    level: (row.level as number) ?? 1,
    maxCombo: (row.max_combo as number) ?? 0,
    totalCorrect: (row.total_correct as number) ?? (row.correct_answers as number) ?? 0,
    totalWrong: (row.total_wrong as number) ?? 0,
    createdAt: row.created_at as string,
  };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const ipHash = hashForRateLimit(ip);
  const ipLimit = rateLimit(`api:sessions:post:ip:${ipHash}`, 120, 60_000);
  if (!ipLimit.ok) {
    recordSecurityEvent({
      type: 'api.sessions.post.rate_limited',
      outcome: 'blocked',
      ipHash,
      route: '/api/sessions',
    });
    return rateLimitedJson(ipLimit.retryAfter);
  }

  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase не настроен. Данные не сохранены.' },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация для сохранения результатов.' },
        { status: 401 }
      );
    }

    const userLimit = rateLimit(`api:sessions:post:user:${user.id}`, 30, 60_000);
    if (!userLimit.ok) {
      recordSecurityEvent({
        type: 'api.sessions.post.user_rate_limited',
        outcome: 'blocked',
        actorId: user.id,
        ipHash,
        route: '/api/sessions',
      });
      return rateLimitedJson(userLimit.retryAfter);
    }

    if (!validateStateChangingOrigin(request)) {
      recordSecurityEvent({
        type: 'api.sessions.post.bad_origin',
        outcome: 'blocked',
        actorId: user.id,
        ipHash,
        route: '/api/sessions',
      });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Некорректный JSON в теле запроса.' },
        { status: 400 }
      );
    }

    const parsed = validateSessionInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const v = parsed.value;
    const rank = getRank(v.score).name;

    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        user_id: user.id,
        score: v.score,
        correct_answers: v.correctAnswers,
        total_attempts: v.totalAttempts,
        accuracy: v.accuracy,
        duration: v.duration,
        mode: v.mode,
        rank,
        max_streak: v.maxStreak,
        level: v.level,
        max_combo: v.maxCombo,
        total_correct: v.totalCorrect,
        total_wrong: v.totalWrong,
      })
      .select()
      .single();

    if (error) {
      console.error('[sessions/POST]', error);
      return NextResponse.json(
        { error: 'Не удалось сохранить сессию. Попробуйте позже.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ session: rowToSession(data) }, { status: 201 });
  } catch (err) {
    console.error('[sessions/POST] unexpected:', err);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const ipHash = hashForRateLimit(ip);
  const ipLimit = rateLimit(`api:sessions:get:ip:${ipHash}`, 180, 60_000);
  if (!ipLimit.ok) {
    return rateLimitedJson(ipLimit.retryAfter);
  }

  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase не настроен.', sessions: [] },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация.', sessions: [] },
        { status: 401 }
      );
    }

    const userLimit = rateLimit(`api:sessions:get:user:${user.id}`, 90, 60_000);
    if (!userLimit.ok) {
      return rateLimitedJson(userLimit.retryAfter);
    }

    const { limit, offset } = parsePagination(request.nextUrl.searchParams);

    const { data, error, count } = await supabase
      .from('game_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[sessions/GET]', error);
      return NextResponse.json(
        { error: 'Не удалось загрузить историю сессий.', sessions: [] },
        { status: 500 }
      );
    }

    const sessions = (data || []).map((row) =>
      rowToSession(row as Record<string, unknown>),
    );

    return NextResponse.json({
      sessions,
      total: count ?? 0,
      limit,
      offset,
    });
  } catch (err) {
    console.error('[sessions/GET] unexpected:', err);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера.', sessions: [] },
      { status: 500 }
    );
  }
}
