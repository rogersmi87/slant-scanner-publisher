import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  publisher: z.string().min(2),
  role: z.string().min(1),
  listSize: z.string().min(1),
  genre: z.string().min(1),
  context: z.string().max(500).optional(),
});

const ROLE_LABELS: Record<string, string> = {
  'acquisitions-editor': 'Acquisitions Editor',
  'editorial-director': 'Editorial Director',
  'marketing-director': 'Marketing Director',
  'publisher-lead': 'Publisher / Imprint Lead',
  'other': 'Other',
};

const LIST_LABELS: Record<string, string> = {
  '1-10': '1–10 titles/year',
  '11-50': '11–50 titles/year',
  '51-200': '51–200 titles/year',
  '200+': '200+ titles/year',
};

const GENRE_LABELS: Record<string, string> = {
  'fiction': 'Fiction',
  'nonfiction': 'Non-fiction',
  'childrens-ya': "Children's / YA",
  'academic': 'Academic / Reference',
  'mixed': 'Mixed',
};

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const { name, email, publisher, role, listSize, genre, context } = parsed.data;
  const to = process.env.LEAD_EMAIL ?? 'rogersmi87@gmail.com';

  try {
    await resend.emails.send({
      from: 'Slant Scanner <onboarding@resend.dev>',
      // TODO: Switch from to a verified custom domain sender (e.g., leads@slantscanner.com) before launch
      to,
      replyTo: email,
      subject: `Publisher pilot request — ${publisher}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;color:#1A1A18;line-height:1.6">
          <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#6B6860;margin-bottom:24px">
            SLANT SCANNER · PUBLISHER PILOT REQUEST
          </p>
          <hr style="border:none;border-top:1px solid #E2E0DA;margin-bottom:24px" />

          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#6B6860;width:160px">Name</td><td style="padding:6px 0">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6860">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#1B2B4B">${email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#6B6860">Publisher</td><td style="padding:6px 0">${publisher}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6860">Role</td><td style="padding:6px 0">${ROLE_LABELS[role] ?? role}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6860">Annual list</td><td style="padding:6px 0">${LIST_LABELS[listSize] ?? listSize}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6860">Genre focus</td><td style="padding:6px 0">${GENRE_LABELS[genre] ?? genre}</td></tr>
          </table>

          ${context ? `
          <hr style="border:none;border-top:1px solid #E2E0DA;margin:24px 0" />
          <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#6B6860;margin-bottom:12px">Context</p>
          <p style="font-size:14px;color:#1A1A18">${context}</p>
          ` : ''}

          <hr style="border:none;border-top:1px solid #E2E0DA;margin:24px 0" />
          <p style="font-size:12px;color:#6B6860">Submitted via slantscanner.com/publishers</p>
        </div>
      `,
    });
  } catch (e: any) {
    console.error('[publisher-lead] Resend error:', e?.message);
    return NextResponse.json({ error: 'Could not send. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
