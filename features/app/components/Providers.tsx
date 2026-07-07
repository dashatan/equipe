'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/features/theme/contexts/ThemeContext'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
