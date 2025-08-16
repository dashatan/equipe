'use client'

import { useState } from 'react'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { LandingPage } from '@/features/landing/components/LandingPage'
import { DashboardLayout } from './DashboardLayout'
import { FeedPage } from '@/features/feed/components/FeedPage'
import { ExplorePage } from '@/features/explore/components/ExplorePage'
import { GroupsPage } from '@/features/groups/components/GroupsPage'
import { NearbyPage } from '@/features/nearby/components/NearbyPage'
import { ChatPage } from '@/features/chat/components/ChatPage'
import { ProfilePage } from '@/features/profile/components/ProfilePage'
import { SettingsPage } from '@/features/settings/components/SettingsPage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

type ActivePage = 'feed' | 'explore' | 'groups' | 'nearby' | 'chat' | 'profile' | 'settings'

export function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth()
  const [activePage, setActivePage] = useState<ActivePage>('feed')

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <LandingPage />
  }

  const renderPage = () => {
    switch (activePage) {
      case 'feed':
        return <FeedPage />
      case 'explore':
        return <ExplorePage />
      case 'groups':
        return <GroupsPage />
      case 'nearby':
        return <NearbyPage />
      case 'chat':
        return <ChatPage />
      case 'profile':
        return <ProfilePage />
      case 'settings':
        return <SettingsPage />
      default:
        return <FeedPage />
    }
  }

  return (
    <DashboardLayout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </DashboardLayout>
  )
}