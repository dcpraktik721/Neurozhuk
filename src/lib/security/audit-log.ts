import { createHash } from 'node:crypto';

type SecurityEvent = {
  type: string;
  outcome: 'success' | 'failure' | 'blocked';
  actorId?: string;
  subjectHash?: string;
  ipHash?: string;
  route?: string;
  reason?: string;
};

export function hashIdentifier(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 24);
}

export function recordSecurityEvent(event: SecurityEvent): void {
  const payload = {
    at: new Date().toISOString(),
    source: 'neurozhuk',
    ...event,
  };

  const line = `[security] ${JSON.stringify(payload)}`;
  if (event.outcome === 'success') {
    console.info(line);
  } else {
    console.warn(line);
  }
}
