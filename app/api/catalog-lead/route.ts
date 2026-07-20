import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';
import { Resend } from 'resend';
import { z } from 'zod';

// Captures the email a visitor enters before scanning their catalog. The address
// is persisted (Netlify Blobs) so leads aren't lost if email delivery hiccups,
// and a notification is sent best-effort. Capture never blocks the user: any
// storage/email failure is logged, and the route still returns success so the
// scanner unlocks.

export const dynamic = 'force-dynamic';

const schema = z.object({
  email: z.string().email(),
  org: z.string().max(120).optional(),
});

type LeadRecord = {
  email: string;
  org: string;
  firstSeen: string;
  lastSeen: string;
  scans: number;
};

function leadStore() {
  try {
    return getStore('catalog-leads');
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  const { email, org } = parsed.data;

  // Persist (best-effort). Keyed by normalized email so repeat visits update one
  // record and bump a scan counter.
  const s = leadStore();
  if (s) {
    try {
      const key = `lead_${email.toLowerCase().replace(/[^a-z0-9@._-]+/g, '')}`;
      const existing = (await s.get(key, { type: 'json' })) as LeadRecord | null;
      const now = new Date().toISOString();
      const record: LeadRecord = {
        email,
        org: org ?? existing?.org ?? '',
        firstSeen: existing?.firstSeen ?? now,
        lastSeen: now,
        scans: (existing?.scans ?? 0) + 1,
      };
      await s.setJSON(key, record);
    } catch (e) {
      console.error('[catalog-lead] blob write failed:', e instanceof Error ? e.message : e);
    }
  }

  // Notify (best-effort; only if email sending is configured for this site).
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const to = process.env.LEAD_EMAIL ?? 'rogersmi87@gmail.com';
      await resend.emails.send({
        from: 'Slant Scanner <leads@slantscanner.info>',
        to,
        replyTo: email,
        subject: `Catalog scanner lead — ${org || email}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;color:#1A1A18;line-height:1.6">
            <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#6B6860;margin-bottom:24px">
              SLANT SCANNER · CATALOG SCANNER LEAD
            </p>
            <hr style="border:none;border-top:1px solid #E2E0DA;margin-bottom:24px" />
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:6px 0;color:#6B6860;width:160px">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#1B2B4B">${email}</a></td></tr>
              <tr><td style="padding:6px 0;color:#6B6860">School / library</td><td style="padding:6px 0">${org || '—'}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #E2E0DA;margin:24px 0" />
            <p style="font-size:12px;color:#6B6860">Started a scan at slantscanner.com/catalog</p>
          </div>
        `,
      });
    } catch (e) {
      console.error('[catalog-lead] Resend error:', e instanceof Error ? e.message : e);
    }
  }

  return NextResponse.json({ success: true });
}
