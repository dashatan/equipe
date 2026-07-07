'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
import { Users, FileText, Images, MessageSquare, Calendar, TrendingUp, Shield, Settings, ArrowLeft } from 'lucide-react'

export function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.push('/'); return }
    fetchStats()
  }, [isAuthenticated, isLoading, router])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/analytics')
      if (res.status === 403) { toast.error('Admin access required'); router.push('/feed'); return }
      setStats(await res.json())
    } catch {
      toast.error('Failed to load stats')
    } finally {
      setLoadingStats(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return null

  const totals = stats?.totals
  const items = [
    { title: 'Users Management', desc: 'Manage users and accounts', icon: Users, count: totals?.users ?? 0, href: '/admin/users', color: 'text-blue-600' },
    { title: 'Content Management', desc: 'Create and edit pages, posts, announcements', icon: FileText, count: totals?.content ?? 0, href: '/admin/content', color: 'text-green-600' },
    { title: 'Groups & Activities', desc: 'Monitor groups and activities', icon: Calendar, count: totals?.groups ?? 0, href: '/admin/groups', color: 'text-purple-600' },
    { title: 'Media Library', desc: 'Manage uploaded images and files', icon: Images, count: totals?.images ?? 0, href: '/admin/media', color: 'text-orange-600' },
    { title: 'Messages', desc: 'Monitor messages across the platform', icon: MessageSquare, count: totals?.messages ?? 0, href: '/admin/messages', color: 'text-red-600' },
    { title: 'Analytics', desc: 'View usage statistics and trends', icon: TrendingUp, count: totals?.posts ?? 0, href: '/admin/analytics', color: 'text-indigo-600' },
  ]

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" size="sm" onClick={() => router.push('/feed')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to App
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Welcome back, {user?.name}. Here&apos;s what&apos;s happening with GroupFinder.</p>
          <Badge variant="secondary" className="mt-2"><Shield className="h-3 w-3 mr-1" />Administrator</Badge>
        </div>

        {loadingStats ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-0 pb-3"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /></CardHeader>
                <CardContent><div className="h-8 bg-muted rounded w-1/3" /></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {items.map((item) => (
              <Card key={item.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-base font-medium">{item.title}</CardTitle>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{item.count.toLocaleString()}</div>
                  <CardDescription className="text-xs">{item.desc}</CardDescription>
                  <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => router.push(item.href)}>Manage</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => router.push('/admin/content')}>
                <div className="text-left"><div className="font-medium">Create Announcement</div><div className="text-xs text-muted-foreground">Notify all users</div></div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => router.push('/admin/groups')}>
                <div className="text-left"><div className="font-medium">Featured Groups</div><div className="text-xs text-muted-foreground">Manage highlights</div></div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => router.push('/admin/messages')}>
                <div className="text-left"><div className="font-medium">Message Reports</div><div className="text-xs text-muted-foreground">Review messages</div></div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => router.push('/admin/analytics')}>
                <div className="text-left"><div className="font-medium">View Analytics</div><div className="text-xs text-muted-foreground">Usage insights</div></div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
