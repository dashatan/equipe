'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { format } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, MapPin, Star, Users, CheckCircle, Pencil, Save, X } from 'lucide-react'
import { useAuth } from '@/features/auth/contexts/AuthContext'

interface MeT {
  id: string; name: string; email: string; avatar: string; bio: string; location: string
  interests: string[]; skills: string[]; completedActivities: number; rating: number
  joinedGroups: number; createdAt: string
  groups: { id: string; name: string; coverImage: string; category: string }[]
  activities: { id: string; title: string; date: string; status: string }[]
  posts: { id: string; content: string; createdAt: string }[]
}

export function ProfilePage() {
  const { user } = useAuth()
  const [me, setMe] = useState<MeT | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '', location: '', avatar: '', interests: '', skills: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users/me')
      if (!res.ok) throw new Error()
      const data: MeT = await res.json()
      setMe(data)
      setForm({
        name: data.name,
        bio: data.bio,
        location: data.location,
        avatar: data.avatar,
        interests: data.interests.join(', '),
        skills: data.skills.join(', '),
      })
    } catch {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          bio: form.bio,
          location: form.location,
          avatar: form.avatar,
          interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
          skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Profile updated!')
      setEditing(false)
      load()
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!me) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          <div className="h-28 bg-gradient-to-br from-primary/30 to-accent/40" />
          <CardContent className="pt-0">
            <div className="flex items-end justify-between gap-4 -mt-12 flex-wrap">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={me.avatar} alt={me.name} />
                <AvatarFallback className="text-2xl">{me.name?.[0]}</AvatarFallback>
              </Avatar>
              <Button variant={editing ? 'outline' : 'default'} onClick={() => setEditing(!editing)} className="mb-1">
                {editing ? <><X className="h-4 w-4 mr-2" /> Cancel</> : <><Pencil className="h-4 w-4 mr-2" /> Edit Profile</>}
              </Button>
            </div>

            {!editing ? (
              <div className="space-y-4 mt-4">
                <div>
                  <h2 className="text-xl font-bold">{me.name}</h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {me.location || 'No location'}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {me.rating.toFixed(1)}</span>
                  </div>
                </div>
                {me.bio && <p className="text-muted-foreground">{me.bio}</p>}
                <div className="grid grid-cols-3 gap-3">
                  <Stat label="Activities" value={me.completedActivities} icon={<CheckCircle className="h-4 w-4" />} />
                  <Stat label="Groups" value={me.joinedGroups} icon={<Users className="h-4 w-4" />} />
                  <Stat label="Rating" value={me.rating.toFixed(1)} icon={<Star className="h-4 w-4" />} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {me.interests.map((i) => <Badge key={i} variant="secondary">{i}</Badge>)}
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {me.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Avatar URL</Label>
                  <Input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Interests (comma separated)</Label>
                    <Input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Skills (comma separated)</Label>
                    <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
                  </div>
                </div>
                <Button onClick={save} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">Groups ({me.groups.length})</TabsTrigger>
          <TabsTrigger value="activities">Activities ({me.activities.length})</TabsTrigger>
          <TabsTrigger value="posts">Posts ({me.posts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="groups" className="space-y-2 mt-4">
          {me.groups.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No groups joined yet.</p>
          ) : me.groups.map((g) => (
            <Link key={g.id} href={`/groups/${g.id}`}>
              <Card className="hover:shadow-sm transition-shadow"><CardContent className="flex items-center gap-3 py-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{g.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{g.category}</div>
                </div>
              </CardContent></Card>
            </Link>
          ))}
        </TabsContent>
        <TabsContent value="activities" className="space-y-2 mt-4">
          {me.activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No activities joined yet.</p>
          ) : me.activities.map((a) => (
            <Card key={a.id}><CardContent className="flex items-center gap-3 py-3">
              <div className="flex-1">
                <div className="font-medium text-sm">{a.title}</div>
                <div className="text-xs text-muted-foreground">{format(new Date(a.date), 'MMM d, yyyy')}</div>
              </div>
              <Badge variant="secondary" className="capitalize">{a.status}</Badge>
            </CardContent></Card>
          ))}
        </TabsContent>
        <TabsContent value="posts" className="space-y-2 mt-4">
          {me.posts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No posts yet.</p>
          ) : me.posts.map((p) => (
            <Card key={p.id}><CardContent className="py-3">
              <p className="text-sm line-clamp-2">{p.content}</p>
              <div className="text-xs text-muted-foreground mt-1">{formatDistanceToDate(p.createdAt)}</div>
            </CardContent></Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/40 p-3 text-center">
      <div className="flex items-center justify-center text-primary mb-1">{icon}</div>
      <div className="font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function formatDistanceToDate(iso: string) {
  return format(new Date(iso), 'MMM d, yyyy')
}
