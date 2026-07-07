'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { format } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Compass, MapPin, Users, Calendar, Search, UserPlus } from 'lucide-react'
import { useAuth } from '@/features/auth/contexts/AuthContext'

const CATEGORIES = ['outdoor', 'music', 'study', 'gaming', 'sports', 'art', 'tech', 'cooking', 'fitness', 'travel', 'social', 'volunteering']

interface ActivityT {
  id: string; title: string; description: string; category: string; date: string
  location: string; cost: number; maxParticipants: number; currentParticipants: number
  status: string; difficulty: string
  group: { id: string; name: string }; organizer: { id: string; name: string; avatar: string }
}
interface GroupT {
  id: string; name: string; description: string; category: string; location: string
  coverImage: string; currentMembers: number; maxMembers: number; tags: string[]
  creator: { id: string; name: string; avatar: string }
}

export function ExplorePage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<'activities' | 'groups'>('activities')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const [activities, setActivities] = useState<ActivityT[]>([])
  const [groups, setGroups] = useState<GroupT[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      if (search) q.set('search', search)
      if (category) q.set('category', category)
      const [aRes, gRes] = await Promise.all([
        fetch(`/api/activities?status=upcoming&${q.toString()}`),
        fetch(`/api/groups?${q.toString()}`),
      ])
      const a = await aRes.json()
      const g = await gRes.json()
      setActivities(a.activities ?? [])
      setGroups(g.groups ?? [])
    } catch {
      toast.error('Failed to load')
    } finally {
      setLoading(false)
    }
  }, [search, category])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const joinGroup = async (id: string) => {
    setJoining(id)
    try {
      const res = await fetch(`/api/groups/${id}/join`, { method: 'POST' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Failed')
      }
      toast.success('Joined group!')
      load()
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to join')
    } finally {
      setJoining(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Compass className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Explore</h1>
          <p className="text-sm text-muted-foreground">Discover activities and groups near you</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={category === '' ? 'default' : 'outline'}
          onClick={() => setCategory('')}
        >
          All
        </Button>
        {CATEGORIES.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={category === c ? 'default' : 'outline'}
            onClick={() => setCategory(c)}
            className="capitalize"
          >
            {c}
          </Button>
        ))}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="activities">Activities ({activities.length})</TabsTrigger>
          <TabsTrigger value="groups">Groups ({groups.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4 mt-4">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
            </div>
          ) : activities.length === 0 ? (
            <EmptyState emoji="🗺️" title="No activities found" subtitle="Try a different search or category." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activities.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/groups/${a.group.id}`}>
                    <Card className="h-full hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold line-clamp-1">{a.title}</h3>
                          <Badge variant="secondary" className="capitalize shrink-0">{a.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                        <div className="space-y-1.5 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {format(new Date(a.date), 'EEE, MMM d · h:mm a')}</div>
                          <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {a.location}</div>
                          <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {a.currentParticipants}/{a.maxParticipants}</div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm font-medium">{a.cost === 0 ? 'Free' : `$${a.cost}`}</span>
                          <span className="text-xs text-muted-foreground">in {a.group.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups" className="space-y-4 mt-4">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
            </div>
          ) : groups.length === 0 ? (
            <EmptyState emoji="👥" title="No groups found" subtitle="Try a different search or category." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groups.map((g, i) => (
                <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="h-full overflow-hidden hover:shadow-md hover:border-primary/40 transition-all">
                    <div className="h-24 bg-gradient-to-br from-primary/20 to-accent/30 relative">
                      {g.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={g.coverImage} alt={g.name} className="w-full h-full object-cover" />
                      )}
                      <Badge variant="secondary" className="absolute top-2 right-2 capitalize">{g.category}</Badge>
                    </div>
                    <CardContent className="space-y-3">
                      <Link href={`/groups/${g.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors">{g.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-2">{g.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" /> {g.location}
                        <span className="mx-1">·</span>
                        <Users className="h-4 w-4" /> {g.currentMembers}/{g.maxMembers}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={g.creator.avatar} alt={g.creator.name} />
                            <AvatarFallback>{g.creator.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">by {g.creator.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={joining === g.id}
                          onClick={() => joinGroup(g.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" /> Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <Card>
      <CardContent className="py-16 text-center space-y-3">
        <div className="text-5xl">{emoji}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
