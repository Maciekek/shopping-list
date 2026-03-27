import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './app/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session) {
    const signInUrl = new URL('/api/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: '/lists/:path*'
};
