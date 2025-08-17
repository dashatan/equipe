'use client'

import { ThemeProvider } from '@/features/theme/contexts/ThemeContext'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { DemoProvider } from '@/contexts/DemoContext'
import { locale } from '@/lang'
import { useEffect } from 'react'

export function Providers({ children, locale: lang }: { children: React.ReactNode; locale: string }) {
  useEffect(() => {
    locale.value = lang
  }, [lang])

  return (
    <ThemeProvider>
      <AuthProvider>
        <DemoProvider>{children}</DemoProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}