// Per-title Slant Scanner analysis for a library/school catalog audit. Lighter
// than the full manuscript ManuscriptReport — it's produced from public book
// info (title/author/ISBN), so it must never fabricate: an unrecognized title
// returns confidence "insufficient" and recognized: false rather than a guess.

export type CatalogAgeBand =
  | 'Picture book'
  | 'Early reader'
  | 'Middle grade'
  | 'Young adult'
  | 'Adult';

export type Confidence = 'high' | 'medium' | 'low' | 'insufficient';

// Each content flag is 0 (none) – 3 (strong).
export type ContentFlags = {
  violence: number;
  language: number;
  sexuality: number;
  substances: number;
  occult: number;
  spiritual: number;
};

export type CatalogTitleReport = {
  title: string;
  author: string;
  isbn?: string;
  recognized: boolean;
  confidence: Confidence;
  /** 0–100: alignment with conservative / traditional family values (higher = more aligned). */
  overallScore: number;
  /** Dominant worldview lens, one short phrase. */
  worldview: string;
  worldviewSummary: string;
  ageBand: CatalogAgeBand;
  contentFlags: ContentFlags;
  themes: string[];
  cautions: string[];
};

export const FLAG_KEYS: (keyof ContentFlags)[] = [
  'violence', 'language', 'sexuality', 'substances', 'occult', 'spiritual',
];

export const FLAG_LABELS: Record<keyof ContentFlags, string> = {
  violence: 'Violence',
  language: 'Language',
  sexuality: 'Sexuality',
  substances: 'Substances',
  occult: 'Occult / Supernatural',
  spiritual: 'Spiritual content',
};
