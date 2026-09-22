import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/prisma/prisma';
import { db } from '@/db';

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  events: {
    // Fires once per completed sign-in (not per request, sessions are JWTs),
    // so this is a faithful "who logged in when" log for the admin panel.
    async signIn({ user, account }) {
      if (!user?.id) return;
      if (user.email) {
        await db.lists.claimInvites({ userId: user.id, email: user.email.toLowerCase() });
      }
      try {
        await prisma.$transaction([
          prisma.loginEvent.create({
            data: { userId: user.id, provider: account?.provider ?? null }
          }),
          prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          })
        ]);
      } catch (e) {
        console.error('[auth] failed to record sign-in', e);
      }
    }
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const paths = ['/profile', '/client-side'];
      const isProtected = paths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL('/api/auth/signin', nextUrl.origin);
        redirectUrl.searchParams.append('callbackUrl', nextUrl.href);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
    session(params) {
      return {
        ...params.session,
        user: {
          ...params.session.user,
          id: params.token.id as string,
          randomKey: params.token.randomKey,
        },
      };
    },
  },
  pages: {
    signIn: '/sign-in'
  }
});
