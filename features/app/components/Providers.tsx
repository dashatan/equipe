'use client'

import { ThemeProvider } from '@/features/theme/contexts/ThemeContext'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="groupfinder-theme">
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}