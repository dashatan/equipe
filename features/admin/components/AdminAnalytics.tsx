'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
import { TrendingUp, ArrowLeft, Users, Calendar, MessageSquare, FileText } from 'lucide-react'

export function AdminAnalytics() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.push('/'); return }
    fetch('/api/admin/analytics')
      .then(async (res) => {
        if (res.status === 403) { toast.error('Admin access required'); router.push('/feed'); return null }
        return res.json()
      })
      .then((d) => d && setData(d))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return null

  const totals = data?.totals ?? {}
  const trends = data?.trends ?? {}
  const byStatus = data?.activitiesByStatus ?? {}
  const byCategory = data?.groupsByCategory ?? []

  const totalCards = [
    { label: 'Users', value: totals.users ?? 0, icon: Users, color: 'text-blue-600' },
    { label: 'Groups', value: totals.groups ?? 0, icon: Users, color: 'text-purple-600' },
    { label: 'Activities', value: totals.activities ?? 0, icon: Calendar, color: 'text-green-600' },
    { label: 'Posts', value: totals.posts ?? 0, icon: FileText, color: 'text-orange-600' },
    { label: 'Messages', value: totals.messages ?? 0, icon: MessageSquare, color: 'text-red-600' },
    { label: 'Images', value: totals.images ?? 0, icon: FileText, color: 'text-indigo-600' },
  ]

  const maxCat = Math.max(1, ...byCategory.map((c: any) => c.count))

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        <Button variant="outline" size="sm" onClick={() => router.push('/admin')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {totalCards.map((c) => (
            <Card key={c.label}>
              <CardContent className="pt-6">
                <c.icon className={`h-5 w-5 ${c.color} mb-2`} />
                <div className="text-2xl font-bold">{c.value.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{c.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Trends</CardTitle><CardDescription>Recent growth</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Row label="New users (7d)" value={trends.newUsers7d ?? 0} />
              <Row label="New users (30d)" value={trends.newUsers30d ?? 0} />
              <Row label="New posts (7d)" value={trends.newPosts7d ?? 0} />
              <Row label="New groups (30d)" value={trends.newGroups30d ?? 0} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Activities by Status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(byStatus).map(([k, v]: any) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="capitalize text-sm">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
              {Object.keys(byStatus).length === 0 && <p className="text-sm text-muted-foreground">No data.</p>}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Groups by Category</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {byCategory.map((c: any) => (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="text-sm capitalize w-28 shrink-0">{c.category}</span>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{c.count}</span>
                </div>
              ))}
              {byCategory.length === 0 && <p className="text-sm text-muted-foreground">No data.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border-b pb-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-bold">{value.toLocaleString()}</span>
    </div>
  )
}
