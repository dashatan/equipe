'use client'

import { ThemeProvider } from '@/features/theme/contexts/ThemeContext'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { DemoProvider } from '@/contexts/DemoContext'


export function Providers({ children,  }: { children: React.ReactNode; }) {
 

  return (
    <ThemeProvider>
      <AuthProvider>
        <DemoProvider>{children}</DemoProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}