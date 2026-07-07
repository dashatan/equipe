import NextAuth from 'next-auth'
import type { NextRequest } from 'next/server'
import { authConfig } from './auth.config'

const { auth } = NextAuth(authConfig)

export function proxy(request: NextRequest) {
  return auth(request as any)
}

export const config = {
  matcher: ['/((?!api/auth|_next|_vercel|.*\\..*).*)'],
}
