'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { useTheme } from '@/features/theme/contexts/ThemeContext'
import { 
  Home, 
  Compass, 
  Users, 
  MapPin, 
  MessageCircle, 
  User, 
  Settings,
  Moon,
  Sun,
  LogOut,
  Shield
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type ActivePage = 'feed' | 'explore' | 'groups' | 'nearby' | 'chat' | 'profile' | 'settings'

interface DashboardLayoutProps {
  children: ReactNode
  activePage: ActivePage
  setActivePage: (page: ActivePage) => void
}

export function DashboardLayout({ children, activePage, setActivePage }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const navigationItems = [
    { id: 'feed' as const, label: 'Feed', icon: Home },
    { id: 'explore' as const, label: 'Explore', icon: Compass },
    { id: 'groups' as const, label: 'Groups', icon: Users },
    { id: 'nearby' as const, label: 'Nearby', icon: MapPin },
    { id: 'chat' as const, label: 'Messages', icon: MessageCircle },
  ]

  const profileItems = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">GroupFinder</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow border-r bg-card overflow-y-auto">
            {/* Header */}
            <div className="flex items-center px-4 py-6">
              <h1 className="text-xl font-bold">GroupFinder</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activePage === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActivePage(item.id)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Profile Section */}
            <div className="px-4 py-4 space-y-1 border-t">
              {profileItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activePage === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActivePage(item.id)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
              
              {user?.isDemo && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push('/admin')}
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Admin Panel
                </Button>
              )}
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Button>
            </div>

            {/* User Info */}
            <div className="px-4 py-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {user?.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex-1">
          <main className="p-6">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t">
          <nav className="flex">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activePage === item.id ? "default" : "ghost"}
                className="flex-1 rounded-none h-16 flex-col gap-1"
                onClick={() => setActivePage(item.id)}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="lg:hidden h-16" />
    </div>
  )
}