// ========================================
// Поймай Жука — API Runtime Validation
// ========================================
// Tiny dependency-free validators for incoming JSON.
// Each validator returns a discriminated union: { ok, value } | { ok, error }.

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const ALLOWED_MODES = ['normal', 'timed', 'practice'] as const;
type AllowedMode = (typeof ALLOWED_MODES)[number];

// Numeric guards — protect against NaN, Infinity, negative values, type confusion.

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function num(
  raw: unknown,
  field: string,
  opts: { min?: number; max?: number; integer?: boolean } = {},
): { ok: true; value: number } | { ok: false; error: string } {
  if (!isFiniteNumber(raw)) {
    return { ok: false, error: `Поле «${field}» должно быть числом.` };
  }
  if (opts.integer && !Number.isInteger(raw)) {
    return { ok: false, error: `Поле «${field}» должно быть целым числом.` };
  }
  if (opts.min !== undefined && raw < opts.min) {
    return {
      ok: false,
      error: `Поле «${field}» не может быть меньше ${opts.min}.`,
    };
  }
  if (opts.max !== undefined && raw > opts.max) {
    return {
      ok: false,
      error: `Поле «${field}» не может быть больше ${opts.max}.`,
    };
  }
  return { ok: true, value: raw };
}

function str(
  raw: unknown,
  field: string,
  opts: { maxLength?: number; allowEmpty?: boolean } = {},
): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof raw !== 'string') {
    return { ok: false, error: `Поле «${field}» должно быть строкой.` };
  }
  const trimmed = raw.trim();
  if (!opts.allowEmpty && trimmed.length === 0) {
    return { ok: false, error: `Поле «${field}» не может быть пустым.` };
  }
  if (opts.maxLength && trimmed.length > opts.maxLength) {
    return {
      ok: false,
      error: `Поле «${field}» слишком длинное (макс. ${opts.maxLength}).`,
    };
  }
  return { ok: true, value: trimmed };
}

// ── /api/sessions POST payload ───────────────────────────

export interface SessionInput {
  score: number;
  correctAnswers: number;
  totalAttempts: number;
  accuracy: number;
  duration: number;
  mode: AllowedMode;
  rank: string;
  maxStreak: number;
  level: number;
  maxCombo: number;
  totalCorrect: number;
  totalWrong: number;
}

// Hard caps — protect DB from absurd values. A 24-hour session is impossible
// in this game; 100k score would mean ~2k correct answers in a row.
const SESSION_LIMITS = {
  maxScore: 100_000,
  maxAttempts: 100_000,
  maxDurationSeconds: 60 * 60 * 24, // 24h
  maxStreak: 100_000,
  maxLevel: 1_000,
  maxCombo: 100_000,
  maxAttemptsPerSecond: 12,
  maxAttemptGrace: 20,
};

function computeAccuracy(correctAnswers: number, totalAttempts: number): number {
  if (totalAttempts === 0) return 100;
  return Math.round((correctAnswers / totalAttempts) * 10_000) / 100;
}

function maxScoreForCorrectAnswers(totalCorrect: number): number {
  const fullGroups = Math.floor(totalCorrect / 5);
  const remainder = totalCorrect % 5;
  const floorSum =
    5 * ((fullGroups * (fullGroups - 1)) / 2) + fullGroups * (remainder + 1);

  return 10 * totalCorrect + 5 * floorSum;
}

