'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
import { FileText, Search, Plus, Edit, Trash2, ArrowLeft, Calendar, User } from 'lucide-react'

interface Content {
  id: string
  type: string
  title: string
  slug: string
  content: string
  excerpt?: string
  status: string
  author: { name: string; avatar?: string }
  tags: string[]
  updatedAt: string
}

const emptyForm = { type: 'page', title: '', slug: '', content: '', excerpt: '', status: 'draft', tags: '' }

export function AdminContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Content | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)

  const fetchContents = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      if (search) q.set('search', search)
      if (typeFilter !== 'all') q.set('type', typeFilter)
      if (statusFilter !== 'all') q.set('status', statusFilter)
      const res = await fetch(`/api/admin/content?${q.toString()}`)
      if (res.status === 403) { toast.error('Admin access required'); router.push('/feed'); return }
      const data = await res.json()
      setContents(data.content ?? [])
    } catch {
      toast.error('Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter, statusFilter, router])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.push('/'); return }
    const t = setTimeout(fetchContents, 250)
    return () => clearTimeout(t)
  }, [isAuthenticated, isLoading, fetchContents])

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  const createContent = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type, title: form.title, slug: form.slug || generateSlug(form.title),
          content: form.content, excerpt: form.excerpt, status: form.status,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error ?? 'Failed') }
      toast.success('Content created')
      setCreateOpen(false)
      setForm({ ...emptyForm })
      fetchContents()
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to create')
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (c: Content) => {
    setEditing(c)
    setForm({ type: c.type, title: c.title, slug: c.slug, content: c.content, excerpt: c.excerpt ?? '', status: c.status, tags: c.tags.join(', ') })
    setEditOpen(true)
  }

  const updateContent = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/content/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type, title: form.title, slug: form.slug, content: form.content,
          excerpt: form.excerpt, status: form.status,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Content updated')
      setEditOpen(false)
      fetchContents()
    } catch {
      toast.error('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const deleteContent = async (id: string) => {
    if (!confirm('Delete this content?')) return
    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Content deleted')
      fetchContents()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  const formFields = (idPrefix: string) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['page', 'post', 'announcement', 'category', 'landing_section', 'faq', 'legal'].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['draft', 'published', 'archived'].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Title</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || generateSlug(e.target.value) })} placeholder={`${idPrefix} title`} />
      </div>
      <div>
        <Label>Slug</Label>
        <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="url-friendly-slug" />
      </div>
      <div>
        <Label>Excerpt</Label>
        <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
      </div>
      <div>
        <Label>Content</Label>
        <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} />
      </div>
      <div>
        <Label>Tags (comma-separated)</Label>
        <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="tag1, tag2" />
      </div>
    </div>
  )

  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Content Management</h1>
              </div>
              <p className="text-muted-foreground">Create and manage pages, posts, announcements, and more.</p>
            </div>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Create Content</Button></DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Create New Content</DialogTitle><DialogDescription>Create a new page, post, or other content.</DialogDescription></DialogHeader>
                {formFields('Enter')}
                <DialogFooter><Button onClick={createContent} disabled={saving || !form.title}>{saving ? 'Creating...' : 'Create Content'}</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle>Filters & Search</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {['page', 'post', 'announcement', 'faq', 'legal'].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {['draft', 'published', 'archived'].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Content ({contents.length})</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : contents.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground"><div className="text-4xl mb-2">📄</div>No content found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead>
                      <TableHead>Author</TableHead><TableHead>Updated</TableHead><TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contents.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell><div className="font-medium">{c.title}</div><div className="text-sm text-muted-foreground">/{c.slug}</div></TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{c.type}</Badge></TableCell>
                        <TableCell><Badge variant={c.status === 'published' ? 'default' : c.status === 'draft' ? 'secondary' : 'outline'} className="capitalize">{c.status}</Badge></TableCell>
                        <TableCell><div className="flex items-center gap-1 text-sm"><User className="h-3 w-3" />{c.author.name}</div></TableCell>
                        <TableCell><div className="flex items-center gap-1 text-sm"><Calendar className="h-3 w-3" />{fmt(c.updatedAt)}</div></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEdit(c)}><Edit className="h-3 w-3" /></Button>
                            <Button variant="outline" size="sm" onClick={() => deleteContent(c.id)}><Trash2 className="h-3 w-3" /></Button>
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

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Edit Content</DialogTitle><DialogDescription>Make changes to your content.</DialogDescription></DialogHeader>
            {formFields('edit')}
            <DialogFooter><Button onClick={updateContent} disabled={saving || !form.title}>{saving ? 'Updating...' : 'Update Content'}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
