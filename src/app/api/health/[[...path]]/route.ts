import { NextResponse } from 'next/server';
import { getClientIp, hashForRateLimit, rateLimit } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const limited = checkHealthRateLimit(request);
  if (limited) return limited;

  return NextResponse.json(
    {
      status: 'ok',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}

export function HEAD(request: Request) {
  const limited = checkHealthRateLimit(request);
  if (limited) return limited;

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

function checkHealthRateLimit(request: Request): NextResponse | null {
  const ip = getClientIp(request.headers);
  const ipHash = hashForRateLimit(ip);
  const limit = rateLimit(`api:health:${ipHash}`, 120, 60_000);

  if (limit.ok) return null;

  return new NextResponse(null, {
    status: 429,
    headers: {
      'Retry-After': String(limit.retryAfter),
      'Cache-Control': 'no-store',
    },
  });
}
