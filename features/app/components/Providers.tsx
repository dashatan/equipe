'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/features/theme/contexts/ThemeContext'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { DemoProvider } from '@/contexts/DemoContext'


export function Providers({ children,  }: { children: React.ReactNode; }) {


  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthProvider>
          <DemoProvider>{children}</DemoProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
