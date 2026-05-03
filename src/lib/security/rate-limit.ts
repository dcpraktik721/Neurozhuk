import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';

type Bucket = {
  count: number;
  resetAt: number;
};

type HeaderReader = {
  get(name: string): string | null;
};

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfter: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export function hashForRateLimit(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 24);
}

export function getClientIp(headers: HeaderReader): string {
  const forwardedFor = headers.get('x-forwarded-for');
  const firstForwardedIp = forwardedFor?.split(',')[0]?.trim();
  const raw =
    firstForwardedIp ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown';

  return raw.replace(/[^\w.: -]/g, '').slice(0, 80) || 'unknown';
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    pruneBuckets(now);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true };
}

export function rateLimitedJson(
  retryAfter: number,
  body: Record<string, unknown> = {
    error: 'Слишком много запросов. Попробуйте позже.',
  },
): NextResponse {
  return NextResponse.json(body, {
    status: 429,
    headers: {
      'Retry-After': String(retryAfter),
      'Cache-Control': 'no-store',
    },
  });
}

function pruneBuckets(now: number): void {
  if (buckets.size < MAX_BUCKETS) return;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }

  while (buckets.size >= MAX_BUCKETS) {
    const firstKey = buckets.keys().next().value as string | undefined;
    if (!firstKey) return;
    buckets.delete(firstKey);
  }
}
