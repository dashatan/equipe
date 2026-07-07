'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
import { Users, Search, ArrowLeft, MapPin } from 'lucide-react'

interface GroupT {
  id: string; name: string; description: string; category: string; location: string
  currentMembers: number; maxMembers: number; memberCount: number; activityCount: number
  createdAt: string; creator: { id: string; name: string; avatar: string }
}

export function AdminGroups() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [groups, setGroups] = useState<GroupT[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      if (search) q.set('search', search)
      const res = await fetch(`/api/admin/groups?${q.toString()}`)
      if (res.status === 403) { toast.error('Admin access required'); router.push('/feed'); return }
      const data = await res.json()
      setGroups(data.groups ?? [])
    } catch {
      toast.error('Failed to load groups')
    } finally {
      setLoading(false)
    }
  }, [search, router])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.push('/'); return }
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [isAuthenticated, isLoading, load])

  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        <Button variant="outline" size="sm" onClick={() => router.push('/admin')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Groups Management</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search groups..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Groups ({groups.length})</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : groups.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground"><div className="text-4xl mb-2">👥</div>No groups found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Group</TableHead><TableHead>Category</TableHead><TableHead>Location</TableHead>
                      <TableHead>Members</TableHead><TableHead>Activities</TableHead><TableHead>Creator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.map((g) => (
                      <TableRow key={g.id}>
                        <TableCell>
                          <div className="font-medium">{g.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{g.description}</div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{g.category}</Badge></TableCell>
                        <TableCell><div className="flex items-center gap-1 text-sm"><MapPin className="h-3 w-3" />{g.location}</div></TableCell>
                        <TableCell className="text-sm">{g.memberCount}/{g.maxMembers}</TableCell>
                        <TableCell className="text-sm">{g.activityCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6"><AvatarImage src={g.creator.avatar} alt={g.creator.name} /><AvatarFallback>{g.creator.name?.[0]}</AvatarFallback></Avatar>
                            <span className="text-sm">{g.creator.name}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