export function validateSessionInput(
  body: unknown,
): ValidationResult<SessionInput> {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Ожидается JSON-объект.' };
  }
  const b = body as Record<string, unknown>;

  // Required fields
  const score = num(b.score, 'score', {
    min: 0,
    max: SESSION_LIMITS.maxScore,
    integer: true,
  });
  if (!score.ok) return score;

  const correctAnswers = num(b.correctAnswers, 'correctAnswers', {
    min: 0,
    max: SESSION_LIMITS.maxAttempts,
    integer: true,
  });
  if (!correctAnswers.ok) return correctAnswers;

  const totalAttempts = num(b.totalAttempts, 'totalAttempts', {
    min: 0,
    max: SESSION_LIMITS.maxAttempts,
    integer: true,
  });
  if (!totalAttempts.ok) return totalAttempts;

  // Accept the field for backward compatibility, but overwrite it below.
  const accuracy = num(b.accuracy ?? 0, 'accuracy', { min: 0, max: 100 });
  if (!accuracy.ok) return accuracy;

  const duration = num(b.duration ?? 0, 'duration', {
    min: 0,
    max: SESSION_LIMITS.maxDurationSeconds,
    integer: true,
  });
  if (!duration.ok) return duration;

  // mode — strict enum
  const modeRaw = typeof b.mode === 'string' ? b.mode : 'normal';
  if (!ALLOWED_MODES.includes(modeRaw as AllowedMode)) {
    return {
      ok: false,
      error: `Поле «mode» должно быть одним из: ${ALLOWED_MODES.join(', ')}.`,
    };
  }

  const rank = str(b.rank ?? 'Новичок', 'rank', { maxLength: 64 });
  if (!rank.ok) return rank;

  const maxStreak = num(b.maxStreak ?? 0, 'maxStreak', {
    min: 0,
    max: SESSION_LIMITS.maxStreak,
    integer: true,
  });
  if (!maxStreak.ok) return maxStreak;

  // Optional runtime metrics (forward-compat). Default to safe values.
  const level = num(b.level ?? 1, 'level', {
    min: 1,
    max: SESSION_LIMITS.maxLevel,
    integer: true,
  });
  if (!level.ok) return level;

  const maxCombo = num(b.maxCombo ?? 0, 'maxCombo', {
    min: 0,
    max: SESSION_LIMITS.maxCombo,
    integer: true,
  });
  if (!maxCombo.ok) return maxCombo;

  const totalCorrect = num(b.totalCorrect ?? correctAnswers.value, 'totalCorrect', {
    min: 0,
    max: SESSION_LIMITS.maxAttempts,
    integer: true,
  });
  if (!totalCorrect.ok) return totalCorrect;

  const totalWrong = num(b.totalWrong ?? 0, 'totalWrong', {
    min: 0,
    max: SESSION_LIMITS.maxAttempts,
    integer: true,
  });
  if (!totalWrong.ok) return totalWrong;

  // Cross-field sanity: correctAnswers <= totalAttempts
  if (correctAnswers.value > totalAttempts.value) {
    return {
      ok: false,
      error: 'Поле «correctAnswers» не может превышать «totalAttempts».',
    };
  }
  if (totalCorrect.value + totalWrong.value !== totalAttempts.value) {
    return {
      ok: false,
      error: 'Сумма «totalCorrect» и «totalWrong» должна равняться «totalAttempts».',
    };
  }
  if (totalCorrect.value < correctAnswers.value) {
    return {
      ok: false,
      error: 'Поле «totalCorrect» не может быть меньше «correctAnswers».',
    };
  }
  if (maxStreak.value > totalCorrect.value) {
    return {
      ok: false,
      error: 'Поле «maxStreak» не может превышать «totalCorrect».',
    };
  }
  if (maxCombo.value > totalCorrect.value) {
    return {
      ok: false,
      error: 'Поле «maxCombo» не может превышать «totalCorrect».',
    };
  }
  const maxAttemptsForDuration =
    duration.value === 0
      ? SESSION_LIMITS.maxAttemptGrace
      : duration.value * SESSION_LIMITS.maxAttemptsPerSecond +
        SESSION_LIMITS.maxAttemptGrace;
  if (totalAttempts.value > maxAttemptsForDuration) {
    return {
      ok: false,
      error: 'Количество попыток не соответствует длительности сессии.',
    };
  }
  if (score.value > maxScoreForCorrectAnswers(totalCorrect.value)) {
    return {
      ok: false,
      error: 'Поле «score» не соответствует количеству правильных ответов.',
    };
  }

  const serverAccuracy = computeAccuracy(correctAnswers.value, totalAttempts.value);

  return {
    ok: true,
    value: {
      score: score.value,
      correctAnswers: correctAnswers.value,
      totalAttempts: totalAttempts.value,
      accuracy: serverAccuracy,
      duration: duration.value,
      mode: modeRaw as AllowedMode,
      rank: rank.value,
      maxStreak: maxStreak.value,
      level: level.value,
      maxCombo: maxCombo.value,
      totalCorrect: totalCorrect.value,
      totalWrong: totalWrong.value,
    },
  };
}

// ── /api/achievements POST payload ───────────────────────

export interface AchievementCheckInput {
  score: number;
  accuracy: number;
}

export function validateAchievementCheckInput(
  body: unknown,
): ValidationResult<AchievementCheckInput> {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Ожидается JSON-объект.' };
  }
  const b = body as Record<string, unknown>;

  const score = num(b.score ?? 0, 'score', {
    min: 0,
    max: SESSION_LIMITS.maxScore,
    integer: true,
  });
  if (!score.ok) return score;

  const accuracy = num(b.accuracy ?? 0, 'accuracy', { min: 0, max: 100 });
  if (!accuracy.ok) return accuracy;

  return { ok: true, value: { score: score.value, accuracy: accuracy.value } };
}

// ── /api/sessions GET pagination ─────────────────────────

export interface PaginationInput {
  limit: number;
  offset: number;
}

export function parsePagination(
  searchParams: URLSearchParams,
  defaults: { limit: number; maxLimit: number } = { limit: 20, maxLimit: 100 },
): PaginationInput {
  const rawLimit = parseInt(searchParams.get('limit') || String(defaults.limit), 10);
  const rawOffset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = Math.min(
    Math.max(Number.isFinite(rawLimit) ? rawLimit : defaults.limit, 1),
    defaults.maxLimit,
  );
  const offset = Math.max(Number.isFinite(rawOffset) ? rawOffset : 0, 0);
  return { limit, offset };
}
