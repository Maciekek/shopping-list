import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/prisma/prisma';
import type { Adapter } from 'next-auth/adapters';

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log(21, 'test autho', auth, nextUrl)
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
