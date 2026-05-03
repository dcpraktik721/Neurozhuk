import type { NextRequest } from 'next/server';

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function configuredOrigins(request: NextRequest): Set<string> {
  const origins = new Set<string>();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neurozhuk.ru';
  const configuredSiteOrigin = normalizeOrigin(siteUrl);
  if (configuredSiteOrigin) origins.add(configuredSiteOrigin);

  origins.add('https://neurozhuk.ru');
  origins.add('https://www.neurozhuk.ru');
  origins.add(request.nextUrl.origin);

  const forwardedHost =
    request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (forwardedHost) {
    const forwardedProto =
      request.headers.get('x-forwarded-proto') ||
      (process.env.NODE_ENV === 'production' ? 'https' : 'http');
    origins.add(`${forwardedProto}://${forwardedHost}`);
  }

  const extraOrigins = process.env.SECURITY_ALLOWED_ORIGINS;
  if (extraOrigins) {
    for (const origin of extraOrigins.split(',')) {
      const normalized = normalizeOrigin(origin.trim());
      if (normalized) origins.add(normalized);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
  }

  return origins;
}

export function validateStateChangingOrigin(request: NextRequest): boolean {
  const allowedOrigins = configuredOrigins(request);
  const origin = request.headers.get('origin');

  if (origin) {
    const normalizedOrigin = normalizeOrigin(origin);
    return !!normalizedOrigin && allowedOrigins.has(normalizedOrigin);
  }

  const referer = request.headers.get('referer');
  if (referer) {
    const normalizedReferer = normalizeOrigin(referer);
    return !!normalizedReferer && allowedOrigins.has(normalizedReferer);
  }

  return process.env.NODE_ENV !== 'production';
}
