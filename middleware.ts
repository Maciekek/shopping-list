import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './app/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: '/lists/:path*'
};
