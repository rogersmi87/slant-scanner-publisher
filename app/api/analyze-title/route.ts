import Anthropic from '@anthropic-ai/sdk';
import { CatalogTitleReport } from '../../catalog/types';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Per the Anthropic API guidance, default to Opus 4.8. For very large catalogs
// where per-title latency/cost matters more than depth, this can be switched to
// a faster model (e.g. claude-sonnet-5) — a deliberate tradeoff, not a default.
const MODEL = 'claude-opus-4-8';

const ANALYSIS_PROMPT = `You are Slant Scanner, a worldview-and-content analysis tool used by school and library staff to audit a book collection. You are given a book's title and author (and sometimes ISBN). Using your knowledge of the PUBLISHED book, return a structured JSON assessment from a conservative/traditional family-values perspective.

CRITICAL RULES:
- Analyze the ACTUAL published book. Do NOT invent content.
- If you do not recognize the book or are not confident about its actual content, set "recognized": false and "confidence": "insufficient" and leave scores conservative/neutral. NEVER fabricate an analysis for a book you don't know.
- Return ONLY valid JSON — no markdown fences, no commentary.

Return exactly this structure:
{
  "recognized": <true|false>,
  "confidence": "high" | "medium" | "low" | "insufficient",
  "overallScore": <integer 0-100, higher = more aligned with conservative/traditional family values and broadly safe for family audiences>,
  "worldview": "<one short phrase for the dominant worldview lens, e.g. 'Christian / Biblical', 'Secular humanist', 'Naturalistic', 'Mixed / ambiguous', 'Not worldview-bearing'>",
  "worldviewSummary": "<1-2 sentences on the book's worldview and overall content fit, referencing what actually happens in the book>",
  "ageBand": "Picture book" | "Early reader" | "Middle grade" | "Young adult" | "Adult",
  "contentFlags": {
    "violence":   <0-3>,
    "language":   <0-3>,
    "sexuality":  <0-3>,
    "substances": <0-3>,
    "occult":     <0-3>,
    "spiritual":  <0-3>
  },
  "themes": ["<moral/thematic tag>", "..."],
  "cautions": ["<brief specific content caution a parent/librarian would want>", "..."]
}

CONTENT FLAG SCALE (each 0-3): 0 = none, 1 = mild/incidental, 2 = moderate, 3 = strong/frequent.
- "spiritual" flags religious, magical, or supernatural content neutrally (note it; don't treat magic as inherently disqualifying).
SCORING: 75-100 strongly aligned & family-safe · 55-74 moderately aligned with some tension · 35-54 mixed/ambiguous · 0-34 conflicts with conservative family values. When "recognized" is false, use a neutral 50 and empty themes/cautions.
themes: 3-8 tags. cautions: 0-6 short, specific items. Base everything on the real book.`;

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
    overallScore: typeof parsed.overallScore === 'number' ? parsed.overallScore : 50,
    worldview: parsed.worldview ?? 'Unknown',
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
    themes: Array.isArray(parsed.themes) ? parsed.themes.slice(0, 8) : [],
    cautions: Array.isArray(parsed.cautions) ? parsed.cautions.slice(0, 6) : [],
  };

  return Response.json(report);
}
