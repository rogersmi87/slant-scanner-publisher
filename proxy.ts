import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/publishers/submit/login') return NextResponse.next();

  const cookie = request.cookies.get('publisher_auth')?.value;
  const expected = process.env.PUBLISHER_AUTH_TOKEN;

  if (!expected || cookie !== expected) {
    const login = new URL('/publishers/submit/login', request.url);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/publishers/submit', '/publishers/submit/:path*'],
};
