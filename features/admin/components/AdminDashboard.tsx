'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { 
  Users, 
  FileText, 
  Images, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  Shield,
  Settings
} from 'lucide-react'

interface DashboardStats {
  users: number
  groups: number
  activities: number
  posts: number
  images: number
  messages: number
}

export function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
      return
    }

    if (user && !user.isDemo) {
      // In a real app, check if user is admin
      // For now, we'll allow demo user to access admin
    }

    fetchStats()
  }, [isAuthenticated, isLoading, user, router])

  const fetchStats = async () => {
    try {
      setIsLoadingStats(true)
      // Mock data for demo
      const mockStats = {
        users: 15847,
        groups: 1249,
        activities: 3567,
        posts: 8932,
        images: 12458,
        messages: 45782
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return null
  }

  const dashboardItems = [
    {
      title: 'Users Management',
      description: 'Manage users, view profiles, and handle user reports',
      icon: Users,
      count: stats?.users || 0,
      href: '/admin/users',
      color: 'text-blue-600'
    },
    {
      title: 'Content Management',
      description: 'Create and edit pages, posts, and announcements',
      icon: FileText,
      count: stats?.posts || 0,
      href: '/admin/content',
      color: 'text-green-600'
    },
    {
      title: 'Groups & Activities',
      description: 'Monitor groups and activities, approve new ones',
      icon: Calendar,
      count: stats?.groups || 0,
      href: '/admin/groups',
      color: 'text-purple-600'
    },
    {
      title: 'Media Library',
      description: 'Manage uploaded images and files',
      icon: Images,
      count: stats?.images || 0,
      href: '/admin/media',
      color: 'text-orange-600'
    },
    {
      title: 'Messages & Reports',
      description: 'Monitor messages and handle user reports',
      icon: MessageSquare,
      count: stats?.messages || 0,
      href: '/admin/messages',
      color: 'text-red-600'
    },
    {
      title: 'Analytics',
      description: 'View app usage statistics and trends',
      icon: TrendingUp,
      count: 0,
      href: '/admin/analytics',
      color: 'text-indigo-600'
    }
  ]

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening with GroupFinder.
          </p>
          <Badge variant="secondary" className="mt-2">
            <Shield className="h-3 w-3 mr-1" />
            Administrator
          </Badge>
        </div>

        {/* Stats Overview */}
        {isLoadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-0 pb-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dashboardItems.map((item) => (
              <Card key={item.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-base font-medium">
                    {item.title}
                  </CardTitle>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    {item.count.toLocaleString()}
                  </div>
                  <CardDescription className="text-xs">
                    {item.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => router.push(item.href)}
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Create Announcement</div>
                  <div className="text-xs text-muted-foreground">
                    Notify all users
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Featured Groups</div>
                  <div className="text-xs text-muted-foreground">
                    Manage highlights
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">User Reports</div>
                  <div className="text-xs text-muted-foreground">
                    Review pending reports
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">System Settings</div>
                  <div className="text-xs text-muted-foreground">
                    App configuration
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}