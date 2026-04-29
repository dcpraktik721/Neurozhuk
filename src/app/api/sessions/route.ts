// ========================================
// Поймай Жука — Game Sessions API
// ========================================
// POST /api/sessions — Save a new game session (validated)
// GET  /api/sessions — Get paginated session history

import { NextResponse, type NextRequest } from 'next/server';
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
        rank: v.rank,
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
