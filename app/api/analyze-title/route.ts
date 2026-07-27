import Anthropic from '@anthropic-ai/sdk';
import { CatalogTitleReport } from '../../catalog/types';
import { cacheKey, getCached, setCached } from '@/lib/catalog-cache';
import { clientIp, checkRateLimit } from '@/lib/rate-limit';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Sonnet 5 — matches the main app, and the right tier for per-title catalog
// scans where a scan may cover hundreds of books. Thinking is adaptive-by-
// default on Sonnet 5, so it's disabled explicitly: this is a bounded
// structured-extraction task and thinking would add latency and tokens per
// title. Bump ANALYSIS_VERSION in lib/catalog-cache.ts if this changes.
const MODEL = 'claude-sonnet-5';

const ANALYSIS_PROMPT = `You are Slant Scanner, a worldview-and-content analysis tool used by school and library staff to audit a book collection. You are given a book's title and author (and sometimes ISBN). Using your knowledge of the PUBLISHED book, return a structured JSON assessment. You give TWO INDEPENDENT 0–100 scores — Content Suitability (a secular, content-only read) and Worldview Alignment (a conservative/traditional Christian read) — plus content flags and cautions.

CRITICAL RULES:
- Analyze the ACTUAL published book. Do NOT invent content.
- If you do not recognize the book or are not confident about its actual content, set "recognized": false and "confidence": "insufficient" and leave scores conservative/neutral. NEVER fabricate an analysis for a book you don't know.
- Return ONLY valid JSON — no markdown fences, no commentary.

Return exactly this structure:
{
  "recognized": <true|false>,
  "confidence": "high" | "medium" | "low" | "insufficient",
  "contentScore": <integer 0-100 — Content Suitability; see rubric below>,
  "alignmentScore": <integer 0-100 — Worldview Alignment; see rubric below>,
  "worldview": "<one short phrase for the dominant worldview lens, e.g. 'Christian / Biblical', 'Secular humanist', 'Naturalistic', 'Mixed / ambiguous', 'Not worldview-bearing'>",
  "contentSummary": "<1-2 sentences describing the book's CONTENT ONLY — the maturity of violence/language/sexuality/substances/intensity and who it suits. NEUTRAL: no worldview judgment; do not treat magic/religion as a concern here.>",
  "worldviewSummary": "<1-2 sentences on the book's WORLDVIEW fit from a conservative/traditional Christian lens — the dominant worldview and any spiritual/occult elements.>",
  "ageBand": "Picture book" | "Early reader" | "Middle grade" | "Young adult" | "Adult",
  "contentFlags": {
    "violence":   <0-3>,
    "language":   <0-3>,
    "sexuality":  <0-3>,
    "substances": <0-3>,
    "occult":     <0-3>,
    "spiritual":  <0-3>
  },
  "flagNotes": {
    "<flag name>": "<for EACH content flag rated 1 or higher, a brief specific example of what the book actually contains in that category (e.g. 'A spider dies of old age; a rat is selfish'). Omit flags rated 0.>"
  },
  "themes": ["<moral/thematic tag>", "..."],
  "contentCautions": ["<content-only caution a parent/librarian would want: violence, language, sexuality, substances, or intensity. NO worldview/spiritual items here.>", "..."],
  "worldviewCautions": ["<worldview / spiritual / occult / anti-religious caution — the things a faith-based school specifically cares about.>", "..."]
}

CONTENT FLAG SCALE (each 0-3): 0 = none, 1 = mild/incidental, 2 = moderate, 3 = strong/frequent.
- "spiritual" flags religious, magical, or supernatural content neutrally (note it; don't treat magic as inherently disqualifying).
SCORE 1 — CONTENT SUITABILITY (secular; objective content ONLY): judge the maturity of violence, language, sexual content, substances, and thematic intensity. WORLDVIEW, RELIGION, MAGIC, and the SUPERNATURAL are NEUTRAL and must NOT lower this score. Bands: 85-100 clean/minimal mature content · 70-84 mild · 50-69 moderate (review for younger grades) · 30-49 strong mature content · 0-29 explicit/graphic.
SCORE 2 — WORLDVIEW ALIGNMENT (conservative/traditional Christian family read): consider the content above PLUS the dominant worldview, spiritual/occult/supernatural elements, and whether themes affirm or undermine traditional values. Bands: 85-100 strongly aligned & family-safe · 70-84 broadly aligned, minor tension · 50-69 mixed · 30-49 notable conflict · 0-29 strongly conflicts.
The two scores are INDEPENDENT: a book can score HIGH Content Suitability but LOW Worldview Alignment (e.g. clean-but-magical fantasy), or the reverse.
TEXT MUST MATCH ITS LENS: contentSummary + contentCautions describe ONLY objective content (never magic/religion as a problem); worldviewSummary + worldviewCautions carry the worldview/spiritual layer. A secular reader sees only the content text; a faith-based reader sees both.
When "recognized" is false, use a neutral 50 for BOTH scores and leave contentSummary, worldviewSummary, flagNotes, themes, contentCautions, and worldviewCautions empty.
themes: 3-8 tags. contentCautions & worldviewCautions: 0-5 short specific items each. flagNotes: one short example per flag rated 1+. Base everything on the real book.`;

