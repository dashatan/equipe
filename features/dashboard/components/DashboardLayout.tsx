'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Shield,
} from 'lucide-react'

const navItems = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/nearby', label: 'Nearby', icon: MapPin },
  { href: '/chat', label: 'Messages', icon: MessageCircle },
] as const

const profileItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  const linkClass = (href: string) =>
    `w-full justify-start ${
      isActive(href)
        ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
    }`

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <Link href="/feed" className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            GroupFinder
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow border-r bg-card overflow-y-auto">
            <Link
              href="/feed"
              className="flex items-center px-4 py-6 text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              GroupFinder
            </Link>

            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className={linkClass(item.href)}>
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="px-4 py-4 space-y-1 border-t">
              {profileItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className={linkClass(item.href)}>
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}

              <Link href="/admin">
                <Button variant="ghost" className={linkClass('/admin')}>
                  <Shield className="h-4 w-4 mr-3" />
                  Admin Panel
                </Button>
              </Link>

              <Button variant="ghost" className="w-full justify-start" onClick={toggleTheme}>
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

            <div className="px-4 py-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user?.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex-1 min-w-0">
          <main className="p-6">{children}</main>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t">
          <nav className="flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center gap-1 h-16 justify-center ${
                  isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="lg:hidden h-16" />
    </div>
  )
}
