'use client'

import { useAuth } from '@/features/auth/contexts/AuthContext'
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout'
import { LandingPage } from '@/features/landing/components/LandingPage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <LandingPage />
  }

  return <DashboardLayout>{children}</DashboardLayout>
}