export async function POST(req: Request) {
  let body: { title?: string; author?: string; isbn?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const title = (body.title ?? '').trim();
  const author = (body.author ?? '').trim();
  const isbn = (body.isbn ?? '').trim();
  if (!title) return Response.json({ error: 'title is required' }, { status: 400 });

  // Shared cache: a book's analysis is identical for every school that scans it.
  // Cache hits are free, so they're served before the rate limiter — only calls
  // that will actually spend tokens are throttled.
  const key = cacheKey(title, author, isbn);
  const cached = await getCached(key);
  if (cached) return Response.json({ ...cached, cached: true });

  // Abuse protection on the paid path (see lib/rate-limit.ts).
  const rate = await checkRateLimit(clientIp(req));
  if (!rate.ok) {
    return Response.json(
      { error: 'Scan limit reached. Contact us for a full-catalog audit.' },
      { status: 429 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return Response.json({ error: 'Service not configured' }, { status: 500 });

  const client = new Anthropic({ apiKey });
  const meta = [`Title: ${title}`, author && `Author: ${author}`, isbn && `ISBN: ${isbn}`]
    .filter(Boolean).join('\n');

  let reportText: string;
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      thinking: { type: 'disabled' },
      messages: [{ role: 'user', content: `${ANALYSIS_PROMPT}\n\n---BOOK---\n${meta}` }],
    });
    reportText = (response.content[0] as { type: string; text: string }).text;
  } catch (e: unknown) {
    console.error('[analyze-title] Claude error:', e instanceof Error ? e.message : e);
    return Response.json({ error: 'Analysis failed' }, { status: 500 });
  }

  let parsed: Partial<CatalogTitleReport>;
  try {
    const cleaned = reportText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    console.error('[analyze-title] JSON parse failed. Raw:', reportText.slice(0, 300));
    return Response.json({ error: 'Could not parse analysis' }, { status: 500 });
  }

  const report: CatalogTitleReport = {
    title,
    author,
    isbn: isbn || undefined,
    recognized: parsed.recognized ?? false,
    confidence: parsed.confidence ?? 'insufficient',
    contentScore: typeof parsed.contentScore === 'number' ? parsed.contentScore : 50,
    alignmentScore: typeof parsed.alignmentScore === 'number' ? parsed.alignmentScore : 50,
    worldview: parsed.worldview ?? 'Unknown',
    contentSummary: parsed.contentSummary ?? '',
    worldviewSummary: parsed.worldviewSummary ?? '',
    ageBand: parsed.ageBand ?? 'Adult',
    contentFlags: {
      violence:   parsed.contentFlags?.violence ?? 0,
      language:   parsed.contentFlags?.language ?? 0,
      sexuality:  parsed.contentFlags?.sexuality ?? 0,
      substances: parsed.contentFlags?.substances ?? 0,
      occult:     parsed.contentFlags?.occult ?? 0,
      spiritual:  parsed.contentFlags?.spiritual ?? 0,
    },
    flagNotes: (parsed.flagNotes && typeof parsed.flagNotes === 'object') ? parsed.flagNotes : {},
    themes: Array.isArray(parsed.themes) ? parsed.themes.slice(0, 8) : [],
    contentCautions: Array.isArray(parsed.contentCautions) ? parsed.contentCautions.slice(0, 6) : [],
    worldviewCautions: Array.isArray(parsed.worldviewCautions) ? parsed.worldviewCautions.slice(0, 6) : [],
  };

  // Only cache confident analyses — an unrecognized title should be retried on a
  // later scan rather than permanently remembered as "unknown".
  if (report.recognized) await setCached(key, report);

  return Response.json({ ...report, cached: false });
}
