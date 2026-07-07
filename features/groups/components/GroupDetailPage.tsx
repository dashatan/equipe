'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { format } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, MapPin, Users, Calendar, UserPlus, LogOut, UserCheck } from 'lucide-react'
import { useAuth } from '@/features/auth/contexts/AuthContext'

interface GroupDetailT {
  id: string; name: string; description: string; category: string; location: string
  coverImage: string; currentMembers: number; maxMembers: number; tags: string[]
  creator: { id: string; name: string; avatar: string; location: string }
  members: { user: { id: string; name: string; avatar: string } }[]
  admins: { user: { id: string; name: string; avatar: string } }[]
  activities: { id: string; title: string; date: string; location: string; status: string; currentParticipants: number; maxParticipants: number }[]
  posts: { id: string; content: string; createdAt: string; author: { id: string; name: string; avatar: string } }[]
}

export function GroupDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [group, setGroup] = useState<GroupDetailT | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/groups/${params.id}`)
      if (!res.ok) throw new Error()
      setGroup(await res.json())
    } catch {
      toast.error('Group not found')
      router.push('/groups')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => { load() }, [load])

  const isMember = group?.members.some((m) => m.user.id === user?.id)
  const isCreator = group?.creator.id === user?.id

  const toggleMembership = async () => {
    setJoining(true)
    try {
      const res = await fetch(`/api/groups/${params.id}/join`, { method: isMember ? 'DELETE' : 'POST' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Failed')
      }
      toast.success(isMember ? 'Left group' : 'Joined group!')
      load()
    } catch (e: any) {
      toast.error(e.message ?? 'Failed')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  if (!group) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/groups" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to groups
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          <div className="h-40 bg-gradient-to-br from-primary/30 to-accent/40 relative">
            {group.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
            )}
            <Badge variant="secondary" className="absolute top-3 right-3 capitalize">{group.category}</Badge>
          </div>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{group.name}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {group.location}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {group.currentMembers}/{group.maxMembers}</span>
                </div>
              </div>
              {!isCreator && (
                <Button
                  onClick={toggleMembership}
                  disabled={joining}
                  variant={isMember ? 'outline' : 'default'}
                >
                  {isMember ? <><LogOut className="h-4 w-4 mr-2" /> Leave</> : <><UserPlus className="h-4 w-4 mr-2" /> Join</>}
                </Button>
              )}
              {isCreator && (
                <Badge variant="secondary" className="text-sm"><UserCheck className="h-3 w-3 mr-1" /> Creator</Badge>
              )}
            </div>
            <p className="text-muted-foreground">{group.description}</p>
            {group.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {group.tags.map((t) => <Badge key={t} variant="outline">#{t}</Badge>)}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Upcoming Activities ({group.activities.length})</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {group.activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming activities.</p>
            ) : group.activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(a.date), 'EEE, MMM d')} · {a.currentParticipants}/{a.maxParticipants}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Members ({group.members.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {group.members.map((m) => (
                <div key={m.user.id} className="flex flex-col items-center gap-1 w-16">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={m.user.avatar} alt={m.user.name} />
                    <AvatarFallback>{m.user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center truncate w-full">{m.user.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Recent Posts</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {group.posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts in this group yet.</p>
          ) : group.posts.map((p) => (
            <div key={p.id} className="flex gap-3 p-3 rounded-lg bg-muted/40">
              <Avatar className="h-8 w-8">
                <AvatarImage src={p.author.avatar} alt={p.author.name} />
                <AvatarFallback>{p.author.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium">{p.author.name}</div>
                <div className="text-sm">{p.content}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
