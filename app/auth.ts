import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { createUserQuery, getUserByEmail } from '@/db/queries';

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.OAUTH_CLIENT_KEY as string,
      clientSecret: process.env.OAUTH_CLIENT_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      console.log(23, 'SIGN IN CALLBACK')
      const result = await getUserByEmail(profile?.email || '');
      console.log(25, result.rowCount === 1);

      if (result.rowCount === 1) {
        return true;
      }

      await createUserQuery(profile?.email!);
      return true
    }
  },
  pages: {
    signIn: '/sign-in'
  }
});
