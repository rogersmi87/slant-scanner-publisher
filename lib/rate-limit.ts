// Server-side abuse protection for the public catalog scanner.
//
// The scanner page is open (email-gated only on the client), so /api/analyze-title
// is reachable by anyone — and every uncached call spends Anthropic tokens. This
// caps that spend with a fixed-window counter per client IP, plus a global hourly
// backstop against a determined caller rotating IPs.
//
// Backed by Netlify Blobs. It FAILS OPEN: if the store is unavailable (local dev
// outside `netlify dev`, or a transient Blobs error) the limiter allows the
// request rather than breaking a legitimate scan. The goal is to stop casual
// bill-running abuse, not to be a hardened security control.

import { getStore } from '@netlify/blobs';

const STORE_NAME = 'rate-limits';
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// A legitimate scan is at most FREE_LIMIT (25) requests; this allows several
// full scans per hour from one visitor while blocking scripted abuse.
const PER_IP_MAX = 150;
// Backstop on total spend regardless of source.
const GLOBAL_MAX = 3000;

function store() {
  try {
    return getStore(STORE_NAME);
  } catch {
    return null; // Blobs not configured here — no limiting.
  }
}

/** Best client IP available behind Netlify's proxy. */
export function clientIp(req: Request): string {
  const nf = req.headers.get('x-nf-client-connection-ip');
  if (nf) return nf.trim();
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return 'unknown';
}

type Counter = { count: number };

async function hit(
  s: NonNullable<ReturnType<typeof store>>,
  key: string,
  max: number,
): Promise<boolean> {
  try {
    const cur = (await s.get(key, { type: 'json' })) as Counter | null;
    const count = (cur?.count ?? 0) + 1;
    if (count > max) return false; // over the cap — stop writing, leave it pinned
    await s.setJSON(key, { count });
    return true;
  } catch {
    return true; // fail open on any store error
  }
}

export type RateResult = { ok: boolean; scope?: 'ip' | 'global' };

export async function checkRateLimit(ip: string): Promise<RateResult> {
  const s = store();
  if (!s) return { ok: true }; // degraded / local — don't block

  // Window is encoded in the key, so each hour gets a fresh bucket. Read-modify-
  // write isn't atomic, so concurrent requests may slightly under-count — fine,
  // we err toward allowing.
  const windowStart = Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS;

  const ipOk = await hit(s, `ip_${ip}_${windowStart}`, PER_IP_MAX);
  if (!ipOk) return { ok: false, scope: 'ip' };

  const globalOk = await hit(s, `global_${windowStart}`, GLOBAL_MAX);
  if (!globalOk) return { ok: false, scope: 'global' };

  return { ok: true };
}
