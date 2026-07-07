import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'

const DEMO_USER = {
  id: 'demo-user-1',
  name: 'Alex Thompson',
  email: 'alex.demo@groupfinder.com',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  location: 'San Francisco, CA',
  isDemo: true,
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        const email = (creds?.email as string)?.trim().toLowerCase()
        const password = creds?.password as string
        if (!email || !password) return null

        if (email === 'demo@test.com' && password === 'demo') {
          return {
            id: DEMO_USER.id,
            name: DEMO_USER.name,
            email: DEMO_USER.email,
            image: DEMO_USER.image,
            location: DEMO_USER.location,
            isDemo: true,
          } as any
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) return null

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
          location: user.location,
          isDemo: false,
        } as any
      },
    }),
  ],
})
