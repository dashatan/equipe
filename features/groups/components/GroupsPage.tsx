'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Users, MapPin, Plus, UserPlus, ArrowRight } from 'lucide-react'

const CATEGORIES = ['outdoor', 'music', 'study', 'gaming', 'sports', 'art', 'tech', 'cooking', 'fitness', 'travel', 'social', 'volunteering']

interface GroupT {
  id: string; name: string; description: string; category: string; location: string
  coverImage: string; currentMembers: number; maxMembers: number; tags: string[]
  creator: { id: string; name: string; avatar: string }
}

export function GroupsPage() {
  const [groups, setGroups] = useState<GroupT[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', category: 'outdoor', location: '', maxMembers: '50',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/groups?limit=50')
      const data = await res.json()
      setGroups(data.groups ?? [])
    } catch {
      toast.error('Failed to load groups')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

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

  const createGroup = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
          location: form.location,
          maxMembers: parseInt(form.maxMembers) || 50,
          tags: [],
          activityLevel: 'medium',
          skillLevel: 'all',
          meetingFrequency: 'Weekly',
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Group created!')
      setOpen(false)
      setForm({ name: '', description: '', category: 'outdoor', location: '', maxMembers: '50' })
      load()
    } catch {
      toast.error('Failed to create group')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Groups</h1>
            <p className="text-sm text-muted-foreground">Find your community</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Group</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create a Group</DialogTitle>
              <DialogDescription>Start a new community around a shared interest.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="g-name">Name</Label>
                <Input id="g-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bay Area Photographers" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="g-desc">Description</Label>
                <Textarea id="g-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="What is this group about?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="g-loc">Location</Label>
                  <Input id="g-loc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="g-max">Max members</Label>
                <Input id="g-max" type="number" value={form.maxMembers} onChange={(e) => setForm({ ...form, maxMembers: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={createGroup} disabled={creating || !form.name || !form.description}>
                {creating ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <div className="text-5xl">👥</div>
            <h3 className="text-lg font-semibold">No groups yet</h3>
            <p className="text-muted-foreground">Create the first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="h-full overflow-hidden hover:shadow-md hover:border-primary/40 transition-all group">
                <div className="h-28 bg-gradient-to-br from-primary/20 to-accent/30 relative">
                  {g.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.coverImage} alt={g.name} className="w-full h-full object-cover" />
                  )}
                  <Badge variant="secondary" className="absolute top-2 right-2 capitalize">{g.category}</Badge>
                </div>
                <CardContent className="space-y-3">
                  <Link href={`/groups/${g.id}`}>
                    <h3 className="font-semibold group-hover:text-primary transition-colors flex items-center gap-1">
                      {g.name} <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2">{g.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {g.location}
                    <span>·</span>
                    <Users className="h-3 w-3" /> {g.currentMembers}/{g.maxMembers}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={g.creator.avatar} alt={g.creator.name} />
                        <AvatarFallback>{g.creator.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{g.creator.name}</span>
                    </div>
                    <Button size="sm" variant="outline" disabled={joining === g.id} onClick={() => joinGroup(g.id)}>
                      <UserPlus className="h-3 w-3 mr-1" /> Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
