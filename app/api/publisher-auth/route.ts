import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let body: { password?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }

  if (!body.password || body.password !== process.env.PUBLISHER_SUBMIT_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = process.env.PUBLISHER_AUTH_TOKEN;
  if (!token) return NextResponse.json({ error: 'Service not configured' }, { status: 500 });

  const res = NextResponse.json({ success: true });
  res.cookies.set('publisher_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
  return res;
}
