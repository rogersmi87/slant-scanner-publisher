import Anthropic from '@anthropic-ai/sdk';
import mammoth from 'mammoth';
import { ManuscriptReport } from '../../publishers/submit/types';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const ANALYSIS_PROMPT = `You are a professional manuscript analysis tool for book publishers. Analyze the provided manuscript and return a structured JSON report assessing its ideological content, narrative arc, and market positioning from a conservative/traditional values perspective.

IMPORTANT: Return ONLY valid JSON — no markdown fences, no commentary, no extra text. Just the raw JSON object.

Return exactly this structure:

{
  "title": "manuscript title from the text, or the title provided, or 'Untitled'",
  "author": "author name from the text, or as provided",
  "genre": "primary genre",
  "estimatedWordCount": "approximate word count e.g. '~82,000 words'",
  "overallScore": <integer 0-100>,
  "executiveSummary": "2-3 paragraphs assessing the manuscript's ideological positioning, market fit, and key findings. Be specific — reference actual content, characters, themes from the text.",
  "redemptionArc": {
    "score": <integer 0-100>,
    "summary": "1-2 sentences describing the arc trajectory",
    "points": [
      {
        "pctX": <0-100, narrative position as percentage through story>,
        "score": <0-100, redemptive health at this point>,
        "label": "short label e.g. 'Opening' or 'Ch. 5'",
        "note": "very brief note e.g. 'Doubt emerges'",
        "labelAbove": <true or false, alternate to avoid overlap>
      }
    ]
  },
  "worldviewAxes": [
    {
      "leftLabel": "Transcendent",
      "rightLabel": "Naturalistic",
      "pct": <0-100, where 0=fully transcendent/religious, 100=fully naturalistic/secular>,
      "justification": "1-2 sentences explaining this score with specific references"
    },
    {
      "leftLabel": "Traditional",
      "rightLabel": "Progressive",
      "pct": <0-100, where 0=fully traditional, 100=fully progressive>,
      "justification": "1-2 sentences with specific examples"
    },
    {
      "leftLabel": "Communitarian",
      "rightLabel": "Individualist",
      "pct": <0-100, where 0=fully communitarian, 100=fully individualist>,
      "justification": "1-2 sentences with specific examples"
    },
    {
      "leftLabel": "Redemptive",
      "rightLabel": "Tragic",
      "pct": <0-100, where 0=fully redemptive, 100=fully tragic>,
      "justification": "1-2 sentences with specific examples"
    }
  ],
  "themeInventory": {
    "conservative": [
      { "theme": "theme name", "weight": "primary|secondary|tertiary|minor" }
    ],
    "progressive": [
      { "theme": "theme name", "weight": "primary|secondary|tertiary|minor" }
    ]
  },
  "audienceFit": [
    {
      "segment": "audience segment name",
      "fit": "Strong Fit|Moderate Fit|Limited Fit|Likely Misaligned",
      "notes": "brief explanation of why"
    }
  ],
  "channelRecommendations": {
    "pitch": ["channel or retailer to prioritize"],
    "deprioritize": ["channel or retailer to avoid or approach cautiously"]
  },
  "riskFlags": [
    {
      "flag": "brief flag title",
      "severity": "High|Medium|Low",
      "detail": "1-2 sentences explaining the concern and its likely reader impact"
    }
  ],
  "methodology": "brief paragraph explaining the analytical methodology used"
}

SCORING GUIDELINES:
- overallScore: Content aligned with conservative/traditional values scores higher. Range: 0-100.
  - 75-100: Strongly conservative/faith-aligned, broadly safe for family audiences
  - 55-74: Moderately conservative with some tension areas
  - 35-54: Mixed or ambiguous, significant ideological tension
  - 0-34: Progressive-leaning or content that conflicts with conservative values
- redemptionArc.score: Trajectory from moral chaos toward resolution.
  - 70-100: Clear redemptive arc, moral resolution, characters grow toward virtue
  - 40-69: Partial resolution, mixed arcs, or ambiguous ending
  - 0-39: Downward arc, tragedy without redemption, moral decay
- worldviewAxes.pct: Lower = more conservative (left pole), Higher = more secular/progressive (right pole)
- themeInventory: List 5-10 conservative themes and 3-8 progressive themes. Include only themes actually present in the text.
- audienceFit: Include 5-6 segments. Always consider: faith-based retailers, secular general market, school/library markets, homeschool market, genre-specific (romance/thriller/etc).
- riskFlags: List 3-8 flags. Flag specific content concerns, not just ideology.
- redemptionArc.points: Provide 7-10 points. First point at pctX=0 (opening), last at pctX=100 (resolution). Alternate labelAbove true/false.

Be analytically rigorous and specific. Reference actual characters, scenes, and content from the manuscript rather than making generic observations.`;

function buildUserMessage(text: string, title: string, author: string) {
  const meta = [title && `Title: ${title}`, author && `Author: ${author}`].filter(Boolean).join('\n');
  const truncated = text.slice(0, 380000);
  return `${meta ? meta + '\n\n' : ''}${truncated}`;
}

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('manuscript') as File | null;
  const title = (formData.get('title') as string | null) ?? '';
  const author = (formData.get('author') as string | null) ?? '';

  if (!file) return Response.json({ error: 'No manuscript file provided' }, { status: 400 });

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (!allowedTypes.includes(file.type)) {
    return Response.json({ error: 'Only PDF and Word documents (.pdf, .docx) are accepted' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return Response.json({ error: 'Service not configured' }, { status: 500 });

  const client = new Anthropic({ apiKey });

  let reportText: string;

  try {
    if (file.type === 'application/pdf') {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      const response = await client.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: { type: 'base64', media_type: 'application/pdf', data: base64 },
              },
              ...(title || author
                ? [{ type: 'text' as const, text: [title && `Title: ${title}`, author && `Author: ${author}`].filter(Boolean).join('\n') }]
                : []),
              { type: 'text', text: ANALYSIS_PROMPT },
            ],
          },
        ],
      });
      reportText = (response.content[0] as { type: string; text: string }).text;
    } else {
      const buffer = await file.arrayBuffer();
      const { value: extractedText } = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      const userMessage = buildUserMessage(extractedText, title, author);

      const response = await client.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `${ANALYSIS_PROMPT}\n\n---MANUSCRIPT---\n\n${userMessage}`,
          },
        ],
      });
      reportText = (response.content[0] as { type: string; text: string }).text;
    }
  } catch (e: any) {
    console.error('[analyze-manuscript] Claude error:', e?.message);
    return Response.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }

  let report: ManuscriptReport;
  try {
    const cleaned = reportText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
    report = JSON.parse(cleaned);
  } catch {
    console.error('[analyze-manuscript] JSON parse failed. Raw:', reportText.slice(0, 500));
    return Response.json({ error: 'Could not parse analysis result. Please try again.' }, { status: 500 });
  }

  return Response.json(report);
}
