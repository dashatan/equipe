import type { NextAuthConfig } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      location?: string
      isDemo?: boolean
    } & DefaultSessionUser
  }
}

// Minimal type alias to avoid importing DefaultSession here unnecessarily
type DefaultSessionUser = import('next-auth').DefaultSession['user']

export const authConfig = {
  pages: { signIn: '/auth' },
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.location = user.location
        token.isDemo = user.isDemo
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.location = token.location
        session.user.isDemo = token.isDemo
      }
      return session
    },
  },
} satisfies NextAuthConfig
