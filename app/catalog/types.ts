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
  /** 0–100 Content Suitability (secular lens): objective content maturity only —
   *  violence / language / sexuality / substances. Worldview & the supernatural
   *  are neutral. Higher = cleaner / more broadly suitable. */
  contentScore: number;
  /** 0–100 Worldview Alignment (faith lens): alignment with a conservative /
   *  traditional Christian family worldview — content PLUS worldview & spiritual
   *  elements. Higher = more aligned. */
  alignmentScore: number;
  /** Dominant worldview lens, one short phrase. */
  worldview: string;
  /** Content-focused 1–2 sentence summary (shown in secular mode). */
  contentSummary: string;
  /** Worldview-focused 1–2 sentence summary (shown in faith mode). */
  worldviewSummary: string;
  ageBand: CatalogAgeBand;
  contentFlags: ContentFlags;
  /** Per-flag examples: for each flagged category (level ≥1), a brief note of
   *  what the book actually contains. Keyed by flag; only flagged keys present. */
  flagNotes: Partial<Record<keyof ContentFlags, string>>;
  themes: string[];
  /** Content-only cautions (violence/language/sexuality/substances/intensity) — shown in both modes. */
  contentCautions: string[];
  /** Worldview/spiritual/occult cautions — shown in faith mode only. */
  worldviewCautions: string[];
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
