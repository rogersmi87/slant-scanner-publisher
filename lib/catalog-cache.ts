// Shared analysis cache for the catalog scanner.
//
// A published book's worldview/content read is the same no matter which school
// scans it, so analyses are cached GLOBALLY (not per-org) and keyed by ISBN —
// falling back to a normalized author+title when no ISBN is present. Because
// school and library collections overlap heavily, hit rate climbs quickly and
// both cost and scan latency fall over time.
//
// Backed by Netlify Blobs (zero-config KV inside Netlify functions). Every
// operation degrades gracefully: if Blobs is unavailable (e.g. running the
// build locally outside `netlify dev`), the helpers return null / no-op and the
// route simply analyzes fresh. A cache failure must never break a scan.

import { getStore } from '@netlify/blobs';
import type { CatalogTitleReport } from '@/app/catalog/types';

const STORE_NAME = 'catalog-analyses';

/**
 * Stamped on every cached entry. Bump this whenever the model or the rubric
 * changes so existing entries are treated as misses and re-analyzed.
 */
export const ANALYSIS_VERSION = 'sonnet5-rubric1';

type CacheEntry = {
  v: string;
  report: CatalogTitleReport;
  at: string;
};

function normalize(s: string): string {
  return (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** ISBN when we have one (the strongest identity), else author+title. */
export function cacheKey(title: string, author: string, isbn?: string): string {
  const digits = (isbn ?? '').replace(/[^0-9Xx]/g, '');
  if (digits.length >= 10) return `isbn_${digits.toUpperCase()}`;
  return `ta_${normalize(author)}__${normalize(title)}`.slice(0, 300);
}

function store() {
  try {
    return getStore(STORE_NAME);
  } catch {
    return null; // Blobs not configured in this environment — skip caching.
  }
}

export async function getCached(key: string): Promise<CatalogTitleReport | null> {
  const s = store();
  if (!s) return null;
  try {
    const entry = (await s.get(key, { type: 'json' })) as CacheEntry | null;
    if (entry && entry.v === ANALYSIS_VERSION && entry.report) return entry.report;
    return null;
  } catch {
    return null;
  }
}

export async function setCached(key: string, report: CatalogTitleReport): Promise<void> {
  const s = store();
  if (!s) return;
  try {
    const entry: CacheEntry = { v: ANALYSIS_VERSION, report, at: new Date().toISOString() };
    await s.setJSON(key, entry);
  } catch {
    // Cache writes are best-effort.
  }
}
